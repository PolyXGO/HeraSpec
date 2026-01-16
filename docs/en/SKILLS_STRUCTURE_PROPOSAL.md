# Skills Structure Proposal for HeraSpec

## Current State

HeraSpec currently only has:
- ✅ Skills defined as string lists in `config.ts`
- ✅ Skills used in `tasks.md` as metadata: `(projectType: xxx, skill: xxx)`
- ❌ **NO** folder structure for skills
- ❌ **NO** skill.md files with detailed instructions
- ❌ **NO** scripts, templates, examples in skills

## Proposed New Skills Structure

### Directory Structure

```
heraspec/
├── project.md
├── config.yaml
├── specs/
├── changes/
├── archives/
└── skills/                          # ← NEW
    ├── README.md                    # Overview of skills system
    │
    ├── perfex-module/               # Skills for Perfex module
    │   ├── module-codebase/
    │   │   ├── skill.md
    │   │   ├── templates/
    │   │   │   ├── module-structure.php
    │   │   │   ├── module-config.php
    │   │   │   └── module-hooks.php
    │   │   ├── scripts/
    │   │   │   └── scaffold-module.sh
    │   │   └── examples/
    │   │       ├── good-module-structure/
    │   │       └── bad-module-structure/
    │   │
    │   ├── module-registration/     # Existing skill, upgraded
    │   │   ├── skill.md
    │   │   └── templates/
    │   │
    │   └── permission-group/        # Existing skill, upgraded
    │       ├── skill.md
    │       └── templates/
    │
    ├── ui-ux/                       # Cross-cutting skill
    │   ├── skill.md
    │   ├── templates/
    │   │   ├── component-style.scss
    │   │   ├── responsive-design.md
    │   │   └── accessibility-checklist.md
    │   ├── scripts/
    │   │   ├── generate-color-palette.py
    │   │   └── validate-accessibility.sh
    │   └── examples/
    │       ├── good-ux-patterns/
    │       └── bad-ux-patterns/
    │
    ├── documents/                   # Cross-cutting skill
    │   ├── skill.md
    │   ├── templates/
    │   │   ├── technical-doc-template.md
    │   │   ├── user-guide-template.md
    │   │   ├── api-doc-template.md
    │   │   └── changelog-template.md
    │   ├── scripts/
    │   │   ├── generate-docs.sh
    │   │   └── validate-docs.py
    │   └── examples/
    │       ├── good-technical-doc.md
    │       └── good-user-guide.md
    │
    └── content-optimization/        # Cross-cutting skill
        ├── skill.md
        ├── templates/
        │   ├── cta-template.md
        │   ├── landing-page-template.md
        │   └── email-campaign-template.md
        ├── scripts/
        │   ├── analyze-cta-performance.py
        │   └── generate-ab-test-variants.sh
        └── examples/
            ├── high-conversion-cta/
            └── low-conversion-cta/
```

## skill.md Structure

Each skill folder has a `skill.md` file with standard format:

```markdown
# Skill: Module Codebase (Perfex Module)

## Purpose

This skill is used to create and manage code base structure for Perfex CRM module following best practices.

## When to Use

- When creating a new module for Perfex CRM
- When refactoring existing module structure
- When ensuring module follows Perfex conventions

## Step-by-Step Process

### Step 1: Analyze Requirements
- Identify main module functionality
- Identify required database tables
- Identify hooks and filters to use

### Step 2: Scaffold Structure
- Run script: `scripts/scaffold-module.sh <module-name>`
- Script will create standard folder structure
- Copy templates to correct locations

### Step 3: Configure Module
- Fill information in `module-config.php` (from template)
- Register module in Perfex system
- Set up permissions

### Step 4: Implement Core Logic
- Create controllers, models according to structure
- Implement hooks and filters
- Create database migrations

### Step 5: Testing & Documentation
- Test module with Perfex core
- Write documentation (use documents skill)
- Create user guide (use documents skill)

## Required Input

- **Module name**: Module name (kebab-case)
- **Module description**: Functionality description
- **Database tables**: List of tables to create
- **Hooks required**: List of hooks to implement
- **Permissions**: List of permissions to create

## Expected Output

- Complete module folder structure
- Configuration files filled out
- Database migrations
- Module registration code
- Basic documentation structure

## Tone & Rules

### Code Style
- Follow PSR-12 coding standards
- Use camelCase for functions
- Use PascalCase for classes
- Comments in English

### Naming Conventions
- Module folder: `perfex-<module-name>`
- Class names: `Perfex<ModuleName>`
- Function names: `perfex_<module_name>_<action>`

### Limitations
- ❌ DO NOT create global functions (except hooks)
- ❌ DO NOT hardcode database credentials
- ❌ DO NOT bypass Perfex permission system
- ❌ DO NOT modify core Perfex files

## Available Templates

- `templates/module-structure.php` - Basic module structure
- `templates/module-config.php` - Module configuration file
- `templates/module-hooks.php` - Template for hooks

## Available Scripts

- `scripts/scaffold-module.sh` - Automatically create module structure

## Examples

See `examples/` directory for reference:
- `good-module-structure/` - Example of well-organized module
- `bad-module-structure/` - Example to avoid

## Links to Other Skills

- **documents**: Use to create technical docs and user guide
- **ui-ux**: Use when module has admin interface
- **content-optimization**: Use for module marketing pages
```

## Skill Categories

### 1. Project-Specific Skills

Skills tied to a specific project type:

#### Perfex Module Skills

```
skills/perfex-module/
├── module-codebase/          # ← NEW: Code base structure
├── module-registration/      # Existing, upgraded
├── permission-group/          # Existing, upgraded
├── admin-menu-item/          # Existing, upgraded
├── login-hook/               # Existing, upgraded
├── database-table/           # Existing, upgraded
└── api-endpoint/             # Existing, upgraded
```

#### WordPress Plugin Skills

```
skills/wordpress-plugin/
├── admin-settings-page/      # Existing, upgraded
├── custom-post-type/         # Existing, upgraded
└── ...
```

### 2. Cross-Cutting Skills

Skills that can be used across multiple project types:

```
skills/
├── ui-ux/                    # ← NEW
├── documents/                # ← NEW
└── content-optimization/     # ← NEW
```

## Details of Each New Skill

### 1. module-codebase (Perfex Module)

**Purpose**: Create and manage code base structure for Perfex module

**Structure**:
```
module-codebase/
├── skill.md
├── templates/
│   ├── module-structure.php      # Folder and file structure
│   ├── module-config.php         # Module configuration file
│   ├── module-hooks.php          # Template hooks
│   └── module-migration.php      # Database migration template
├── scripts/
│   └── scaffold-module.sh        # Script to automatically create module
└── examples/
    ├── good-module-structure/    # Good example
    └── bad-module-structure/     # Example to avoid
```

### 2. ui-ux (Cross-Cutting)

**Purpose**: Handle style, interface, UX, UI for all project types

**Structure**:
```
ui-ux/
├── skill.md
├── templates/
│   ├── component-style.scss          # Template for styling components
│   ├── responsive-design.md          # Responsive checklist
│   ├── accessibility-checklist.md    # Accessibility checklist
│   └── color-palette-template.json   # Color palette template
├── scripts/
│   ├── generate-color-palette.py     # Generate color palette from design
│   └── validate-accessibility.sh     # Validate accessibility
└── examples/
    ├── good-ux-patterns/              # Good patterns
    └── bad-ux-patterns/              # Patterns to avoid
```

### 3. documents (Cross-Cutting)

**Purpose**: Create documentation (technical + end-user)

**Structure**:
```
documents/
├── skill.md
├── templates/
│   ├── technical-doc-template.md    # Technical documentation
│   ├── user-guide-template.md       # User guide
│   ├── api-doc-template.md           # API documentation
│   └── changelog-template.md         # Changelog template
├── scripts/
│   ├── generate-docs.sh              # Automatically generate docs
│   └── validate-docs.py              # Validate doc format
└── examples/
    ├── good-technical-doc.md         # Good example
    └── good-user-guide.md            # Good example
```

### 4. content-optimization (Cross-Cutting)

**Purpose**: Optimize content, increase CTA conversion

**Structure**:
```
content-optimization/
├── skill.md
├── templates/
│   ├── cta-template.md               # CTA template
│   ├── landing-page-template.md      # Landing page template
│   └── email-campaign-template.md     # Email marketing template
├── scripts/
│   ├── analyze-cta-performance.py    # Analyze CTA performance
│   └── generate-ab-test-variants.sh   # Generate variants for A/B testing
└── examples/
    ├── high-conversion-cta/           # Effective CTA
    └── low-conversion-cta/            # CTA to improve
```

## How Agents Use Skills

### Workflow

1. **Agent reads tasks.md**:
   ```markdown
   ## 1. Perfex module – Category Management (projectType: perfex-module, skill: module-codebase)
   - [ ] 1.1 Create module structure
   ```

2. **Agent identifies skill to use**: `module-codebase`

3. **Agent opens skill folder**:
   ```
   heraspec/skills/perfex-module/module-codebase/
   ```

4. **Agent reads skill.md**:
   - Understands purpose, process, input/output
   - Knows tone, rules, limitations

5. **Agent uses tools in skill**:
   - Run script: `scripts/scaffold-module.sh category-management`
   - Copy template: `templates/module-structure.php`
   - Reference examples: `examples/good-module-structure/`

6. **Agent implements according to instructions in skill.md**

### Specific Example

**Task in tasks.md**:
```markdown
## 1. Perfex module – Category Management (projectType: perfex-module, skill: module-codebase)
- [ ] 1.1 Create module structure
- [ ] 1.2 Configure module registration
- [ ] 1.3 Create database tables
```

**Agent will**:
1. Read `heraspec/skills/perfex-module/module-codebase/skill.md`
2. Understand the 5-step process
3. Run `scripts/scaffold-module.sh category-management`
4. Fill information in templates
5. Implement according to conventions in skill.md

## Benefits

### 1. Reusability
- One skill can be used for many tasks
- Templates and scripts are available, no need to rewrite

### 2. Consistency
- All modules follow the same conventions
- Code style and structure are uniform

### 3. Learning
- Good/bad examples help agents learn quickly
- skill.md is the single source of truth

### 4. Easy to Extend
- Adding new skills only requires creating a new folder
- No need to modify HeraSpec core code

### 5. Simpler Agents
- One general agent + many skills
- Instead of many separate agents

## Migration Path

### Step 1: Create Structure
- Create `heraspec/skills/` folder
- Create subfolders for each skill

### Step 2: Upgrade Existing Skills
- For each skill in `config.ts`, create corresponding folder
- Write `skill.md` for each skill
- Add templates/scripts if needed

### Step 3: Add New Skills
- `module-codebase` for Perfex
- `ui-ux`, `documents`, `content-optimization` (cross-cutting)

### Step 4: Update Agent Instructions
- Guide agents to read skill.md when encountering tasks
- Guide usage of scripts and templates

## Questions to Confirm

1. ✅ Is this folder structure appropriate?
2. ✅ Is the `skill.md` format complete?
3. ✅ Are any sections needed in `skill.md`?
4. ✅ Are the new skills (module-codebase, ui-ux, documents, content-optimization) correct for their purposes?
5. ✅ Are any other skills needed?
6. ✅ Are CLI commands needed to manage skills? (e.g., `heraspec skill list`, `heraspec skill show <skill-name>`)

## Next Steps (After Confirmation)

1. Create folder structure in `src/core/skills/`
2. Create parser for skill.md
3. Update agent instructions to use skills
4. Create CLI commands to manage skills
5. Write sample skill.md for new skills
6. Create sample templates and scripts
