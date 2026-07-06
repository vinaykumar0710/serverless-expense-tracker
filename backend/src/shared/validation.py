"""
Shared Validation Helpers
==========================
Common input validation logic shared across Lambda handlers.
"""

REQUIRED_EXPENSE_FIELDS = ["title", "category", "amount", "date"]


def validate_expense(data):
    """
    Validate that all required fields are present in the expense payload.

    Args:
        data: dict — the parsed request body

    Returns:
        list — field names that are missing (empty list if valid)
    """
    return [field for field in REQUIRED_EXPENSE_FIELDS if field not in data]