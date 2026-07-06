"""
Delete Expense Lambda Handler
===============================
Deletes an expense record from DynamoDB for the authenticated user.

Endpoint: DELETE /expenses/{expenseId}
Auth:     Amazon Cognito JWT (via API Gateway HTTP API authorizer)
"""

import json
import os

import boto3

# ---------------------------------------------------------------------------
# DynamoDB setup
# ---------------------------------------------------------------------------
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(os.environ["EXPENSES_TABLE"])


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
    """Handle DELETE /expenses/{expenseId} — remove an expense."""
    try:
        # Extract authenticated user ID from Cognito JWT claims
        user_id = event["requestContext"]["authorizer"]["jwt"]["claims"]["sub"]

        # Extract expense ID from path parameters
        expense_id = event.get("pathParameters", {}).get("expenseId")
        if not expense_id:
            return _response(400, {"message": "Missing expenseId path parameter"})

        # Delete the item (userId + expenseId form the composite key)
        table.delete_item(
            Key={"userId": user_id, "expenseId": expense_id},
        )

        return _response(200, {
            "message": "Expense deleted successfully",
            "expenseId": expense_id,
        })

    except Exception as e:
        return _response(500, {
            "message": "Internal server error",
            "error": str(e),
        })
