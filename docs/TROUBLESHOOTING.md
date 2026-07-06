# 🔧 Troubleshooting

Common issues and solutions for the CloudSpend application.

---

## Authentication Issues

### "Incorrect email or password" on Sign In

**Cause:** Invalid credentials or unverified account.

**Solution:**
1. Verify the email address is correct
2. Check that the account has been confirmed (email verification)
3. If forgotten, use the "Forgot Password" flow
4. Check the Cognito User Pool in AWS Console to verify the user exists

### "User does not exist" after Sign Up

**Cause:** Account created but not confirmed.

**Solution:**
1. Check your email inbox for the verification code
2. Enter the 6-digit code on the confirmation page
3. If the code expired, sign up again or use the Cognito Console to confirm the user manually

### Token Expired / 401 Unauthorized

**Cause:** JWT access token has expired (default: 1 hour).

**Solution:**
1. Sign out and sign back in
2. The Amplify SDK automatically refreshes tokens — if this fails, clear browser storage and re-authenticate

---

## API Issues

### CORS Errors in Browser Console

**Cause:** Missing or misconfigured CORS headers.

**Solution:**
1. Verify API Gateway has CORS enabled:
   - Allowed origins: `*` (or your specific domain)
   - Allowed methods: `GET, POST, PUT, DELETE, OPTIONS`
   - Allowed headers: `Content-Type, Authorization`
2. Verify each Lambda function returns CORS headers:
   ```python
   "headers": {
       "Content-Type": "application/json",
       "Access-Control-Allow-Origin": "*",
   }
   ```

### 500 Internal Server Error

**Cause:** Lambda execution error — could be a missing environment variable, DynamoDB permission issue, or code error.

**Solution:**
1. Check **CloudWatch Logs** for the specific Lambda function
2. Verify environment variables are set:
   - `EXPENSES_TABLE` = `cloudspend-dev-expenses`
   - `BUDGETS_TABLE` = `cloudspend-dev-budgets`
3. Verify the Lambda execution role has DynamoDB permissions
4. Check that the DynamoDB tables exist in the correct region

### "Network Error" on API Calls

**Cause:** API Gateway URL is incorrect or unreachable.

**Solution:**
1. Verify `VITE_API_URL` in `frontend/.env` matches your API Gateway invoke URL
2. Ensure the API Gateway stage (`/dev`) is included in the URL
3. Check that API Gateway deployment is active
4. Test the endpoint directly with `curl`:
   ```bash
   curl -H "Authorization: Bearer <token>" \
        https://<api-id>.execute-api.<region>.amazonaws.com/dev/expenses
   ```

---

## Frontend Issues

### Blank Page After Build

**Cause:** React Router requires all routes to serve `index.html`.

**Solution:**
- **S3/CloudFront:** Configure error page redirect to `index.html` with 200 status
- **Vercel/Netlify:** Add a rewrite rule: `/* → /index.html`
- **Vite dev server:** This is handled automatically

### Charts Not Rendering

**Cause:** Chart.js data is empty or in unexpected format.

**Solution:**
1. Check the browser console for errors
2. Verify the `/analytics` endpoint returns data
3. DynamoDB `Decimal` values must be converted to JavaScript `Number` — the analytics service handles this, but verify the normalization

### "useAuth must be used within an AuthProvider"

**Cause:** A component using `useAuth()` is rendered outside the `AuthProvider` context.

**Solution:** Ensure your component tree in `main.jsx` wraps `<App>` with all required providers in the correct order:

```jsx
<ToastProvider>
  <AuthProvider>
    <ThemeProvider>
      <ExpenseProvider>
        <BudgetProvider>
          <App />
        </BudgetProvider>
      </ExpenseProvider>
    </ThemeProvider>
  </AuthProvider>
</ToastProvider>
```

---

## DynamoDB Issues

### "ResourceNotFoundException: Requested resource not found"

**Cause:** The DynamoDB table doesn't exist or the name doesn't match.

**Solution:**
1. Verify tables exist in the AWS Console
2. Check the table names match the environment variables exactly
3. Verify the Lambda is running in the same AWS region as the tables

### Amount Shows Incorrectly (e.g., "85.5" vs "85.50")

**Cause:** DynamoDB stores numbers as `Decimal` type, which doesn't map directly to JavaScript `Number`.

**Solution:** The frontend service layer includes normalization:
```javascript
amount: Number(raw.amount)
```
This is already handled in `expenseService.js` and `analyticsService.js`.

---

## Development Issues

### `npm run dev` Fails

**Cause:** Missing dependencies or incompatible Node.js version.

**Solution:**
```bash
node --version   # Ensure v18+
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Environment Variables Not Loading

**Cause:** Vite requires the `VITE_` prefix for client-side environment variables.

**Solution:**
1. Ensure all variables in `.env` start with `VITE_`
2. Restart the dev server after changing `.env`
3. Access variables via `import.meta.env.VITE_VARIABLE_NAME`

---

## Getting Help

If you encounter an issue not listed here:

1. Check [AWS CloudWatch Logs](https://console.aws.amazon.com/cloudwatch/) for Lambda errors
2. Check the browser Developer Console for frontend errors
3. Open a [GitHub Issue](https://github.com/vinaykumar0710/serverless-expense-tracker/issues) with:
   - Steps to reproduce
   - Error messages / screenshots
   - Browser and Node.js versions
