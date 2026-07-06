# Contributing to CloudSpend

Thank you for your interest in contributing to CloudSpend! This document provides guidelines and instructions for contributing.

## Getting Started

1. **Fork** the repository
2. **Clone** your fork locally
3. **Create a branch** for your feature or fix
4. **Make your changes** following the guidelines below
5. **Test** your changes
6. **Submit** a pull request

## Development Setup

```bash
# Clone your fork
git clone https://github.com/<your-username>/serverless-expense-tracker.git
cd serverless-expense-tracker/frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with your AWS resource IDs

# Start development server
npm run dev
```

## Code Guidelines

### Frontend (React)

- Use **functional components** with hooks
- Follow the existing **Context API** pattern for state management
- Place API calls in the **services** directory
- Place reusable components in `components/ui/`
- Use **Tailwind CSS** for styling — avoid inline styles
- Keep components focused and single-responsibility

### Backend (Python)

- Follow **PEP 8** style conventions
- Add **docstrings** to all functions
- Use the shared response helpers from `shared/response.py`
- Handle errors with try/except and return appropriate HTTP status codes
- Always include CORS headers in responses

## Commit Messages

Use conventional commit format:

```
type(scope): description

Examples:
feat(analytics): add yearly comparison chart
fix(auth): handle expired token refresh
docs(readme): update deployment instructions
refactor(expense): simplify validation logic
```

## Pull Request Process

1. Update documentation if you change any interfaces
2. Ensure the frontend builds without errors (`npm run build`)
3. Describe your changes clearly in the PR description
4. Link any related issues

## Reporting Issues

- Use the [GitHub Issues](https://github.com/vinaykumar0710/serverless-expense-tracker/issues) page
- Include steps to reproduce, expected vs actual behavior, and screenshots if applicable
- Check existing issues before creating a new one

## Code of Conduct

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.

---

Thank you for helping make CloudSpend better! 🚀
