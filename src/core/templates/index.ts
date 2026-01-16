/**
 * HeraSpec Templates
 */

export const PROJECT_TEMPLATE = `# HeraSpec Project

## Overview
Describe your project here.

## Project Types
- wordpress-plugin
- wordpress-theme
- perfex-module
- laravel-package
- node-service
- generic-webapp
- backend-api
- frontend-app
- multi-stack

## Tech Stack
List your technologies here (e.g., PHP 8.1, WordPress 6.0, Laravel 10, etc.)

## Conventions
Define coding standards, architectural patterns, and conventions to follow.

`;

export const AGENTS_TEMPLATE = `# HeraSpec — AI Agent Instructions

This document defines the workflow for AI agents working with HeraSpec.

## Core Workflow

### Step 1 — Create a Change

**When creating changes, ALWAYS read heraspec/project.md first to understand:**
- Project types being used
- Tech stack and conventions
- Existing architecture patterns
- Coding standards

**Then scaffold:**
- \`heraspec/changes/<slug>/\` - Create proposal.md, tasks.md, design.md (optional)
- \`heraspec/specs/<slug>/\` - Create delta specs here (NOT inside changes folder)

**If user asks to create changes based on project.md:**
1. Read \`heraspec/project.md\` thoroughly
2. Identify all features/capabilities mentioned
3. Create separate changes for each major feature
4. Ensure each change follows project.md conventions
5. Use correct project types and skills from project.md

### Step 2 — Refine Specs
- Update delta specs in \`heraspec/specs/<slug>/\`
- Never modify source-of-truth specs directly

### Step 3 — Approval
- Wait for user: "Specs approved."

### Step 4 — Implementation

**CRITICAL: When implementing tasks, ALWAYS use Skills system:**

1. **Read task line** to identify skill:
   \`\`\`markdown
   ## 1. Perfex module – Category Management (projectType: perfex-module, skill: module-codebase)
   - [ ] 1.1 Create module structure
   \`\`\`

2. **Find skill folder**:
   - Project-specific: \`heraspec/skills/<project-type>/<skill-name>/\`
   - Cross-cutting: \`heraspec/skills/<skill-name>/\`

3. **Read skill.md**:
   - Understand purpose, steps, inputs, outputs
   - Follow tone, rules, and limitations
   - Check available templates and scripts

4. **Use skill resources**:
   - Run scripts from \`scripts/\` folder if needed
   - Use templates from \`templates/\` folder
   - Reference examples from \`examples/\` folder

5. **Implement following skill.md guidance**:
   - Follow step-by-step process
   - Use correct naming conventions
   - Apply code style rules
   - Respect limitations

**Example workflow:**
- Task: \`(projectType: perfex-module, skill: module-codebase)\`
- Agent reads: \`heraspec/skills/perfex-module/module-codebase/skill.md\`
- Agent follows: Steps, uses templates, runs scripts
- Agent implements: According to skill.md guidelines

**Special case - UI/UX skill:**
- Task: \`(skill: ui-ux)\`
- Agent reads: \`heraspec/skills/ui-ux/skill.md\`
- Agent MUST use search scripts before implementing:
  \`\`\`bash
  # Search for design intelligence
  python3 heraspec/skills/ui-ux/scripts/search.py "<keyword>" --domain <domain>
  python3 heraspec/skills/ui-ux/scripts/search.py "<keyword>" --stack <stack>
  \`\`\`
- Agent synthesizes search results
- Agent implements with proper colors, fonts, styles from search results
- Agent verifies with pre-delivery checklist

**Special case - Flatsome UX Element skill:**
- Task: \`(projectType: wordpress, skill: ux-element)\`
- Agent reads: \`heraspec/skills/wordpress/ux-element/skill.md\`
- Agent MUST follow the **Wrapping Rule**: Use \`<span>\` with \`id="{{:: shortcode.$id }}"\`
- Agent uses templates from \`heraspec/skills/wordpress/ux-element/templates/\` (Controller, Shortcode, HTML Template, SVG Thumbnail)
- Agent ensures real-time preview support in AngularJS template.

- Follow tasks.md
- Mark tasks completed: \`- [x]\`

### Step 5 — Archive
- Run: \`heraspec archive <slug> --yes\`
- This merges delta specs into source specs
- Moves change folder to archives

## Spec Format

Specs must include:
- \`## Meta\` section with project type, domain, stack
- \`## Purpose\`
- \`## Requirements\` with scenarios

## Delta Spec Format

Delta specs use:
- \`## ADDED Requirements\`
- \`## MODIFIED Requirements\`
- \`## REMOVED Requirements\`

## Tasks Format

Tasks grouped by project type and skill:
\`\`\`
## 1. WordPress plugin – admin settings page (projectType: wordpress-plugin, skill: admin-settings-page)
- [ ] Task description
\`\`\`

## Skills System

**CRITICAL: Always use Skills when implementing tasks!**

### How Skills Work

1. **Tasks reference skills**: \`(projectType: perfex-module, skill: module-codebase)\`
2. **Find skill folder**: 
   - Project-specific: \`heraspec/skills/<project-type>/<skill-name>/\`
   - Cross-cutting: \`heraspec/skills/<skill-name>/\`
3. **Read skill.md**: Understand purpose, steps, inputs, outputs, rules
4. **Use skill resources**: Scripts, templates, examples
5. **Implement following skill.md**: Follow step-by-step process

### Skill Discovery

- List all skills: Check \`heraspec/skills/\` directory
- Project-specific skills: \`heraspec/skills/<project-type>/\`
- Cross-cutting skills: \`heraspec/skills/<skill-name>/\` (root level)

### When Change Has Multiple Skills

**Important**: Each task group uses ONE skill. When working on a task group, agent MUST use that skill's skill.md.

Example with multiple skills in one change:
\`\`\`
## 1. Perfex module – Feature (projectType: perfex-module, skill: module-codebase)
- [ ] Task 1.1 Create module structure
- [ ] Task 1.2 Configure registration

## 2. UI/UX – Admin Interface (skill: ui-ux)
- [ ] Task 2.1 Design color palette
- [ ] Task 2.2 Create component styles

## 3. Documents – User Guide (skill: documents)
- [ ] Task 3.1 Write technical docs
\`\`\`

**Agent workflow:**
1. **For task group 1** (module-codebase):
   - Read: \`heraspec/skills/perfex-module/module-codebase/skill.md\`
   - Follow: Module codebase process
   - Use: Module codebase templates/scripts
   - Implement: Tasks 1.1, 1.2

2. **For task group 2** (ui-ux):
   - Read: \`heraspec/skills/ui-ux/skill.md\`
   - Follow: UI/UX process
   - Use: UI/UX templates/scripts
   - Implement: Tasks 2.1, 2.2

3. **For task group 3** (documents):
   - Read: \`heraspec/skills/documents/skill.md\`
   - Follow: Documents process
   - Use: Documents templates/scripts
   - Implement: Task 3.1

**Key rule**: Switch skill.md when switching task groups!

## Rules

1. **Specs first, tasks second, implementation last.**
2. **Always use Skills**: When task has skill tag, MUST read and follow skill.md
3. Never modify source-of-truth specs directly.
4. Delta specs go in \`heraspec/specs/<slug>/\` (NOT in changes folder).
5. Always wait for approval before implementation.
6. **One skill per task group**: Each task group should use one skill consistently.

`;

export const SKILLS_SECTION_TEMPLATE = `## Skills System

**CRITICAL: When implementing tasks, ALWAYS use Skills system:**

1. **Read task line** to identify skill:
   \`\`\`markdown
   ## 1. Perfex module – Category Management (projectType: perfex-module, skill: module-codebase)
   - [ ] 1.1 Create module structure
   \`\`\`

2. **Find skill folder**:
   - Project-specific: \`heraspec/skills/<project-type>/<skill-name>/\`
   - Cross-cutting: \`heraspec/skills/<skill-name>/\`

3. **Read skill.md**:
   - Understand purpose, steps, inputs, outputs
   - Follow tone, rules, and limitations
   - Check available templates and scripts

4. **Use skill resources**:
   - Run scripts from \`scripts/\` folder if needed
   - Use templates from \`templates/\` folder
   - Reference examples from \`examples/\` folder

5. **Implement following skill.md guidance**:
   - Follow step-by-step process
   - Use correct naming conventions
   - Apply code style rules
   - Respect limitations

**Example workflow:**
- Task: \`(projectType: perfex-module, skill: module-codebase)\`
- Agent reads: \`heraspec/skills/perfex-module/module-codebase/skill.md\`
- Agent follows: Steps, uses templates, runs scripts
- Agent implements: According to skill.md guidelines

- Agent implements with proper colors, fonts, styles from search results
- Agent verifies with pre-delivery checklist

**Special case - Flatsome UX Element skill:**
- Task: \`(projectType: wordpress, skill: ux-element)\`
- Agent reads: \`heraspec/skills/wordpress/ux-element/skill.md\`
- Agent MUST follow the **Wrapping Rule**: Use \`<span>\` with \`id="{{:: shortcode.$id }}"\`
- Agent uses templates from \`heraspec/skills/wordpress/ux-element/templates/\` (Controller, Shortcode, HTML Template, SVG Thumbnail)
- Agent ensures real-time preview support in AngularJS template.

### Skill Discovery

- List all skills: Check \`heraspec/skills/\` directory
- Project-specific skills: \`heraspec/skills/<project-type>/\`
- Cross-cutting skills: \`heraspec/skills/<skill-name>/\` (root level)

### When Change Has Multiple Skills

**Important**: Each task group uses ONE skill. When working on a task group, agent MUST use that skill's skill.md.

Example with multiple skills in one change:
\`\`\`
## 1. Perfex module – Feature (projectType: perfex-module, skill: module-codebase)
- [ ] Task 1.1 Create module structure
- [ ] Task 1.2 Configure registration

## 2. UI/UX – Admin Interface (skill: ui-ux)
- [ ] Task 2.1 Design color palette
- [ ] Task 2.2 Create component styles

## 3. Documents – User Guide (skill: documents)
- [ ] Task 3.1 Write technical docs
\`\`\`

**Agent workflow:**
1. **For task group 1** (module-codebase):
   - Read: \`heraspec/skills/perfex-module/module-codebase/skill.md\`
   - Follow: Module codebase process
   - Use: Module codebase templates/scripts
   - Implement: Tasks 1.1, 1.2

2. **For task group 2** (ui-ux):
   - Read: \`heraspec/skills/ui-ux/skill.md\`
   - Follow: UI/UX process
   - Use: UI/UX templates/scripts
   - Implement: Tasks 2.1, 2.2

3. **For task group 3** (documents):
   - Read: \`heraspec/skills/documents/skill.md\`
   - Follow: Documents process
   - Use: Documents templates/scripts
   - Implement: Task 3.1

**Key rule**: Switch skill.md when switching task groups!
`;

export const CONFIG_TEMPLATE = `# HeraSpec Configuration

projectTypes:
  - wordpress-plugin
  # Add other project types as needed

defaultDomain: global

`;


export function getSkillsSection(): string {
  return SKILLS_SECTION_TEMPLATE;
}

export const PROPOSAL_TEMPLATE = `# Change Proposal: <slug>

## Purpose
Describe why this change is needed.

## Scope
What will be changed?

## Project Types
- wordpress-plugin
- perfex-module

## Impact
What parts of the system will be affected?

`;

export const TASKS_TEMPLATE = `# Tasks

## 1. WordPress plugin – feature name (projectType: wordpress-plugin, skill: admin-settings-page)
- [ ] Task 1.1
- [ ] Task 1.2

## 2. Perfex module – feature name (projectType: perfex-module, skill: module-registration)
- [ ] Task 2.1

`;

export class TemplateManager {
  static getProjectTemplate(): string {
    return PROJECT_TEMPLATE;
  }

  static getAgentsTemplate(): string {
    return AGENTS_TEMPLATE;
  }

  static getConfigTemplate(): string {
    return CONFIG_TEMPLATE;
  }

  static getProposalTemplate(slug: string): string {
    return PROPOSAL_TEMPLATE.replace('<slug>', slug);
  }

  static getTasksTemplate(): string {
    return TASKS_TEMPLATE;
  }

  static getSkillsSection(): string {
    return SKILLS_SECTION_TEMPLATE;
  }
}

