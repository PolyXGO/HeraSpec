# Skill: Specification Writing (Cross-Cutting)

## Purpose

Write and refine high-quality functional/technical specifications, user stories, and delta specs for consumption by AI agents.

## When to Use

- When starting a new feature change (Step 1 of the HeraSpec workflow)
- When converting high-level business ideas into structured technical specs
- When refining delta specs during parallel merge validation

## Step-by-Step Process

### Step 1: Define User Story & Scenarios
- Structure the core requirement as a User Story (As a... I want to... So that...)
- Formulate behavioral scenarios using GIVEN-WHEN-THEN syntax (Gherkin style)
- Define happy paths, error paths, and edge cases

### Step 2: Structure metadata
- Specify target components, domains, and technical stacks
- Verify requirements match the architectural conventions defined in `project.md`

### Step-3: Write Delta Spec
- Segment new, modified, and removed requirements clearly:
  - `## ADDED Requirements`
  - `## MODIFIED Requirements` (must specify the exact Before vs. After states)
  - `## REMOVED Requirements`

## Required Input

- Business requirement description or user prompt
- Technical stack metadata from `project.md`

## Expected Output

- Clean markdown specification following the HeraSpec format
- Complete Delta Spec with GIVEN-WHEN-THEN scenarios

## Tone & Rules

- Be extremely precise. Avoid ambiguous language like "user-friendly" or "fast".
- Always define exact failure states (e.g. "returns 401 Unauthorized" instead of "shows error").
- Scenarios MUST be testable and actionable.

## Available Templates

- None

## Available Scripts

- None

## Examples

See `examples/` directory.

## Links to Other Skills

- **documents**: Use to format the specifications into product manuals.
- **suggestion**: Use to identify gaps in existing specs.
