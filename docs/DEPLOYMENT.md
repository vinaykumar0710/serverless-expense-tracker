# 🚀 Deployment Guide

This guide covers deploying the CloudSpend application — both the React frontend and the AWS Lambda backend.

---

## Prerequisites

- **AWS Account** with appropriate IAM permissions
- **AWS CLI** configured with credentials (`aws configure`)
- **Node.js** v18+ and npm
- **Python** 3.12 (for Lambda development/testing)

---

## 1. AWS Resources Setup

### 1.1 Amazon Cognito

1. Navigate to **Amazon Cognito** in the AWS Console
2. Create a **User Pool** with the following settings:
   - Sign-in: Email
   - Password policy: Minimum 8 characters
   - MFA: Optional
   - Email verification: Enabled
3. Create an **App Client**:
   - Client type: Public client
   - Auth flows: `ALLOW_USER_SRP_AUTH`, `ALLOW_REFRESH_TOKEN_AUTH`
   - No client secret
4. Note down:
   - **User Pool ID** (e.g., `ap-south-1_XXXXXXXXX`)
   - **App Client ID** (e.g., `xxxxxxxxxxxxxxxxxxxxxxxxxx`)

### 1.2 Amazon DynamoDB

Create two tables:

**Expenses Table:**

| Setting | Value |
|---------|-------|
| Table name | `cloudspend-dev-expenses` |
| Partition key | `userId` (String) |
| Sort key | `expenseId` (String) |
| Billing mode | On-demand (PAY_PER_REQUEST) |

**Budgets Table:**

| Setting | Value |
|---------|-------|
| Table name | `cloudspend-dev-budgets` |
| Partition key | `userId` (String) |
| Billing mode | On-demand (PAY_PER_REQUEST) |

> **Alternative:** Deploy tables using the SAM template:
> ```bash
> cd backend
> aws cloudformation deploy \
>   --template-file template.yaml \
>   --stack-name cloudspend-dev \
>   --parameter-overrides Environment=dev
> ```

### 1.3 AWS Lambda Functions

Deploy each function from `backend/src/`:

| Function | Source Directory | Handler | Environment Variables |
|----------|-----------------|---------|----------------------|
| `cloudspend-create-expense` | `create_expense/` | `app.lambda_handler` | `EXPENSES_TABLE` |
| `cloudspend-get-expenses` | `get_expenses/` | `app.lambda_handler` | `EXPENSES_TABLE` |
| `cloudspend-update-expense` | `update_expense/` | `app.lambda_handler` | `EXPENSES_TABLE` |
| `cloudspend-delete-expense` | `delete_expense/` | `app.lambda_handler` | `EXPENSES_TABLE` |
| `cloudspend-budget` | `budget/` | `app.lambda_handler` | `EXPENSES_TABLE`, `BUDGETS_TABLE` |
| `cloudspend-analytics` | `analytics/` | `app.lambda_handler` | `EXPENSES_TABLE` |

**For each function:**

1. Create a new Lambda function in the AWS Console
2. Runtime: **Python 3.12**
3. Architecture: **x86_64**
4. Memory: **256 MB**
5. Timeout: **30 seconds**
6. Upload the `app.py` file (or zip the directory)
7. Set environment variables:
   - `EXPENSES_TABLE` = `cloudspend-dev-expenses`
   - `BUDGETS_TABLE` = `cloudspend-dev-budgets` (budget function only)
8. Attach an IAM execution role with DynamoDB permissions

**IAM Policy for Lambda execution role:**

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem",
        "dynamodb:Query"
      ],
      "Resource": [
        "arn:aws:dynamodb:*:*:table/cloudspend-dev-expenses",
        "arn:aws:dynamodb:*:*:table/cloudspend-dev-budgets"
      ]
    }
  ]
}
```

### 1.4 API Gateway

1. Create an **HTTP API** in API Gateway
2. Add a **JWT Authorizer**:
   - Issuer: `https://cognito-idp.<region>.amazonaws.com/<user-pool-id>`
   - Audience: Your Cognito App Client ID
3. Create routes and attach Lambda integrations:

| Route | Method | Lambda Integration | Auth |
|-------|--------|--------------------|------|
| `/expenses` | POST | cloudspend-create-expense | JWT |
| `/expenses` | GET | cloudspend-get-expenses | JWT |
| `/expenses/{expenseId}` | PUT | cloudspend-update-expense | JWT |
| `/expenses/{expenseId}` | DELETE | cloudspend-delete-expense | JWT |
| `/budget` | GET | cloudspend-budget | JWT |
| `/budget` | POST | cloudspend-budget | JWT |
| `/analytics` | GET | cloudspend-analytics | JWT |

4. Deploy to the `dev` stage
5. Note down the **Invoke URL** (e.g., `https://xxxxxxxxxx.execute-api.ap-south-1.amazonaws.com/dev`)

---

## 2. Frontend Deployment

### 2.1 Configure Environment

```bash
cd frontend
cp .env.example .env
```

Edit `.env` with your AWS resource IDs:

```env
VITE_AWS_REGION=ap-south-1
VITE_USER_POOL_ID=ap-south-1_XXXXXXXXX
VITE_USER_POOL_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_API_URL=https://xxxxxxxxxx.execute-api.ap-south-1.amazonaws.com/dev
```

### 2.2 Build

```bash
npm install
npm run build
```

This generates a production-ready `dist/` directory.

### 2.3 Deploy to S3 + CloudFront (Recommended)

```bash
# Create S3 bucket
aws s3 mb s3://cloudspend-frontend --region ap-south-1

# Enable static website hosting
aws s3 website s3://cloudspend-frontend \
  --index-document index.html \
  --error-document index.html

# Upload build
aws s3 sync dist/ s3://cloudspend-frontend --delete

# Create CloudFront distribution (for HTTPS)
aws cloudfront create-distribution \
  --origin-domain-name cloudspend-frontend.s3.ap-south-1.amazonaws.com \
  --default-root-object index.html
```

> **Important:** Configure CloudFront to redirect all 404s to `index.html` for SPA routing.

### 2.4 Alternative: Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel --prod
```

---

## 3. Verification

After deployment, verify:

1. ✅ Frontend loads without errors
2. ✅ Sign-up flow creates a Cognito user
3. ✅ Sign-in returns JWT tokens
4. ✅ Creating an expense writes to DynamoDB
5. ✅ Dashboard shows real expense data
6. ✅ Analytics charts render correctly
7. ✅ Budget can be set and displays utilization
