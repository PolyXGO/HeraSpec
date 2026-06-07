# Skill: Technical Debt Management (Cross-Cutting)

## Purpose

Systematically identify, categorize, and prioritize technical debt to manage codebase maintenance and refactoring.

## When to Use

- When conducting code health/quality audits
- When preparing refactoring proposals
- When managing maintenance backlogs or prioritizing code quality tasks alongside feature work

## Step-by-Step Process

### Step 1: Identify and Categorize
- **Code debt**: Duplicated logic, poor abstractions, magic numbers, lack of type safety
- **Architecture debt**: Tight coupling, monolith splitting needs, wrong database choices
- **Test debt**: Low coverage, flaky tests, missing integration/E2E test pipelines
- **Dependency debt**: Outdated libraries, unmaintained packages, security vulnerabilities
- **Documentation debt**: Outdated READMEs, missing runbooks, undocumented APIs

### Step 2: Evaluate and Score
Score each item on a 1-5 scale:
- **Impact**: How much does it slow the development team down? (1-5)
- **Risk**: What is the likelihood and impact of failure if left unresolved? (1-5)
- **Effort**: How difficult/expensive is it to fix? (1-5)

### Step 3: Prioritize
Calculate the priority score using the formula:
`Priority = (Impact + Risk) x (6 - Effort)`
*(Note: A lower effort value increases the priority score).*

### Step 4: Plan Remediation
- Organize prioritized items into a phased remediation backlog
- Propose refactoring phases that can run incrementally alongside regular feature implementation

## Required Input

- Codebase access or architectural description
- History of recent outages, deployment issues, or developer complaints

## Expected Output

- Prioritized technical debt registry including:
  - Technical debt category and description
  - Impact, Risk, Effort scores, and Priority calculation
  - Business justification for refactoring
  - Phased remediation plan

## Tone & Rules

- Avoid subjective complaints. Focus on quantifiable metrics (developer velocity, test failures).
- Frame refactoring in terms of business value (reduced latency, faster onboarding, lower crash rate).

## Available Templates

- None

## Available Scripts

- None

## Examples

See `examples/` directory.

## Links to Other Skills

- **suggestion**: Use to turn tech debt findings into actionable feature suggestions.
- **sourcecode-analyzer**: Use to automate finding duplicated code and quality violations.
