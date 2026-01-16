# Skills Directory

This directory contains reusable skills for HeraSpec projects.

## What Are Skills?

Skills are reusable patterns and workflows that help AI agents implement tasks consistently. Each skill contains:

- **skill.md**: Complete guide on how to use the skill
- **templates/**: Reusable templates
- **scripts/**: Automation scripts
- **examples/**: Good and bad examples

## Skill Structure

```
skills/
├── <project-type>/          # Project-specific skills
│   └── <skill-name>/
│       ├── skill.md
│       ├── templates/
│       ├── scripts/
│       └── examples/
│
└── <skill-name>/            # Cross-cutting skills
    ├── skill.md
    ├── templates/
    ├── scripts/
    └── examples/
```

## How Agents Use Skills

When a task has a skill tag:
\`\`\`markdown
## 1. Feature (projectType: perfex-module, skill: module-codebase)
- [ ] Task 1.1
\`\`\`

The agent will:
1. Find skill folder: \`heraspec/skills/perfex-module/module-codebase/\`
2. Read \`skill.md\` to understand process
3. Use templates and scripts from skill folder
4. Follow guidelines in skill.md

## Available Skills

Run \`heraspec skill list\` to see all available skills.

## Creating New Skills

1. Create skill folder structure
2. Write \`skill.md\` following the template
3. Add templates, scripts, examples as needed
4. Update this README

See \`docs/SKILLS_STRUCTURE_PROPOSAL.md\` for detailed structure.

