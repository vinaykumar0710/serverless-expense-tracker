"""
Budget Lambda Handler
======================
Manages the user's monthly budget stored in the Budgets DynamoDB table.

Endpoints:
  GET  /budget  — Retrieve the current budget for the authenticated user
  POST /budget  — Create or update the monthly budget

Auth: Amazon Cognito JWT (via API Gateway HTTP API authorizer)
"""

import json
import os
from datetime import datetime, timezone
from decimal import Decimal

import boto3
from boto3.dynamodb.conditions import Key

# ---------------------------------------------------------------------------
# DynamoDB setup
# ---------------------------------------------------------------------------
dynamodb = boto3.resource("dynamodb")
budgets_table = dynamodb.Table(os.environ["BUDGETS_TABLE"])
expenses_table = dynamodb.Table(os.environ["EXPENSES_TABLE"])


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
class DecimalEncoder(json.JSONEncoder):
    """Custom JSON encoder that converts Decimal values to float."""

    def default(self, obj):
        if isinstance(obj, Decimal):
            return float(obj)
        return super().default(obj)


def _response(status_code, body):
    """Return a JSON-serializable API Gateway response."""
    return {
        "statusCode": status_code,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
        "body": json.dumps(body, cls=DecimalEncoder),
    }


def _get_current_month_spending(user_id):
    """Calculate total spending for the current calendar month."""
    now = datetime.now(timezone.utc)
    month_start = now.strftime("%Y-%m-01")
    month_end = now.strftime("%Y-%m-31")

    result = expenses_table.query(
        KeyConditionExpression=Key("userId").eq(user_id),
    )

    total = Decimal("0")
    for item in result.get("Items", []):
        expense_date = item.get("date", "")
        if month_start <= expense_date <= month_end:
            total += Decimal(str(item.get("amount", 0)))

    return total


# ---------------------------------------------------------------------------
# Handler
# ---------------------------------------------------------------------------
def lambda_handler(event, context):
    """Route to GET or POST handler based on the HTTP method."""
    try:
        method = event.get("requestContext", {}).get("http", {}).get("method", "GET")
        user_id = event["requestContext"]["authorizer"]["jwt"]["claims"]["sub"]

        if method == "GET":
            return _handle_get(user_id)
        elif method == "POST":
            return _handle_post(user_id, event)
        else:
            return _response(405, {"message": f"Method {method} not allowed"})

    except Exception as e:
        return _response(500, {
            "message": "Internal server error",
            "error": str(e),
        })


def _handle_get(user_id):
    """Retrieve the user's budget and current spending."""
    result = budgets_table.get_item(Key={"userId": user_id})
    budget = result.get("Item")

    if not budget:
        return _response(404, {"message": "No budget found"})

    # Compute current month's spending
    spent = _get_current_month_spending(user_id)
    monthly_limit = Decimal(str(budget.get("monthlyBudget", 0)))
    remaining = monthly_limit - spent
    utilization = (
        round((spent / monthly_limit) * 100) if monthly_limit > 0 else 0
    )

    return _response(200, {
        "monthlyLimit": monthly_limit,
        "spent": spent,
        "remaining": remaining,
        "utilizationPercent": utilization,
        "categoryBudgets": budget.get("categoryBudgets", []),
    })


def _handle_post(user_id, event):
    """Create or update the user's monthly budget."""
    body = json.loads(event.get("body", "{}"))
    monthly_budget = body.get("monthlyBudget")

    if monthly_budget is None:
        return _response(400, {"message": "monthlyBudget is required"})

    timestamp = datetime.now(timezone.utc).isoformat()

    budgets_table.put_item(Item={
        "userId": user_id,
        "monthlyBudget": Decimal(str(monthly_budget)),
        "updatedAt": timestamp,
    })

    # Return the updated budget with current spending
    spent = _get_current_month_spending(user_id)
    monthly_limit = Decimal(str(monthly_budget))
    remaining = monthly_limit - spent
    utilization = (
        round((spent / monthly_limit) * 100) if monthly_limit > 0 else 0
    )

    return _response(200, {
        "monthlyLimit": monthly_limit,
        "spent": spent,
        "remaining": remaining,
        "utilizationPercent": utilization,
        "categoryBudgets": [],
    })
