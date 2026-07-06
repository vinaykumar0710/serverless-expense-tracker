"""
Shared DynamoDB Resource
=========================
Provides pre-configured DynamoDB table references used across Lambda handlers.
Table names are injected via environment variables set in each Lambda's
configuration on AWS.
"""

import os

import boto3

dynamodb = boto3.resource("dynamodb")

# Expenses table — partition key: userId, sort key: expenseId
expenses_table = dynamodb.Table(os.environ.get("EXPENSES_TABLE", "cloudspend-dev-expenses"))

# Budgets table — partition key: userId
budgets_table = dynamodb.Table(os.environ.get("BUDGETS_TABLE", "cloudspend-dev-budgets"))