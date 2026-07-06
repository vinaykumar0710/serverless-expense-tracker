"""
Get Expenses Lambda Handler
============================
Retrieves all expense records for the authenticated user from DynamoDB.

Endpoint: GET /expenses
Auth:     Amazon Cognito JWT (via API Gateway HTTP API authorizer)
"""

import json
import os
from decimal import Decimal

import boto3

# ---------------------------------------------------------------------------
# DynamoDB setup
# ---------------------------------------------------------------------------
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(os.environ["EXPENSES_TABLE"])


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


# ---------------------------------------------------------------------------
# Handler
# ---------------------------------------------------------------------------
def lambda_handler(event, context):
    """Handle GET /expenses — return all expenses for the authenticated user."""
    try:
        # Extract authenticated user ID from Cognito JWT claims
        user_id = event["requestContext"]["authorizer"]["jwt"]["claims"]["sub"]

        # Query all expenses for this user (partition key = userId)
        result = table.query(
            KeyConditionExpression=boto3.dynamodb.conditions.Key("userId").eq(user_id),
        )

        expenses = result.get("Items", [])

        # Sort by date descending (most recent first)
        expenses.sort(key=lambda x: x.get("date", ""), reverse=True)

        return _response(200, {"expenses": expenses})

    except Exception as e:
        return _response(500, {
            "message": "Internal server error",
            "error": str(e),
        })
