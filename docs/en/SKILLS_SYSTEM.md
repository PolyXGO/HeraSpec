# HeraSpec Skills System

## Overview

The Skills System allows AI agents to implement tasks consistently by using instructions, templates, and scripts available in each skill folder.

## Skills Structure

```
heraspec/skills/
├── README.md                    # Overview of skills
│
├── wordpress/                   # Project-specific skills
│   └── theme/
│       └── flatsome/
│           └── ux-element/      # Nested skill structure
│               ├── skill.md
│               ├── templates/
│               └── ...
│
├── perfex-module/              # Skills for Perfex module
│   ├── module-codebase/
│   │   ├── skill.md
│   │   └── ...
│
└── ui-ux/                      # Cross-cutting skill
    ├── skill.md
    └── ...
```

## How Agents Use Skills

### Automatic Workflow

1. **Agent reads tasks.md**:
   ```markdown
   ## 1. Perfex module – Category Management (projectType: perfex-module, skill: module-codebase)
   - [ ] 1.1 Create module structure
   - [ ] 1.2 Configure module registration
   ```

2. **Agent identifies skill**: `module-codebase` for `perfex-module`

3. **Agent finds skill folder**:
   - Path: `heraspec/skills/perfex-module/module-codebase/`
   - Check file: `skill.md` exists

4. **Agent reads skill.md**:
   - Understands purpose: "Create and manage code base structure for Perfex module"
   - Reads the 5-step process
   - Reviews required input/output
   - Memorizes tone, rules, limitations

5. **Agent uses resources**:
   - Run script: `scripts/scaffold-module.sh category-management`
   - Copy template: `templates/module-structure.php`
   - Reference: `examples/good-module-structure/`

6. **Agent implements**:
   - Follow step-by-step in skill.md
   - Follow naming conventions
   - Apply code style rules
   - Respect limitations

### When Tasks Have Multiple Skills

```markdown
## 1. Perfex module – Feature (projectType: perfex-module, skill: module-codebase)
- [ ] 1.1 Create module structure

## 2. UI/UX – Admin Interface (skill: ui-ux)
- [ ] 2.1 Design color palette
- [ ] 2.2 Create component styles

## 3. Documents – User Guide (skill: documents)
- [ ] 3.1 Write technical documentation
```

**Agent will:**
- For task 1.1: Read `heraspec/skills/perfex-module/module-codebase/skill.md`
- For tasks 2.1, 2.2: Read `heraspec/skills/ui-ux/skill.md`
- For task 3.1: Read `heraspec/skills/documents/skill.md`

**Each task group uses its own skill.**

## skill.md Format

Each skill.md has a standard structure:

```markdown
# Skill: Module Codebase (Perfex Module)

## Purpose
Description of what this skill is used for.

## When to Use
- When to use this skill
- Specific use cases

## Step-by-Step Process
1. Step 1
2. Step 2
...

## Required Input
- Input 1
- Input 2

## Expected Output
- Output 1
- Output 2

## Tone & Rules
### Code Style
- Code style rules

### Naming Conventions
- Naming rules

### Limitations
- ❌ DO NOT do something

## Available Templates
- template1.php
- template2.md

## Available Scripts
- script1.sh
- script2.py

## Examples
- good-example/
- bad-example/

## Links to Other Skills
- documents: Use to...
- ui-ux: Use when...
```

## Available Skills

### Project-Specific

**Perfex Module:**
- `module-codebase` - Code base structure for module
- `module-registration` - Register module with Perfex
- `permission-group` - Create permission groups
- `admin-menu-item` - Add admin menu items
- `login-hook` - Implement login hooks
- `database-table` - Create database tables
- `api-endpoint` - Create API endpoints

**WordPress:**
- `admin-settings-page` - Create admin settings pages
- `custom-post-type` - Register custom post types
- `shortcode` - Create shortcodes
- `ux-element` - Create Flatsome UX Builder elements
- `rest-endpoint` - WordPress REST API endpoints
- And many more skills...

### Cross-Cutting

- `ui-ux` - UI/UX design and styling
- `documents` - Technical and user documentation
- `content-optimization` - Content and CTA optimization

## Creating a New Skill

### Step 1: Create Folder Structure

```bash
mkdir -p heraspec/skills/perfex-module/new-skill/{templates,scripts,examples}
```

### Step 2: Write skill.md

Copy template from `src/core/templates/skills/` and customize.

### Step 3: Add Templates/Scripts

- Add templates to `templates/`
- Add scripts to `scripts/`
- Add examples to `examples/`

### Step 4: Update Config (If Needed)

If it's a new skill for a project type, add to `src/core/config.ts`:

```typescript
'perfex-module': [
  'module-codebase',
  'new-skill',  // ← Add new
  // ...
]
```

## CLI Commands

```bash
# List all skills
heraspec skill list

# View skill details
heraspec skill show module-codebase --project-type perfex-module
heraspec skill show ui-ux
```

## Practical Examples

### Creating a Flatsome UX Element

When you want to create a new UI component for Flatsome, you can prompt the agent like this:

**Prompt Example:**
> "Based on the `ux-element` skill, create a 'Countdown' element for the `PolyUtilities` plugin.
> 
> **Requirements:**
> 1. Allow setting a target date and time (Countdown To).
> 2. Provide options for display format (e.g., Days:Hours:Minutes:Seconds).
> 3. Include a custom Heading field.
> 4. Include an 'Expired Message' field to display after the countdown ends.
> 
> **Task:** `(projectType: wordpress, skill: ux-element)`"

The agent will then follow the `ux-element` skill guidelines, using the provided PHP and HTML templates to ensure real-time preview support in the UX Builder.

## Benefits

1. **Consistency**: All tasks with the same skill follow the same process
2. **Reusability**: Templates and scripts can be reused
3. **Learning**: Examples help agents learn quickly
4. **Scalability**: Easy to add new skills
5. **Simplicity**: One general agent + many skills instead of many agents

## See Also

- [SKILLS_STRUCTURE_PROPOSAL.md](SKILLS_STRUCTURE_PROPOSAL.md) - Detailed proposal
- [PROJECT_TYPES_AND_SKILLS.md](PROJECT_TYPES_AND_SKILLS.md) - Complete list
