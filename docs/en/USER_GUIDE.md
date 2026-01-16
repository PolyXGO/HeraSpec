# HeraSpec User Guide

Detailed guide on how to use HeraSpec - a spec-based development framework for all types of projects and AI tools.

## Table of Contents

1. [Overview](#overview)
2. [Installation](#installation)
3. [Initializing a Project](#initializing-a-project)
4. [Creating Your First Change](#creating-your-first-change)
5. [Workflow](#workflow)
6. [CLI Commands](#cli-commands)
7. [Spec Format](#spec-format)
8. [Delta Spec Format](#delta-spec-format)
9. [Tasks Format](#tasks-format)
10. [Real-World Examples](#real-world-examples)
11. [AI Integration](#ai-integration)

## Overview

HeraSpec is a specification-based development framework that helps you:

- **Plan before coding**: Align with AI on what needs to be built
- **Track changes**: Manage changes through change proposals
- **Work across projects**: Supports WordPress, Perfex CRM, Laravel, Node.js, etc.
- **AI integration**: Works with any AI tool (Cursor, Copilot, Windsurf, etc.)

### Directory Structure

```
heraspec/
  project.md              # Project overview information
  config.yaml            # HeraSpec configuration
  specs/                 # Main specs (source of truth) and delta specs
    global/              # Source specs
    wordpress/
      plugin-core.md
    crm/perfex/
      modules-core.md
    add-two-factor-auth/ # Delta specs for change
      wordpress/plugin-core.md
      crm/perfex/modules-core.md
  changes/               # Changes in progress
    add-two-factor-auth/
      proposal.md
      tasks.md
      design.md (optional)
      # Delta specs are NOT in changes/, but in specs/<slug>/
  archives/              # Completed changes
```

## Installation

### Requirements

- **Node.js >= 20.19.0** - Check version: `node --version`

### Installing CLI

#### If HeraSpec is published on npm:

```bash
npm install -g heraspec
```

#### If developing (development mode):

HeraSpec is currently not published on npm. You need to build and link from source:

```bash
# Navigate to HeraSpec directory
cd /Applications/Data/Projects/HeadRandomSpec/HeraSpec

# Install dependencies
npm install

# Build code
npm run build

# Link for global use
npm link
```

**Note**: You don't need to copy the HeraSpec directory into your project! HeraSpec is a global CLI tool, just link once.

Check installation:

```bash
heraspec --version
```

See also: [DEVELOPMENT_SETUP.md](./DEVELOPMENT_SETUP.md) for details on development setup.

## Initializing a Project

### Step 1: Navigate to Project Directory

```bash
cd my-project
```

### Step 2: Run Init Command

```bash
heraspec init
```

This command will create:

- `heraspec/` directory with full structure
- `AGENTS.heraspec.md` file at root (for AI tools)
- Template files (`project.md`, `config.yaml`)

**Important notes:**
- If already initialized, running `heraspec init` again will **update** `AGENTS.heraspec.md` with the latest template (including Skills System instructions)
- `project.md` and `config.yaml` files will **not be overwritten** if they already exist (to protect your edited content)
- **Skills**: `heraspec init` only creates the `heraspec/skills/` directory and `README.md`. Skills are **NOT automatically copied** into the project. You need to create or copy skills into `heraspec/skills/` when needed (see [Skills System](#skills-system) section for how to add skills)
- To update to the latest template, just run: `heraspec init`

### Step 3: Update Project Information

Open `heraspec/project.md` and fill in information:

```markdown
# HeraSpec Project

## Overview
Describe your project here.

## Project Types
- wordpress-plugin
- perfex-module

## Tech Stack
- PHP 8.1
- WordPress 6.0
- Laravel 10

## Conventions
- Code style: PSR-12
- Naming: camelCase for functions, PascalCase for classes
```

## Creating Your First Change

### Method 1: Ask AI to Create

Ask your AI assistant:

```
Create a HeraSpec change to add two-factor authentication (2FA) 
for WordPress plugin and Perfex module.
```

**Or ask AI to automatically read project.md and create changes:**

```
Read heraspec/project.md and create HeraSpec changes for all 
features mentioned in the Overview/Features/Roadmap section.
```

```
Based on the description in heraspec/project.md, create HeraSpec changes 
to implement the necessary features by phase/section.
```

**More detailed sample prompt:**

```
Please follow these steps:
1. Read and analyze heraspec/project.md
2. Identify features/functions that need to be built
3. For each feature, create a separate HeraSpec change
4. Each change needs:
   - proposal.md: Clearly describe purpose and scope
   - tasks.md: Grouped by project type and skill
   - specs/: Delta specs with correct Meta section for project type/stack
5. Ensure compliance with conventions in project.md
```

AI will automatically create:

```
heraspec/changes/add-two-factor-auth/
  ├── proposal.md       # Change proposal
  ├── tasks.md          # Task list
  └── design.md         # Technical design (optional)

heraspec/specs/add-two-factor-auth/  # Delta specs (NOT in changes/)
  ├── wordpress/plugin-core.md
  └── crm/perfex/modules-core.md
```

### Method 2: Create Manually

You can also create manually:

```bash
mkdir -p heraspec/changes/add-two-factor-auth
mkdir -p heraspec/specs/add-two-factor-auth
touch heraspec/changes/add-two-factor-auth/proposal.md
touch heraspec/changes/add-two-factor-auth/tasks.md
# Delta specs are created in heraspec/specs/add-two-factor-auth/ (NOT in changes/)
```

## Workflow

### 1. Create Change

- AI or you create change directory
- Write proposal.md describing purpose and scope
- Create tasks.md with task list
- Write delta specs in `specs/`

### 2. Refine Specs

- Review delta specs: `heraspec show add-two-factor-auth`
- Ask AI to edit specs if needed
- Validate: `heraspec validate add-two-factor-auth`
- **Note**: Delta specs are in `heraspec/specs/<change-name>/`, don't edit source specs directly

### 3. Approve

When you're satisfied with specs, notify AI:

```
Specs have been approved. Start implementing.
```

Or simply:

```
OK, let's start.
```

### 4. Implement

- AI or you follow tasks.md
- Mark task as complete: `- [x]` instead of `- [ ]`
- Check progress: `heraspec show add-two-factor-auth`

### 5. Archive

When complete:

```bash
heraspec archive add-two-factor-auth --yes
```

This command will:

- Merge delta specs into source specs
- Move change folder to `archives/` with date prefix
- Update source of truth specs

### 6. Generate Product Documentation

After having enough specs, generate product documentation:

```bash
heraspec make docs                    # Default uses chatgpt
heraspec make docs --agent claude     # Specify agent
```

Output: `documentation/product-documentation.txt` - Feature description documentation for end-users.

### 7. Generate Test Cases

Generate test cases from specs:

```bash
heraspec make test                    # Unit tests (default)
heraspec make test --type integration # Integration tests
heraspec make test --type e2e         # E2E tests
```

Output: Test files in `tests/<type>/` - Skeleton tests that need logic implementation.

### 8. Feature Suggestions

Analyze project and suggest new features:

```bash
heraspec suggest
```

Output: `heraspec/suggestions/feature-suggestions.md` - List of suggestions with integration points.

## CLI Commands

### `heraspec init [path]`

Initialize HeraSpec in project.

```bash
heraspec init              # Initialize in current directory
heraspec init ./subdir     # Initialize in subdir
```

### `heraspec list`

List changes or specs.

```bash
heraspec list              # List changes
heraspec list --specs      # List specs
heraspec list --changes    # List changes (default)
```

Example output:

```
Active changes:
──────────────────────────────────────────────────
  • add-two-factor-auth
  • improve-user-dashboard

Specs:
──────────────────────────────────────────────────
  • global
  • wordpress/plugin-core
  • crm/perfex/modules-core
```

### `heraspec show <item-name>`

Display details of change or spec.

```bash
heraspec show add-two-factor-auth    # View change
heraspec show wordpress/plugin-core  # View spec
```

Displays:

- Proposal
- Tasks
- Design (if available)
- Delta specs

### `heraspec validate <item-name>`

Check validity of change or spec.

```bash
heraspec validate add-two-factor-auth
heraspec validate wordpress/plugin-core --strict
```

Example output:

```
Validation Report: add-two-factor-auth

────────────────────────────────────────────────────────
✓ Valid

Warnings:
  • Requirement "User Authentication" has no scenarios
```

### `heraspec archive <change-name> [--yes]`

Archive completed change and merge specs.

```bash
heraspec archive add-two-factor-auth --yes
```

**Note**: Without `--yes` will require confirmation.

### `heraspec skill list`

List all available skills in project.

```bash
heraspec skill list
```

Example output:
```
Available Skills:

════════════════════════════════════════════════════════════

📦 perfex-module:
   • module-codebase
   • module-registration
   • permission-group

🔧 Cross-cutting skills:
   • ui-ux
   • documents
   • content-optimization
   • unit-test
   • integration-test
   • e2e-test
   • suggestion
```

### `heraspec skill show <skill-name> [--project-type <type>]`

Display details about a skill.

```bash
# Project-specific skill
heraspec skill show module-codebase --project-type perfex-module

# Cross-cutting skill
heraspec skill show ui-ux
```

Displays:
- Purpose and when to use
- Step-by-step process
- Input/Output
- Available templates and scripts
- Full content of skill.md

### `heraspec skill add <skill-name> [--project-type <type>]`

Add a default skill to project from HeraSpec templates.

```bash
# Cross-cutting skill
heraspec skill add ui-ux
heraspec skill add unit-test
heraspec skill add integration-test
heraspec skill add e2e-test
heraspec skill add suggestion

# Project-specific skill
heraspec skill add module-codebase --project-type perfex-module
```

**Functionality:**
- Copy skill template from HeraSpec core to project
- Automatically create directory structure (skill.md, templates/, scripts/, examples/)
- Copy resources if available (scripts, templates, data)

**Notes:**
- Skill will be created in `heraspec/skills/<skill-name>/` (cross-cutting)
- Or `heraspec/skills/<project-type>/<skill-name>/` (project-specific)
- If skill already exists, command will error

**How to Add Skills to Your Project:**

1. **View available skills in HeraSpec core:**
   When you run `heraspec skill add` with an invalid skill name, the command will show all available skills:
   ```bash
   heraspec skill add invalid-skill-name
   # Output:
   # Skill template "invalid-skill-name" not found
   #
   # Available skills:
   #   - ui-ux (cross-cutting)
   #   - documents (cross-cutting)
   #   - unit-test (cross-cutting)
   #   - module-codebase (projectType: perfex-module)
   ```

2. **Add cross-cutting skills:**
   These skills work across all project types:
   ```bash
   # Add UI/UX skill (includes scripts, templates, and data)
   heraspec skill add ui-ux
   
   # Add test skills
   heraspec skill add unit-test
   heraspec skill add integration-test
   heraspec skill add e2e-test
   
   # Add other cross-cutting skills
   heraspec skill add documents
   heraspec skill add content-optimization
   heraspec skill add suggestion
   ```

3. **Add project-specific skills:**
   These skills are tied to a specific project type:
   ```bash
   # Add Perfex module skill
   heraspec skill add module-codebase --project-type perfex-module
   ```

4. **What gets copied:**
   The command automatically:
   - Copies `skill.md` template to the project
   - Creates standard directories: `templates/`, `scripts/`, `examples/`
   - Copies additional resources if the skill has them:
     - **Scripts**: Python scripts, shell scripts, etc.
     - **Templates**: Code templates, file templates
     - **Data**: CSV files, JSON files, configuration files

5. **Example: Adding UI/UX skill:**
   ```bash
   heraspec skill add ui-ux
   ```
   
   This creates:
   ```
   heraspec/skills/ui-ux/
   ├── skill.md              # Main skill guide
   ├── scripts/              # Search scripts (automatically copied)
   │   └── search.py
   ├── templates/            # UI templates (automatically copied)
   │   └── ...
   ├── data/                # Design data (automatically copied)
   │   ├── products.csv
   │   ├── styles.csv
   │   ├── charts.csv
   │   └── stacks/
   ├── examples/            # Example files (empty, for your examples)
   └── ...
   ```

6. **Verify skill was added:**
   ```bash
   # List all skills in project
   heraspec skill list
   
   # View skill details
   heraspec skill show ui-ux
   ```

7. **After adding a skill:**
   - Review `skill.md` to understand the skill's purpose and workflow
   - Check `scripts/` folder for any automation scripts
   - Review `templates/` for reusable templates
   - Add your own examples to `examples/` folder
   - Use the skill in tasks: `(skill: ui-ux)`

**Important Notes:**
- Skills are copied from HeraSpec core templates, so you get the latest version
- If a skill has resources (scripts, templates, data), they are automatically copied
- You can customize the skill after adding it to your project
- Skills are project-specific, so each project needs to add skills separately

### `heraspec skill repair`

Repair skills structure to match HeraSpec standard.

```bash
heraspec skill repair
```

**Functionality:**
- Check skills directory structure
- Create `skill.md` if missing
- Create standard directories (templates/, scripts/, examples/)
- Ensure skills follow HeraSpec structure

### `heraspec restore <archive-name> [--yes]`

Restore an archive back to active change.

```bash
heraspec restore 2025-01-15-add-two-factor-auth --yes
```

**Notes:**
- Archive name includes date prefix (YYYY-MM-DD-change-name)
- Change will be restored to `changes/` with name without date prefix
- Spec changes that were merged will remain in source specs (not automatically reverted)
- If change already exists, command will error

**Example:**
```bash
# View list of archives
ls heraspec/changes/archives/
# → 2025-01-15-add-two-factor-auth
# → 2025-01-20-add-search-feature

# Restore archive
heraspec restore 2025-01-15-add-two-factor-auth --yes
# → Change "add-two-factor-auth" restored to changes/
```

### `heraspec view`

Display interactive dashboard.

```bash
heraspec view
```

Displays overview of changes and specs.

### `heraspec helper`

Display quick usage guide, sample prompts, and workflow.

```bash
heraspec helper
```

This command displays:
- Quick Start: Quick start steps
- CLI Commands: List of all commands with descriptions
- Sample Prompts: Example prompts to ask AI to create changes
- Workflow: 5-step workflow
- Tips & Best Practices: Tips and best practices

**Example output:**
```
📚 HeraSpec Helper - Usage Guide

🚀 Quick Start
1. Initialize new project:
   cd my-project
   heraspec init

2. Configure project.md:
   Edit heraspec/project.md with your project information

...

💬 Sample Prompts for AI
1. Simple Change Creation:
   "Create a HeraSpec change to add 2FA authentication feature"
   
...
```

## Spec Format

Spec describes system requirements. Basic structure:

```markdown
# Spec: Web Backend – Core API

## Meta
- Project type: web-backend
- Domain: api-core
- Stack: Laravel|Node|PHP

## Purpose
Purpose of this spec. Brief description of functionality to build.

## Requirements

### Requirement: User Authentication
System MUST issue token when login succeeds.

#### Scenario: Valid credentials
- GIVEN a registered user
- WHEN they submit valid credentials
- THEN a JWT token is returned

#### Scenario: Invalid credentials
- GIVEN a registered user
- WHEN they submit wrong credentials
- THEN return 401 Unauthorized error
```

### Rules

1. **Meta Section**: Must be present
   - Project type: Project type
   - Domain: Domain (optional)
   - Stack: Technology used (optional)

2. **Purpose**: Brief description of purpose

3. **Requirements**: 
   - Each requirement must have name and description
   - Should have at least one scenario
   - Use MUST/SHALL in description

4. **Scenarios**: 
   - Use GIVEN/WHEN/THEN
   - Clearly describe steps

## Delta Spec Format

Delta spec describes changes relative to original spec. Structure:

```markdown
# Delta: Web Backend – Core API (add-two-factor-auth)

## ADDED Requirements

### Requirement: Two-Factor Authentication
System MUST require second factor when logging in.

#### Scenario: OTP is required
- WHEN user submits valid credentials
- THEN an OTP challenge is requested
- AND user must enter OTP to complete login

## MODIFIED Requirements

### Requirement: User Authentication
**Previously**: System only required username/password.

**Now**: System requires username/password and OTP.

#### Scenario: Login with 2FA
- GIVEN user has enabled 2FA
- WHEN user submits valid credentials
- THEN OTP is sent to email/phone
- AND user must enter OTP to login

## REMOVED Requirements

### Requirement: Basic Authentication Only
Login feature with only username/password has been removed.
```

### Delta Types

- **ADDED**: Add new requirement
- **MODIFIED**: Modify existing requirement (must include full new content)
- **REMOVED**: Remove requirement

## Tasks Format

Tasks are grouped by project type and skill:

```markdown
# Tasks

## 1. WordPress plugin – 2FA Settings (projectType: wordpress-plugin, skill: admin-settings-page)
- [ ] 1.1 Create settings page in admin
- [ ] 1.2 Add option to enable/disable 2FA
- [ ] 1.3 Save configuration to database
- [x] 1.4 Test settings page

## 2. WordPress plugin – OTP Generation (projectType: wordpress-plugin, skill: rest-endpoint)
- [ ] 2.1 Create REST endpoint to generate OTP
- [ ] 2.2 Validate OTP when user submits
- [ ] 2.3 Send OTP via email

## 3. Perfex module – Category Management (projectType: perfex-module, skill: module-codebase)
- [ ] 3.1 Create module structure
- [ ] 3.2 Configure module registration
- [ ] 3.3 Create database tables

## 4. UI/UX – Admin Interface (skill: ui-ux)
- [ ] 4.1 Design color palette
- [ ] 4.2 Create component styles
- [ ] 4.3 Implement responsive design

## 5. Documents – User Guide (skill: documents)
- [ ] 5.1 Write technical documentation
- [ ] 5.2 Create user guide
- [ ] 5.3 Generate API docs
```

### Task Rules

1. **Group by project type and skill**: Each group has clear title
2. **Skill tag required**: Each task group must have skill tag so agent knows how to implement
3. **Numbering**: Use sequential numbers (1.1, 1.2, 2.1, etc.)
4. **Checkbox**: 
   - `- [ ]` = not done
   - `- [x]` = completed
5. **Clear description**: Each task must have specific description

### Skills System

**Notes about Skills:**
- `heraspec init` only creates `heraspec/skills/` directory and `README.md`
- Skills are **NOT automatically copied** into project from HeraSpec core
- You need to **create or copy** skills into `heraspec/skills/` when needed
- Skill templates are available in HeraSpec core (`src/core/templates/skills/`) but need to be manually copied into project

**How to add Skills to project:**

1. **Copy from HeraSpec core templates** (if developing HeraSpec):
   ```bash
   # Copy skill template to project
   cp -r /path/to/HeraSpec/src/core/templates/skills/ui-ux-skill.md \
         heraspec/skills/ui-ux/skill.md
   
   # Copy scripts and templates if available
   cp -r /path/to/HeraSpec/src/core/templates/skills/scripts \
         heraspec/skills/ui-ux/
   ```

2. **Create new skill** following structure:
   ```
   heraspec/skills/
   ├── <project-type>/          # For project-specific skills
   │   └── <skill-name>/
   │       ├── skill.md
   │       ├── templates/
   │       ├── scripts/
   │       └── examples/
   └── <skill-name>/            # For cross-cutting skills
       ├── skill.md
       ├── templates/
       ├── scripts/
       └── examples/
   ```

3. **View available skills**:
   ```bash
   heraspec skill list              # List skills in project
   heraspec skill show <skill-name> # View skill details
   ```

**Important**: When task has skill tag, AI agent will automatically:

1. **Find skill folder**:
   - Project-specific: `heraspec/skills/<project-type>/<skill-name>/`
   - Cross-cutting: `heraspec/skills/<skill-name>/`

2. **Read skill.md**:
   - Understand purpose and process
   - Know required input/output
   - Follow tone and rules

3. **Use resources**:
   - Run scripts from `scripts/` folder
   - Use templates from `templates/` folder
   - Reference examples from `examples/` folder

4. **Implement according to skill.md**:
   - Follow step-by-step process
   - Apply naming conventions
   - Respect limitations

**Example**:
- Task: `(projectType: perfex-module, skill: module-codebase)`
- Agent reads: `heraspec/skills/perfex-module/module-codebase/skill.md`
- Agent follows: 5-step process in skill.md
- Agent uses: Templates and scripts in skill folder

**Special example - UI/UX skill**:
- Task: `(skill: ui-ux)`
- Agent reads: `heraspec/skills/ui-ux/skill.md`
- Agent MUST run search scripts before implementing:
  ```bash
  python3 heraspec/skills/ui-ux/scripts/search.py "beauty spa" --domain product
  python3 heraspec/skills/ui-ux/scripts/search.py "elegant minimal" --domain style
  python3 heraspec/skills/ui-ux/scripts/search.py "layout responsive" --stack html-tailwind
  ```
- Agent aggregates search results
- Agent implements with colors, fonts, styles from search results
- Agent verifies with pre-delivery checklist

**Note**: `heraspec skill list` and `heraspec skill show` only display skills **already in project** (`heraspec/skills/`), not all skills available in HeraSpec core. To use skills, you need to add them to project using `heraspec skill add <skill-name>`.

**Available skills in HeraSpec core:**
- **Cross-cutting**: `ui-ux`, `documents`, `content-optimization`, `unit-test`, `integration-test`, `e2e-test`, `suggestion`
- **Project-specific**: `module-codebase` (perfex-module), and many other skills for each project type

**Add skills to project:**
```bash
# Add cross-cutting skills
heraspec skill add ui-ux
heraspec skill add unit-test
heraspec skill add integration-test
heraspec skill add e2e-test
heraspec skill add suggestion

# Add project-specific skills
heraspec skill add module-codebase --project-type perfex-module
```

**Setup UI/UX skill**: See [UI_UX_SKILL_SETUP.md](./UI_UX_SKILL_SETUP.md) to setup UI/UX skill with search scripts.

## Real-World Examples

### Example 1: Adding Search Feature

**1. Create Change:**

```bash
# AI creates or you create manually
mkdir -p heraspec/changes/add-search-feature
mkdir -p heraspec/specs/add-search-feature  # Delta specs here
```

**2. Write Proposal (`proposal.md`):**

```markdown
# Change Proposal: add-search-feature

## Purpose
Add search feature for WordPress plugin, allowing users to search posts by keyword, category, and date range.

## Scope
- WordPress plugin: Add search form and results page
- Backend API: Add search endpoint

## Project Types
- wordpress-plugin
- backend-api

## Impact
- Affects: plugin core, admin UI, API routes
```

**3. Write Delta Spec:**

```markdown
# Delta: WordPress Plugin Core (add-search-feature)

## ADDED Requirements

### Requirement: Search Functionality
Plugin MUST provide post search functionality.

#### Scenario: Search by keyword
- GIVEN user is on search page
- WHEN they enter keyword "hello" and click Search
- THEN display all posts containing "hello" in title or content

#### Scenario: Search by category
- GIVEN user is on search page
- WHEN they select category "News" and click Search
- THEN display all posts in category "News"
```

**4. Write Tasks:**

```markdown
## 1. WordPress plugin – Search Form (projectType: wordpress-plugin, skill: shortcode)
- [ ] 1.1 Create shortcode [search_form]
- [ ] 1.2 Design UI for form (input, dropdown, button)
- [ ] 1.3 Handle form submission

## 2. WordPress plugin – Search Results (projectType: wordpress-plugin, skill: template-part)
- [ ] 2.1 Create template to display results
- [ ] 2.2 Pagination for results
- [ ] 2.3 Empty state when no results
```

**5. Implement and Archive:**

```bash
# After completion
heraspec archive add-search-feature --yes
```

### Example 2: Creating Changes Automatically from project.md

Suppose you have `heraspec/project.md` describing the project:

```markdown
# HeraSpec Project

## Overview
Build order management system with WordPress plugin and Perfex CRM module.

## Project Types
- wordpress-plugin
- perfex-module

## Tech Stack
- PHP 8.1
- WordPress 6.0
- Perfex CRM 3.0
- MySQL 8.0

## Features to build
1. Order management (WordPress plugin)
2. Payment integration (Perfex module)
3. Revenue reports (WordPress plugin)
4. Data sync between WordPress and Perfex
```

**Ask AI:**

```
Read heraspec/project.md and create HeraSpec changes for all features 
listed in the Features section. Each feature is a separate change.
```

**AI will automatically:**

1. **Read project.md** and understand context
2. **Analyze** project types, tech stack
3. **Create 4 changes:**
   - `add-order-management` (WordPress plugin)
   - `add-payment-integration` (Perfex module)
   - `add-revenue-reports` (WordPress plugin)
   - `add-data-sync` (Multi-stack)

4. **Each change has:**
   - `proposal.md` - Feature description based on project.md
   - `tasks.md` - Tasks with correct project type and skills
   - `specs/` - Delta specs with correct Meta section

**Result:**

```
heraspec/
├── project.md
└── changes/
    ├── add-order-management/
    │   ├── proposal.md  # Based on Features #1 from project.md
    │   ├── tasks.md
    │   └── specs/wordpress/plugin-core.md
    ├── add-payment-integration/
    │   ├── proposal.md  # Based on Features #2
    │   ├── tasks.md
    │   └── specs/crm/perfex/modules-core.md
    └── ...
```

## AI Integration

### How AI Automatically Creates Changes Based on project.md

When you have a `project.md` file describing the project in detail, AI can automatically analyze and create necessary changes. Here's how to request:

#### Basic Prompt

```
Read heraspec/project.md and create HeraSpec changes for all features 
described in it.
```

#### Detailed Prompt (Recommended)

```
Please follow this process to create HeraSpec changes based on project.md:

1. **Read and analyze project.md:**
   - Read file heraspec/project.md
   - Identify project types (WordPress plugin, Perfex module, etc.)
   - Identify tech stack used
   - Identify conventions and standards

2. **Analyze features:**
   - List all features/functions that need to be built
   - Identify which features belong to which project type
   - Identify which features are related (can be grouped into 1 change)

3. **Create changes:**
   - For each feature (or related feature group), create a separate change
   - Change name: use kebab-case format, verb-led (add-, create-, implement-)
   - Example: add-user-authentication, create-payment-gateway, implement-api-endpoints

4. **Each change needs:**
   - **proposal.md:**
     * Purpose: Purpose of feature
     * Scope: Scope (which project types will be affected)
     * Project Types: List related project types
     * Impact: Parts of system that will be affected
   
   - **tasks.md:**
     * Group tasks by project type and skill
     * Each task must have format: (projectType: xxx, skill: xxx)
     * Clear numbering (1.1, 1.2, 2.1, etc.)
   
   - **specs/**: Delta specs
     * Create spec files in structure matching project type
     * Each spec must have Meta section with project type, domain, stack
     * Use format: ADDED Requirements

5. **Follow conventions:**
   - Apply coding standards from project.md
   - Use correct project types and skills
   - Ensure consistency with defined tech stack

Start by reading heraspec/project.md and creating changes.
```

#### Prompt for Each Phase/Roadmap

If project.md has roadmap divided by phase:

```
Based on heraspec/project.md, create HeraSpec changes for Phase 1 
(according to roadmap in file). Each feature in Phase 1 is a separate change.
```

#### Specific Example Prompt

```
Please read heraspec/project.md and:

1. Identify all features that need to be built
2. Create a change proposal for each main feature
3. For large features, split into smaller changes
4. Ensure each change has complete proposal, tasks, and delta specs

High priority features should be created first.
```

#### Important Notes

- **AI will automatically read project.md** if you request
- **AI will analyze** project types, tech stack, and conventions
- **AI will create changes** matching structure and format
- **You should review** changes before approving for implementation

### Cursor / Windsurf / Copilot Chat

These tools automatically read `AGENTS.heraspec.md`. You just need to:

1. Ask AI: "Create a HeraSpec change to..."
2. AI automatically creates change folder and files
3. Refine: "Add scenario for requirement X"
4. Implement: "Apply the HeraSpec change add-feature-name"
5. Archive: "Archive the change add-feature-name"

### Claude Desktop / Antigravity

These tools also support AGENTS.md:

1. Ensure `AGENTS.heraspec.md` file exists at root
2. Ask AI in correct format
3. AI will follow workflow in AGENTS.heraspec.md

### Sample Workflow

**Step 1 - Create Change:**

```
You: Create a HeraSpec change to add export data feature for Perfex module.

AI: I will create change proposal for export data.
     *Creates heraspec/changes/add-export-data/*
```

**Step 2 - Refine:**

```
You: Add requirement about PDF format export.

AI: I will update delta spec with PDF export requirement.
     *Updates heraspec/changes/add-export-data/specs/perfex/modules-core.md*
```

**Step 3 - Validate:**

```bash
heraspec validate add-export-data
```

**Step 4 - Approve:**

```
You: Specs have been approved. Start implementing.
```

**Step 5 - Implement:**

```
AI: I will implement tasks in add-export-data change.
     *Does each task, marks as complete*
```

**Step 6 - Archive:**

```bash
heraspec archive add-export-data --yes
```

## Important Notes

### ✅ Should Do

- Always create change before implementing
- Delta specs are in `heraspec/specs/<change-name>/` (NOT in changes folder)
- Validate specs before implementing
- Mark completed tasks
- Archive changes after completion

### ❌ Should Not

- Don't edit source specs directly (in `specs/`, except delta specs in `specs/<change-name>/`)
- Don't create specs in `changes/<slug>/specs/` (specs must be in `specs/<slug>/`)
- Don't skip refine specs step
- Don't archive when tasks not completed
- Don't create change without proposal

## Error Handling

### Error: "No HeraSpec changes directory found"

```bash
# Run init
heraspec init
```

### Error: "Change not found"

```bash
# Check change name
heraspec list

# Or view all folders in changes/
ls heraspec/changes/
```

### Validation Error

```bash
# View error details
heraspec validate <change-name>

# Fix errors in files
# Validate again
heraspec validate <change-name>
```

## Best Practices

1. **Specs First**: Always write specs before coding
2. **Small Changes**: Break changes into manageable parts
3. **Clear Proposals**: Write clear proposals with complete descriptions
4. **Complete Tasks**: Each task should complete a specific goal
5. **Regular Validation**: Validate frequently to catch errors early
6. **Generate Tests**: Use `heraspec make test` to create test cases from specs
7. **Use Test Skills**: Implement tests according to skills guide (unit-test, integration-test, e2e-test)
8. **Generate Documentation**: Use `heraspec make docs` to create product documentation
9. **Feature Suggestions**: Use `heraspec suggest` to find opportunities to improve project

## References

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Technical architecture
- [PROJECT_TYPES_AND_SKILLS.md](./PROJECT_TYPES_AND_SKILLS.md) - List of project types and skills
- [UPDATE_CHECKLIST.md](./UPDATE_CHECKLIST.md) - Checklist when updating HeraSpec source code

## Support

If you encounter issues:

1. Check this guide again
2. See examples in documentation
3. Validate changes/specs to find errors
4. Create issue on GitHub repository

---

**Happy using HeraSpec!** 🚀
