"""
Create Expense Lambda Handler
==============================
Creates a new expense record in DynamoDB for the authenticated user.

Endpoint: POST /expenses
Auth:     Amazon Cognito JWT (via API Gateway HTTP API authorizer)
"""

import json
import os
import uuid
from datetime import datetime, timezone
from decimal import Decimal

import boto3

# ---------------------------------------------------------------------------
# DynamoDB setup
# ---------------------------------------------------------------------------
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(os.environ["EXPENSES_TABLE"])

# Required fields for a valid expense payload
REQUIRED_FIELDS = ["title", "category", "amount", "date"]


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def _response(status_code, body):
    """Return a JSON-serializable API Gateway response."""
    return {
        "statusCode": status_code,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
        "body": json.dumps(body),
    }


# ---------------------------------------------------------------------------
# Handler
# ---------------------------------------------------------------------------
def lambda_handler(event, context):
    """Handle POST /expenses — create a new expense."""
    try:
        # Extract authenticated user ID from Cognito JWT claims
        user_id = event["requestContext"]["authorizer"]["jwt"]["claims"]["sub"]

        # Parse and validate request body
        body = json.loads(event.get("body", "{}"))
        missing = [f for f in REQUIRED_FIELDS if f not in body]
        if missing:
            return _response(400, {
                "message": "Missing required fields",
                "missing": missing,
            })

        # Build the DynamoDB item
        expense_id = str(uuid.uuid4())
        timestamp = datetime.now(timezone.utc).isoformat()

        item = {
            "userId": user_id,
            "expenseId": expense_id,
            "title": body["title"],
            "category": body["category"],
            "amount": Decimal(str(body["amount"])),
            "date": body["date"],
            "notes": body.get("notes", ""),
            "createdAt": timestamp,
            "updatedAt": timestamp,
        }

        table.put_item(Item=item)

        return _response(201, {
            "message": "Expense created successfully",
            "expenseId": expense_id,
        })

    except Exception as e:
        return _response(500, {
            "message": "Internal server error",
            "error": str(e),
        })