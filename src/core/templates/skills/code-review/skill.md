# Skill: Code Review (Cross-Cutting)

## Purpose

Review code changes for security vulnerabilities, performance bottlenecks, correctness, and maintainability.

## When to Use

- When reviewing a pull request or code diff
- When checking a code change before merging
- When verifying security practices (OWASP Top 10, SQL injection, secrets in code)
- When auditing code performance (N+1 queries, complexity, memory leaks)

## Step-by-Step Process

### Step 1: Security Audit
- Check for OWASP Top 10 vulnerabilities (SQL injection, XSS, CSRF, etc.)
- Look for secrets, API keys, or hardcoded credentials
- Verify authentication and authorization checks

### Step 2: Performance Evaluation
- Identify N+1 query problems in database interactions
- Look for memory leaks or high memory allocation loops
- Verify algorithmic complexity in critical code paths

### Step 3: Correctness Check
- Review edge cases (null values, empty strings, boundary conditions)
- Verify error handling and propagation patterns
- Identify race conditions or concurrency issues

### Step 4: Maintainability Review
- Check variable/function naming for clarity
- Ensure single-responsibility principle is followed
- Check for code duplication and readability

## Required Input

- Code diff, PR URL, or source files
- Context on performance constraints or security requirements

## Expected Output

- Code review report containing:
  - Overall summary
  - Critical security/correctness issues with severity levels
  - Actionable improvement suggestions
  - Praise for well-written code

## Tone & Rules

- Be constructive and focus on the code, not the developer.
- Provide concrete code examples when suggesting improvements.
- Explicitly state trade-offs (e.g. readability vs. performance).

## Available Templates

- None

## Available Scripts

- None

## Examples

See `examples/` directory.

## Links to Other Skills

- **unit-test**: Use to write test cases for edge cases identified during review.
- **sourcecode-analyzer**: Use for automated static code analysis.
