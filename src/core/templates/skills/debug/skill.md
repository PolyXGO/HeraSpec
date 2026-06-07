# Skill: Debugging (Cross-Cutting)

## Purpose

Run a structured debugging session to systematically reproduce, isolate, diagnose, and fix software bugs.

## When to Use

- When encountering a stack trace, runtime exception, or error message
- When system behavior diverges from the specifications
- When a bug is reported in staging or production but cannot be easily explained

## Step-by-Step Process

### Step 1: Reproduce
- Identify expected vs. actual behavior
- Define the exact, minimal reproduction steps
- Determine the scope of the bug (who is affected, when did it start)

### Step 2: Isolate
- Narrow down the component, module, or code path causing the issue
- Analyze logs, error outputs, or recent commit histories
- Check for recent configuration changes or dependency updates

### Step 3: Diagnose
- Formulate testable hypotheses and trace variables/data flow
- Determine the root cause of the failure (not just the symptom)

### Step 4: Fix & Prevent
- Propose and implement a precise code fix
- Analyze side effects and edge cases introduced by the fix
- Outline regression test strategies to prevent the issue from reoccurring

## Required Input

- Error message, stack trace, or problem description
- Reproduction steps (or environment details)
- Access to relevant logs or code components

## Expected Output

- Debug report containing:
  - Reproduction (Expected vs. Actual)
  - Root cause analysis
  - Code changes or fixes applied
  - Prevention plan (regression tests to add)

## Tone & Rules

- Debug systematically. Do not guess fixes blindly.
- Document code constraints and why the fix works.
- Keep fixes focused; avoid refactoring unrelated components during a bugfix.

## Available Templates

- None

## Available Scripts

- None

## Examples

See `examples/` directory.

## Links to Other Skills

- **unit-test**: Use to write regression tests for the fixed bug.
- **project-memory**: Use to search for historical bug fixes or related issues.
