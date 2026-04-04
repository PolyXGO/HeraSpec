# Skill: Unit Testing (Cross-Cutting)

## Purpose

This skill is used to create unit tests for code components. Unit tests verify that individual functions, methods, or classes work correctly in isolation.

## When to Use

- When testing individual functions or methods
- When testing class methods in isolation
- When testing utility functions
- When testing business logic
- When testing data transformations
- When ensuring code correctness before integration

## Step-by-Step Process

### Step 1: Identify Test Targets
- Analyze the code to identify testable units
- List all public methods/functions
- Identify edge cases and boundary conditions
- Determine expected inputs and outputs

### Step 2: Set Up Test Framework
- Choose appropriate testing framework (Jest, PHPUnit, pytest, etc.)
- Configure test environment
- Set up test structure matching project conventions
- Ensure test framework is installed and configured

### Step 3: Write Test Cases
- Create test file matching source file structure
- Write tests for each function/method
- Test normal cases (happy path)
- Test edge cases (null, empty, boundary values)
- Test error cases (invalid input, exceptions)
- Use descriptive test names

### Step 4: Run and Verify
- Run tests to ensure they pass
- Check test coverage if available
- Refactor if needed
- Ensure tests are fast and isolated

### Step 5: Document Test Cases
- Add comments for complex test scenarios
- Document test data and expected outcomes
- Update test documentation if needed

## Required Input

- **Source code**: Code to be tested (functions, methods, classes)
- **Test framework**: Testing framework to use (Jest, PHPUnit, pytest, etc.)
- **Project structure**: Understanding of where tests should be placed
- **Dependencies**: List of dependencies that need to be mocked

## Expected Output

- Complete unit test files
- Tests covering normal, edge, and error cases
- Test assertions verifying expected behavior
- Test data and fixtures if needed
- Passing test suite

## Tone & Rules

### Test Naming
- Use descriptive names: `test_user_registration_with_valid_email()`
- Follow pattern: `test_<what>_<condition>_<expected_result>`
- Use clear, readable test names

### Test Structure
- Arrange: Set up test data and dependencies
- Act: Execute the code being tested
- Assert: Verify the results
- Clean up: Reset state if needed

### Coverage Goals
- Aim for high coverage of critical paths
- Test all public methods
- Test edge cases and error handling
- Don't test implementation details

### Limitations
- ❌ DO NOT test private methods directly (test through public interface)
- ❌ DO NOT write tests that depend on other tests
- ❌ DO NOT test external dependencies (use mocks)
- ❌ DO NOT write slow tests (use mocks for I/O)
- ❌ DO NOT test framework code

## Available Templates

- `templates/unit-test-template.js` - JavaScript/Jest template
- `templates/unit-test-template.php` - PHP/PHPUnit template
- `templates/unit-test-template.py` - Python/pytest template

## Available Scripts

- `scripts/generate-test-stubs.sh` - Generate test file stubs from source code

## Examples

See `examples/` directory for reference:
- `good-unit-test/` - Well-structured unit tests
- `bad-unit-test/` - Examples to avoid

## Links to Other Skills

- **integration-test**: Use after unit tests for integration testing
- **e2e-test**: Use for end-to-end testing
- **documents**: Use to document test strategy

