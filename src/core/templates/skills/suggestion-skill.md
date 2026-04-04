# Skill: Feature Suggestion (Cross-Cutting)

## Purpose

This skill is used to analyze existing project structure and suggest new features that would integrate well with the current codebase. It helps identify opportunities for enhancements and new functionality based on existing patterns and architecture.

## When to Use

- When planning new features for a project
- When identifying gaps in functionality
- When analyzing project structure for enhancement opportunities
- When proposing improvements based on existing patterns
- When suggesting features that align with project architecture

## Step-by-Step Process

### Step 1: Analyze Project Structure
- Read and understand `heraspec/project.md`
- Review existing specs in `heraspec/specs/`
- Analyze existing changes and their patterns
- Identify project type and tech stack
- Map current feature set

### Step 2: Identify Integration Points
- Find logical places for new features
- Identify patterns in existing code
- Determine appropriate project structure locations
- Consider dependencies and relationships
- Map feature hierarchy

### Step 3: Generate Suggestions
- Create feature suggestions based on analysis
- Ensure suggestions align with project type
- Consider existing patterns and conventions
- Propose features that enhance current functionality
- Suggest improvements and extensions

### Step 4: Organize Suggestions
- Group suggestions by category/domain
- Prioritize based on feasibility and value
- Create suggestion files in appropriate locations
- Link suggestions to existing features
- Document integration points

### Step 5: Review and Refine
- Review suggestions for consistency
- Ensure suggestions follow project conventions
- Verify integration points are correct
- Refine based on project requirements
- Prepare for implementation planning

## Required Input

- **Project structure**: Understanding of project organization
- **Existing specs**: Current feature specifications
- **Project type**: Type of project (plugin, module, app, etc.)
- **Tech stack**: Technologies used in the project
- **Domain context**: Business domain and requirements

## Expected Output

- Feature suggestion files
- Suggestions organized by category
- Integration points identified
- Suggestions linked to existing features
- Documentation of suggested enhancements

## Tone & Rules

### Suggestion Quality
- Suggest features that add value
- Align with project type and architecture
- Consider existing patterns and conventions
- Propose realistic and feasible features
- Enhance rather than replace existing functionality

### Integration
- Identify appropriate locations for features
- Consider dependencies and relationships
- Follow existing project structure
- Maintain consistency with current patterns
- Document integration approach

### Documentation
- Clearly describe suggested features
- Explain integration points
- Link to related existing features
- Provide context and rationale
- Include implementation considerations

### Limitations
- ❌ DO NOT suggest features that conflict with existing architecture
- ❌ DO NOT ignore project conventions
- ❌ DO NOT suggest overly complex features
- ❌ DO NOT duplicate existing functionality
- ❌ DO NOT suggest features without considering integration

## Available Templates

- `templates/suggestion-template.md` - Template for feature suggestions
- `templates/suggestion-category-template.md` - Template for organizing suggestions by category

## Available Scripts

- `scripts/analyze-project-structure.py` - Analyze project structure for suggestion opportunities

## Examples

See `examples/` directory for reference:
- `good-suggestions/` - Well-structured feature suggestions
- `bad-suggestions/` - Examples to avoid

## Links to Other Skills

- **documents**: Use to document suggestion rationale
- **unit-test**: Consider testability when suggesting features
- **integration-test**: Consider integration testing when suggesting features

