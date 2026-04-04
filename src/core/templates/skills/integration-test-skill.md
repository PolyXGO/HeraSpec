# Skill: Integration Testing (Cross-Cutting)

## Purpose

This skill is used to create integration tests that verify how different components work together. Integration tests check interactions between modules, services, databases, and external APIs.

## When to Use

- When testing component interactions
- When testing API endpoints
- When testing database operations
- When testing service integrations
- When verifying data flow between components
- When testing with real dependencies (not mocks)

## Step-by-Step Process

### Step 1: Identify Integration Points
- Map component dependencies
- Identify external services and APIs
- List database operations
- Determine integration boundaries
- Identify critical integration paths

### Step 2: Set Up Test Environment
- Configure test database
- Set up test services/mocks for external APIs
- Configure test environment variables
- Prepare test data fixtures
- Set up cleanup procedures

### Step 3: Write Integration Tests
- Create test files for integration scenarios
- Test component interactions
- Test API endpoints with real requests
- Test database operations
- Test error handling across components
- Use test fixtures for consistent data

### Step 4: Run and Verify
- Run integration tests
- Verify test isolation (tests don't affect each other)
- Check test execution time
- Ensure proper cleanup after tests
- Verify tests pass consistently

### Step 5: Maintain Tests
- Update tests when interfaces change
- Keep test data synchronized
- Document test scenarios
- Monitor test execution time

## Required Input

- **Components**: List of components to integrate
- **APIs**: API endpoints to test
- **Database schema**: Database structure for testing
- **External services**: External services to mock or use
- **Test data**: Sample data for testing

## Expected Output

- Integration test files
- Test scenarios covering integration paths
- Test fixtures and setup code
- Passing integration test suite
- Documentation of integration test scenarios

## Tone & Rules

### Test Scope
- Test real interactions between components
- Use real databases (test database)
- Mock external services that can't be controlled
- Test error propagation across boundaries

### Test Data
- Use consistent test fixtures
- Clean up test data after tests
- Use transactions for database tests when possible
- Isolate tests to prevent interference

### Performance
- Integration tests are slower than unit tests
- Run integration tests separately from unit tests
- Use test database (not production)
- Consider test execution time

### Limitations
- ❌ DO NOT use production database
- ❌ DO NOT test with real external APIs in CI (use mocks)
- ❌ DO NOT write tests that depend on test execution order
- ❌ DO NOT skip cleanup (tests must be isolated)
- ❌ DO NOT test implementation details

## Available Templates

- `templates/integration-test-template.js` - JavaScript integration test template
- `templates/integration-test-template.php` - PHP integration test template
- `templates/integration-test-template.py` - Python integration test template

## Available Scripts

- `scripts/setup-test-db.sh` - Set up test database
- `scripts/seed-test-data.sh` - Seed test data

## Examples

See `examples/` directory for reference:
- `good-integration-test/` - Well-structured integration tests
- `bad-integration-test/` - Examples to avoid

## Links to Other Skills

- **unit-test**: Use unit tests before integration tests
- **e2e-test**: Use for end-to-end user scenarios
- **documents**: Use to document integration test strategy

