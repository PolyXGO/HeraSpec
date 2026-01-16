# Skill: End-to-End (E2E) Testing (Cross-Cutting)

## Purpose

This skill is used to create end-to-end tests that verify complete user workflows from start to finish. E2E tests simulate real user interactions with the application.

## When to Use

- When testing complete user workflows
- When testing critical user journeys
- When testing UI interactions
- When verifying application behavior from user perspective
- When testing authentication flows
- When testing payment/transaction flows

## Step-by-Step Process

### Step 1: Identify User Journeys
- Map critical user workflows
- Identify key user scenarios
- List user personas and their goals
- Determine test priorities (critical paths first)
- Document expected user behavior

### Step 2: Set Up E2E Testing Framework
- Choose E2E testing tool (Playwright, Cypress, Selenium, etc.)
- Configure test environment
- Set up test browser/headless mode
- Configure test data and user accounts
- Set up test application instance

### Step 3: Write E2E Tests
- Create test files for each user journey
- Write tests simulating user actions (click, type, navigate)
- Test complete workflows from start to finish
- Verify UI elements and feedback
- Test error scenarios and edge cases
- Use page objects for maintainability

### Step 4: Run and Verify
- Run E2E tests
- Verify tests pass consistently
- Check test execution time
- Review test failures and flakiness
- Ensure tests are stable and reliable

### Step 5: Maintain Tests
- Update tests when UI changes
- Keep page objects synchronized with UI
- Document test scenarios
- Monitor test stability

## Required Input

- **User journeys**: List of critical user workflows
- **Test environment**: Application URL and test environment setup
- **Test accounts**: User accounts for testing
- **E2E framework**: Testing framework to use
- **Browser**: Browser to test in (Chrome, Firefox, etc.)

## Expected Output

- E2E test files
- Test scenarios covering user journeys
- Page objects for UI elements
- Passing E2E test suite
- Documentation of E2E test scenarios

## Tone & Rules

### Test Scope
- Focus on critical user journeys
- Test from user perspective
- Verify complete workflows
- Test happy paths and error scenarios

### Test Stability
- Use reliable selectors (data-testid, stable IDs)
- Add appropriate waits for async operations
- Handle flaky elements (retries, explicit waits)
- Keep tests independent and isolated

### Performance
- E2E tests are slowest (run separately)
- Use headless mode for CI
- Parallelize tests when possible
- Consider test execution time

### Limitations
- ❌ DO NOT test every UI element (focus on journeys)
- ❌ DO NOT use brittle selectors (XPath with complex paths)
- ❌ DO NOT skip error handling
- ❌ DO NOT write tests that depend on timing
- ❌ DO NOT test implementation details

## Available Templates

- `templates/e2e-test-template.js` - JavaScript/Playwright template
- `templates/e2e-test-template.ts` - TypeScript/Cypress template
- `templates/e2e-test-template.py` - Python/Selenium template

## Available Scripts

- `scripts/setup-e2e-env.sh` - Set up E2E test environment
- `scripts/run-e2e-tests.sh` - Run E2E test suite

## Examples

See `examples/` directory for reference:
- `good-e2e-test/` - Well-structured E2E tests
- `bad-e2e-test/` - Examples to avoid

## Links to Other Skills

- **unit-test**: Use for testing individual components
- **integration-test**: Use for testing component interactions
- **ui-ux**: Reference when testing UI interactions
- **documents**: Use to document E2E test strategy

