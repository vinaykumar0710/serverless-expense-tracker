# 📡 API Reference

CloudSpend exposes a RESTful API through **Amazon API Gateway** (HTTP API). All endpoints require a valid JWT token from Amazon Cognito in the `Authorization` header.

---

## Base URL

```
https://<api-id>.execute-api.<region>.amazonaws.com/dev
```

## Authentication

All requests must include:

```
Authorization: Bearer <cognito-access-token>
```

The token is obtained via the AWS Amplify `fetchAuthSession()` method after the user signs in through Amazon Cognito.

---

## Endpoints

### Expenses

#### `POST /expenses` — Create Expense

Creates a new expense for the authenticated user.

**Request Body:**

```json
{
  "title": "Grocery Shopping",
  "category": "food",
  "amount": 85.50,
  "date": "2026-07-01",
  "notes": "Weekly groceries"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | ✅ | Expense description |
| `category` | string | ✅ | One of: `food`, `travel`, `shopping`, `bills`, `entertainment`, `healthcare`, `education`, `other` |
| `amount` | number | ✅ | Positive number |
| `date` | string | ✅ | ISO date format (`YYYY-MM-DD`) |
| `notes` | string | ❌ | Optional notes |

**Response (201):**

```json
{
  "message": "Expense created successfully",
  "expenseId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

**Errors:**

| Status | Message |
|--------|---------|
| 400 | `Missing required fields` (with `missing` array) |
| 500 | `Internal server error` |

---

#### `GET /expenses` — List Expenses

Returns all expenses for the authenticated user, sorted by date descending.

**Response (200):**

```json
{
  "expenses": [
    {
      "userId": "cognito-sub-id",
      "expenseId": "uuid",
      "title": "Grocery Shopping",
      "category": "food",
      "amount": 85.50,
      "date": "2026-07-01",
      "notes": "Weekly groceries",
      "createdAt": "2026-07-01T10:30:00+00:00",
      "updatedAt": "2026-07-01T10:30:00+00:00"
    }
  ]
}
```

> **Note:** Filtering, searching, sorting, and pagination are handled client-side by the frontend's `expenseService`.

---

#### `PUT /expenses/{expenseId}` — Update Expense

Updates an existing expense. Only provided fields are updated.

**Path Parameters:**

| Parameter | Description |
|-----------|-------------|
| `expenseId` | UUID of the expense to update |

**Request Body (partial update):**

```json
{
  "title": "Updated Title",
  "amount": 95.00
}
```

**Response (200):**

```json
{
  "message": "Expense updated successfully",
  "expenseId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

---

#### `DELETE /expenses/{expenseId}` — Delete Expense

Deletes an expense by ID.

**Path Parameters:**

| Parameter | Description |
|-----------|-------------|
| `expenseId` | UUID of the expense to delete |

**Response (200):**

```json
{
  "message": "Expense deleted successfully",
  "expenseId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

---

### Budget

#### `GET /budget` — Get Budget

Returns the user's monthly budget with current spending calculations.

**Response (200):**

```json
{
  "monthlyLimit": 2500,
  "spent": 1950,
  "remaining": 550,
  "utilizationPercent": 78,
  "categoryBudgets": []
}
```

**Response (404):** Returned when no budget has been set yet.

```json
{
  "message": "No budget found"
}
```

---

#### `POST /budget` — Set Budget

Creates or updates the user's monthly budget.

**Request Body:**

```json
{
  "monthlyBudget": 2500
}
```

**Response (200):**

```json
{
  "monthlyLimit": 2500,
  "spent": 1950,
  "remaining": 550,
  "utilizationPercent": 78,
  "categoryBudgets": []
}
```

---

### Analytics

#### `GET /analytics` — Get Analytics

Returns computed spending analytics based on the user's expense history.

**Response (200):**

```json
{
  "monthlySpending": [
    { "month": "Jan", "amount": 2150 },
    { "month": "Feb", "amount": 1890 }
  ],
  "weeklySpending": [
    { "day": "Mon", "amount": 85 },
    { "day": "Tue", "amount": 120 }
  ],
  "yearlySpending": [
    { "year": 2025, "amount": 29400 },
    { "year": 2026, "amount": 14020 }
  ],
  "categoryDistribution": [
    { "category": "Food", "amount": 3250, "percentage": 23 }
  ],
  "summary": {
    "totalSpent": 14020,
    "averageDaily": 73.79,
    "highestExpense": {
      "title": "Flight Booking",
      "amount": 350.00,
      "date": "2026-06-23"
    },
    "totalTransactions": 25,
    "currentMonthSpent": 1950,
    "previousMonthSpent": 2680,
    "monthlyChange": -27.2
  }
}
```

---

## Error Response Format

All errors follow a consistent format:

```json
{
  "message": "Human-readable error description",
  "error": "Technical error detail (500 errors only)"
}
```

## DynamoDB Schema

### Expenses Table (`cloudspend-dev-expenses`)

| Attribute | Type | Key |
|-----------|------|-----|
| `userId` | String | Partition Key (HASH) |
| `expenseId` | String | Sort Key (RANGE) |
| `title` | String | — |
| `category` | String | — |
| `amount` | Number | — |
| `date` | String | — |
| `notes` | String | — |
| `createdAt` | String | — |
| `updatedAt` | String | — |

### Budgets Table (`cloudspend-dev-budgets`)

| Attribute | Type | Key |
|-----------|------|-----|
| `userId` | String | Partition Key (HASH) |
| `monthlyBudget` | Number | — |
| `updatedAt` | String | — |
