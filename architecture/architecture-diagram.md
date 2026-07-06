# CloudSpend — Architecture Diagram

## System Architecture

```mermaid
flowchart TB
    subgraph Client["🖥️ Frontend"]
        REACT["React 19 + Vite 8\n(Single Page Application)"]
        AMPLIFY["AWS Amplify v6\n(Auth Client)"]
    end

    subgraph Auth["🔐 Authentication"]
        COGNITO["Amazon Cognito\n(User Pool)"]
    end

    subgraph Gateway["🌐 API Layer"]
        APIGW["API Gateway\n(HTTP API + JWT Authorizer)"]
    end

    subgraph Compute["⚡ Compute Layer — AWS Lambda (Python 3.12)"]
        CREATE["create-expense\nPOST /expenses"]
        GET["get-expenses\nGET /expenses"]
        UPDATE["update-expense\nPUT /expenses/{id}"]
        DELETE["delete-expense\nDELETE /expenses/{id}"]
        BUDGET["budget\nGET & POST /budget"]
        ANALYTICS["analytics\nGET /analytics"]
    end

    subgraph Storage["💾 Data Layer"]
        EXPENSES_DB[("Expenses Table\nPK: userId\nSK: expenseId")]
        BUDGETS_DB[("Budgets Table\nPK: userId")]
    end

    REACT -->|"1. Sign In / Sign Up"| AMPLIFY
    AMPLIFY -->|"2. Authenticate"| COGNITO
    COGNITO -->|"3. JWT Tokens"| AMPLIFY
    REACT -->|"4. API Requests\n(Bearer Token)"| APIGW
    APIGW -->|"5. Validate JWT"| COGNITO
    APIGW -->|"6. Route + Invoke"| CREATE
    APIGW --> GET
    APIGW --> UPDATE
    APIGW --> DELETE
    APIGW --> BUDGET
    APIGW --> ANALYTICS

    CREATE -->|"PutItem"| EXPENSES_DB
    GET -->|"Query"| EXPENSES_DB
    UPDATE -->|"UpdateItem"| EXPENSES_DB
    DELETE -->|"DeleteItem"| EXPENSES_DB
    BUDGET -->|"GetItem / PutItem"| BUDGETS_DB
    BUDGET -->|"Query (spending)"| EXPENSES_DB
    ANALYTICS -->|"Query"| EXPENSES_DB

    style Client fill:#1E293B,stroke:#3B82F6,color:#F1F5F9
    style Auth fill:#1E293B,stroke:#F59E0B,color:#F1F5F9
    style Gateway fill:#1E293B,stroke:#22C55E,color:#F1F5F9
    style Compute fill:#1E293B,stroke:#A855F7,color:#F1F5F9
    style Storage fill:#1E293B,stroke:#EF4444,color:#F1F5F9
```

## Request Flow

```mermaid
sequenceDiagram
    participant U as User Browser
    participant R as React SPA
    participant A as AWS Amplify
    participant C as Amazon Cognito
    participant G as API Gateway
    participant L as AWS Lambda
    participant D as DynamoDB

    Note over U,D: Authentication Flow
    U->>R: Enter credentials
    R->>A: signIn(email, password)
    A->>C: InitiateAuth (SRP)
    C-->>A: AccessToken + IdToken + RefreshToken
    A-->>R: Auth session established

    Note over U,D: Data Flow (Authenticated)
    U->>R: Navigate to Expenses
    R->>A: fetchAuthSession()
    A-->>R: Current access token
    R->>G: GET /expenses (Authorization: Bearer <token>)
    G->>C: Validate JWT signature & claims
    C-->>G: Token valid ✓
    G->>L: Invoke get-expenses (event with user claims)
    L->>D: Query(PK = userId)
    D-->>L: Items[]
    L-->>G: 200 OK + JSON body
    G-->>R: Response
    R-->>U: Render expense list
```

## DynamoDB Table Design

```mermaid
erDiagram
    EXPENSES {
        string userId PK "Partition Key"
        string expenseId SK "Sort Key (UUID)"
        string title "Expense description"
        string category "food|travel|shopping|..."
        number amount "Decimal value"
        string date "YYYY-MM-DD"
        string notes "Optional notes"
        string createdAt "ISO 8601 timestamp"
        string updatedAt "ISO 8601 timestamp"
    }

    BUDGETS {
        string userId PK "Partition Key"
        number monthlyBudget "Monthly limit"
        string updatedAt "ISO 8601 timestamp"
    }

    EXPENSES }|--|| BUDGETS : "same userId"
```
