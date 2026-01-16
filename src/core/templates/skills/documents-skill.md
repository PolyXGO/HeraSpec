# Skill: Documents (Cross-Cutting)

## Purpose

This skill is used to create documentation for both technical and end-user audiences. Ensures documentation is complete, clear, and easy to understand.

## When to Use

- When creating technical documentation
- When writing user guides
- When documenting APIs
- When creating changelogs
- When writing installation/setup guides

## Step-by-Step Process

### Step 1: Identify Document Type
- Technical docs: For developers
- User guide: For end-users
- API docs: For API consumers
- Changelog: For version releases

### Step 2: Choose Appropriate Template
- Technical: `templates/technical-doc-template.md`
- User guide: `templates/user-guide-template.md`
- API: `templates/api-doc-template.md`
- Changelog: `templates/changelog-template.md`

### Step 3: Gather Information
- Features and functionality
- Installation steps
- Configuration options
- Usage examples
- Troubleshooting tips

### Step 4: Write Documentation
- Follow template structure
- Use good examples as reference
- Ensure code examples work
- Include screenshots if needed

### Step 5: Validate & Generate
- Run script: `scripts/validate-docs.py`
- Run script: `scripts/generate-docs.sh` (if available)
- Review with good examples
- Test with target audience

## Required Input

- **Document type**: Technical, user guide, API, changelog
- **Target audience**: Developers, end-users, admins
- **Features to document**: List of features to document
- **Code examples**: Code samples to include
- **Screenshots**: Images if needed

## Expected Output

- Complete documentation file
- Proper formatting and structure
- Working code examples
- Clear instructions
- Troubleshooting section

## Tone & Rules

### Writing Style
- **Clear**: Write clearly, easy to understand
- **Concise**: Brief, not verbose
- **Actionable**: Can be followed
- **Complete**: Complete necessary information

### Technical Docs
- Code examples must work
- Include prerequisites
- Explain "why" not just "what"
- Link to related docs

### User Guides
- Step-by-step instructions
- Screenshots for complex steps
- Common issues and solutions
- Plain language (avoid jargon)

### Limitations
- ❌ DO NOT skip prerequisites
- ❌ DO NOT assume prior knowledge
- ❌ DO NOT use untested code examples
- ❌ DO NOT write too technical for user guides
- ❌ DO NOT skip troubleshooting

## Available Templates

- `templates/technical-doc-template.md` - Technical documentation
- `templates/user-guide-template.md` - User guide
- `templates/api-doc-template.md` - API documentation
- `templates/changelog-template.md` - Changelog template

## Available Scripts

- `scripts/generate-docs.sh` - Automatically generate docs from code
- `scripts/validate-docs.py` - Validate format and completeness

## Examples

See `examples/` directory for reference:
- `good-technical-doc.md` - Good technical doc example
- `good-user-guide.md` - Good user guide example
- `good-api-doc.md` - Good API doc example

## Links to Other Skills

- **module-codebase**: Document module structure
- **ui-ux**: Document UI components and design system
- **content-optimization**: Optimize documentation for clarity
