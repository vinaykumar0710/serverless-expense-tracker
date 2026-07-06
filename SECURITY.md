# Security Policy

## Supported Versions

| Version | Supported          |
|---------|--------------------|
| Latest  | ✅ Yes             |

## Reporting a Vulnerability

If you discover a security vulnerability in CloudSpend, please report it responsibly.

### How to Report

1. **Do NOT** open a public GitHub issue for security vulnerabilities
2. Email the maintainer directly or use [GitHub's private vulnerability reporting](https://docs.github.com/en/code-security/security-advisories/guidance-on-reporting-and-writing-information-about-vulnerabilities/privately-reporting-a-security-vulnerability)
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### What to Expect

- Acknowledgment within **48 hours**
- An assessment and plan within **7 days**
- A fix deployed as soon as practical

## Security Best Practices

This project follows these security practices:

- **Authentication**: Amazon Cognito manages user credentials — passwords are never stored in the application
- **Authorization**: API Gateway validates JWT tokens before Lambda invocation
- **Data Isolation**: All DynamoDB queries are scoped by the authenticated user's ID
- **Encryption**: DynamoDB tables use server-side encryption (AES-256)
- **Transport**: All communication uses HTTPS/TLS
- **Environment Variables**: Sensitive configuration is stored in environment variables, not in source code

## Known Considerations

- The `.env.example` file contains placeholder values only — never commit real credentials
- CORS is configured with `Access-Control-Allow-Origin: *` for development — restrict this in production
- The frontend Cognito configuration (User Pool ID, Client ID) is public by design — these are safe to expose as Cognito handles authentication server-side
