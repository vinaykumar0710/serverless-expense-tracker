"""
Update Expense Lambda Handler
===============================
Updates an existing expense record in DynamoDB for the authenticated user.

Endpoint: PUT /expenses/{expenseId}
Auth:     Amazon Cognito JWT (via API Gateway HTTP API authorizer)
"""

import json
import os
from datetime import datetime, timezone
from decimal import Decimal

import boto3

# ---------------------------------------------------------------------------
# DynamoDB setup
# ---------------------------------------------------------------------------
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(os.environ["EXPENSES_TABLE"])

# Fields that can be updated
UPDATABLE_FIELDS = ["title", "category", "amount", "date", "notes"]


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
    """Handle PUT /expenses/{expenseId} — update an existing expense."""
    try:
        # Extract authenticated user ID from Cognito JWT claims
        user_id = event["requestContext"]["authorizer"]["jwt"]["claims"]["sub"]

        # Extract expense ID from path parameters
        expense_id = event.get("pathParameters", {}).get("expenseId")
        if not expense_id:
            return _response(400, {"message": "Missing expenseId path parameter"})

        # Parse request body
        body = json.loads(event.get("body", "{}"))

        # Build update expression dynamically from provided fields
        update_parts = []
        expression_values = {}
        expression_names = {}

        for field in UPDATABLE_FIELDS:
            if field in body:
                placeholder = f":{field}"
                name_placeholder = f"#{field}"
                update_parts.append(f"{name_placeholder} = {placeholder}")
                expression_names[name_placeholder] = field

                if field == "amount":
                    expression_values[placeholder] = Decimal(str(body[field]))
                else:
                    expression_values[placeholder] = body[field]

        if not update_parts:
            return _response(400, {"message": "No valid fields to update"})

        # Always update the timestamp
        update_parts.append("#updatedAt = :updatedAt")
        expression_names["#updatedAt"] = "updatedAt"
        expression_values[":updatedAt"] = datetime.now(timezone.utc).isoformat()

        update_expression = "SET " + ", ".join(update_parts)

        table.update_item(
            Key={"userId": user_id, "expenseId": expense_id},
            UpdateExpression=update_expression,
            ExpressionAttributeNames=expression_names,
            ExpressionAttributeValues=expression_values,
        )

        return _response(200, {
            "message": "Expense updated successfully",
            "expenseId": expense_id,
        })

    except Exception as e:
        return _response(500, {
            "message": "Internal server error",
            "error": str(e),
        })
