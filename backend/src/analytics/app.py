"""
Analytics Lambda Handler
=========================
Computes spending analytics from the authenticated user's expense data.

Endpoint: GET /analytics
Auth:     Amazon Cognito JWT (via API Gateway HTTP API authorizer)

Returns:
  - monthlySpending:      spending totals per month
  - weeklySpending:       spending totals per day of the current week
  - yearlySpending:       spending totals per year
  - categoryDistribution: spending breakdown by category
  - summary:              aggregate statistics
"""

import json
import os
from collections import defaultdict
from datetime import datetime, timedelta, timezone
from decimal import Decimal

import boto3
from boto3.dynamodb.conditions import Key

# ---------------------------------------------------------------------------
# DynamoDB setup
# ---------------------------------------------------------------------------
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(os.environ["EXPENSES_TABLE"])

MONTH_ABBR = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
              "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

DAY_ABBR = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]


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
    """Handle GET /analytics — compute and return spending analytics."""
    try:
        user_id = event["requestContext"]["authorizer"]["jwt"]["claims"]["sub"]

        # Fetch all expenses for this user
        result = table.query(
            KeyConditionExpression=Key("userId").eq(user_id),
        )
        expenses = result.get("Items", [])

        now = datetime.now(timezone.utc)

        # ----- Monthly Spending (current year) -----
        monthly = defaultdict(Decimal)
        for exp in expenses:
            try:
                d = datetime.fromisoformat(exp["date"])
                if d.year == now.year:
                    monthly[d.month] += Decimal(str(exp.get("amount", 0)))
            except (ValueError, KeyError):
                continue

        monthly_spending = [
            {"month": MONTH_ABBR[m - 1], "amount": monthly.get(m, Decimal("0"))}
            for m in range(1, now.month + 1)
        ]

        # ----- Weekly Spending (current week, Mon–Sun) -----
        week_start = now - timedelta(days=now.weekday())
        weekly = defaultdict(Decimal)
        for exp in expenses:
            try:
                d = datetime.fromisoformat(exp["date"])
                delta = (d - week_start.replace(hour=0, minute=0, second=0, microsecond=0)).days
                if 0 <= delta < 7:
                    weekly[d.weekday()] += Decimal(str(exp.get("amount", 0)))
            except (ValueError, KeyError):
                continue

        weekly_spending = [
            {"day": DAY_ABBR[i], "amount": weekly.get(i, Decimal("0"))}
            for i in range(7)
        ]

        # ----- Yearly Spending -----
        yearly = defaultdict(Decimal)
        for exp in expenses:
            try:
                d = datetime.fromisoformat(exp["date"])
                yearly[d.year] += Decimal(str(exp.get("amount", 0)))
            except (ValueError, KeyError):
                continue

        yearly_spending = [
            {"year": y, "amount": yearly[y]}
            for y in sorted(yearly.keys())
        ]

        # ----- Category Distribution -----
        cat_totals = defaultdict(Decimal)
        for exp in expenses:
            cat = exp.get("category", "other")
            cat_totals[cat] += Decimal(str(exp.get("amount", 0)))

        grand_total = sum(cat_totals.values()) or Decimal("1")
        category_distribution = [
            {
                "category": cat.capitalize(),
                "amount": amt,
                "percentage": round(float(amt / grand_total) * 100),
            }
            for cat, amt in sorted(cat_totals.items(), key=lambda x: x[1], reverse=True)
        ]

        # ----- Summary -----
        total_spent = sum(Decimal(str(e.get("amount", 0))) for e in expenses)
        current_month = [
            e for e in expenses
            if e.get("date", "").startswith(now.strftime("%Y-%m"))
        ]
        current_month_spent = sum(Decimal(str(e.get("amount", 0))) for e in current_month)

        prev_month = now.replace(day=1) - timedelta(days=1)
        prev_prefix = prev_month.strftime("%Y-%m")
        previous_month_expenses = [
            e for e in expenses if e.get("date", "").startswith(prev_prefix)
        ]
        previous_month_spent = sum(Decimal(str(e.get("amount", 0))) for e in previous_month_expenses)

        monthly_change = (
            round(float((current_month_spent - previous_month_spent) / previous_month_spent) * 100, 1)
            if previous_month_spent > 0 else 0
        )

        first_date = min((e.get("date", "") for e in expenses), default="")
        if first_date:
            days_span = max((now - datetime.fromisoformat(first_date).replace(tzinfo=timezone.utc)).days, 1)
        else:
            days_span = 1
        average_daily = float(total_spent) / days_span

        highest = max(expenses, key=lambda e: float(e.get("amount", 0)), default=None)
        highest_expense = (
            {
                "title": highest.get("title", ""),
                "amount": Decimal(str(highest.get("amount", 0))),
                "date": highest.get("date", ""),
            }
            if highest else {"title": "—", "amount": 0, "date": ""}
        )

        summary = {
            "totalSpent": total_spent,
            "averageDaily": round(average_daily, 2),
            "highestExpense": highest_expense,
            "totalTransactions": len(expenses),
            "currentMonthSpent": current_month_spent,
            "previousMonthSpent": previous_month_spent,
            "monthlyChange": monthly_change,
        }

        return _response(200, {
            "monthlySpending": monthly_spending,
            "weeklySpending": weekly_spending,
            "yearlySpending": yearly_spending,
            "categoryDistribution": category_distribution,
            "summary": summary,
        })

    except Exception as e:
        return _response(500, {
            "message": "Internal server error",
            "error": str(e),
        })
