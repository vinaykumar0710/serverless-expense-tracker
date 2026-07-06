"""
Shared Response Helpers
========================
Standardized API Gateway response builders used across all Lambda handlers.
All responses include CORS headers for cross-origin frontend access.
"""

import json


def success(status_code, body):
    """Build a success response with the given status code and body dict."""
    return {
        "statusCode": status_code,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
        "body": json.dumps(body),
    }


def error(status_code, message):
    """Build an error response with the given status code and message string."""
    return {
        "statusCode": status_code,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
        "body": json.dumps({"message": message}),
    }