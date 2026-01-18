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

## Universal Safety Rules

- **NO AUTO-COMMIT**: Agent MUST NOT perform \`git commit\` or \`git push\` autonomously. This task is reserved for the User unless explicitly ordered.
- **NO AUTO-PUBLISH**: Agent MUST NOT perform \`npm publish\` or trigger automated releases/deployments autonomously.
- **USER CONFIRMATION**: For destructive actions or public releases, always request explicit User approval first.

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
- **Variable Translation**: Variables with underscores in PHP (e.g., \`bg_color\`) MUST be accessed via camelCase in AngularJS (e.g., \`shortcode.options.bgColor\`).

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

**CRITICAL: Mandatory Prerequisite Check**

1. **Stop & Verify**: If you are asked to implement a task requiring a skill (e.g., "Generate documentation...", "Create UI/UX...", etc.), you MUST first check if the skill folder exists in \`heraspec/skills/\`.
2. **Missing Skill = STOP & TIP**: If the skill folder does NOT exist, the Agent MUST STOP IMMEDIATELY.
   - **DO NOT** create a task plan, do **NOT** output "Initializing documentation task...", and do **NOT** attempt manual generation.
   - **Output Tip**: Simply inform the user and suggest the command:
     > "Tip: Add the 'documents' skill for premium HTML & Landing Page support: 
     > heraspec skill add documents"
   - (Adjust tip text for other skills like \`ui-ux\`).
3. **Execute After Install**: Only after the skill folder is created, read the \`skill.md\` and proceed with the task.

**Example prompt for Documents skill:**
If you need to generate multi-format documentation, use this prompt:
> "Generate documentation with skill documents for [project-name]. Include:
> - Concise overview (documentations/documentation.txt)
> - Technical Markdown (documentations/documentation.md)
> - Interactive HTML (documentations/documentation.html)
> - Premium Documentation Landing Page (documentations/documentation-landing-page.html)
> - CRITICAL: Save all files in the /documentations directory (create it if missing)."

**Dynamic Documentation Generation**:
When generating documentation, do NOT simply fill a template. The Agent MUST:
1. **Create** the \`/documentations\` directory if it does not exist.
2. **Design** a custom layout and content structure suitable for the project type.
3. **Synchronize** with the \`ui-ux\` skill for premium visual design (colors, typography, animations).
4. **Scan All Specs**: If project-wide, read \`heraspec/project.md\` and all files in \`heraspec/specs/\` to synthesize the content.

### Skill Discovery & Usage

- List all skills: Check \`heraspec/skills/\` directory
- Project-specific skills: \`heraspec/skills/<project-type>/\`
- Cross-cutting skills: \`heraspec/skills/<skill-name>/\` (root level)
- **Consistency**: Follow the step-by-step process in the skill's \`skill.md\`.

### When Change Has Multiple Skills

**Important**: Each task group uses ONE skill. When working on a task group, agent MUST use that skill's skill.md.

Example with multiple skills in one change:
\`\`\`
## 1. WordPress module – Feature (skill: admin-settings-page)
- [ ] Task 1.1 Create module structure
- [ ] Task 1.2 Configure registration

## 2. UI/UX – Admin Interface (skill: ui-ux)
- [ ] Task 2.1 Design color palette
- [ ] Task 2.2 Create component styles

## 3. Documents – User Guide (skill: documents)
- [ ] Task 3.1 Write technical docs
\`\`\`

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

**CRITICAL: Mandatory Prerequisite Check**

1. **Stop & Verify**: If you are asked to implement a task requiring a skill (e.g., "Generate documentation...", "Create UI/UX...", etc.), you MUST first check if the skill folder exists in \`heraspec/skills/\`.
2. **Missing Skill = STOP & TIP**: If the skill folder does NOT exist, the Agent MUST STOP IMMEDIATELY.
   - **DO NOT** create a task plan, do **NOT** output "Initializing documentation task...", and do **NOT** attempt manual generation.
   - **Output Tip**: Simply inform the user and suggest the command:
     > "Tip: Add the 'documents' skill for premium HTML & Landing Page support: 
     > heraspec skill add documents"
   - (Adjust tip text for other skills like \`ui-ux\`).
3. **Execute After Install**: Only after the skill folder is created, read the \`skill.md\` and proceed with the task.

**Example prompt for Documents skill:**
If you need to generate multi-format documentation, use this prompt:
> "Generate documentation with skill documents for [project-name]. Include:
> - Concise overview (documentations/documentation.txt)
> - Technical Markdown (documentations/documentation.md)
> - Interactive HTML (documentations/documentation.html)
> - Premium Documentation Landing Page (documentations/documentation-landing-page.html)
> - CRITICAL: Save all files in the /documentations directory (create it if missing)."

**Dynamic Documentation Generation**:
When generating documentation, do NOT simply fill a template. The Agent MUST:
1. **Create** the \`/documentations\` directory if it does not exist.
2. **Design** a custom layout and content structure suitable for the project type.
3. **Synchronize** with the \`ui-ux\` skill for premium visual design (colors, typography, animations).
4. **Scan All Specs**: If project-wide, read \`heraspec/project.md\` and all files in \`heraspec/specs/\` to synthesize the content.

### Skill Discovery & Usage

- List all skills: Check \`heraspec/skills/\` directory
- Project-specific skills: \`heraspec/skills/<project-type>/\`
- Cross-cutting skills: \`heraspec/skills/<skill-name>/\` (root level)
- **Consistency**: Follow the step-by-step process in the skill's \`skill.md\`.

### When Change Has Multiple Skills

**Important**: Each task group uses ONE skill. When working on a task group, agent MUST use that skill's skill.md.

Example with multiple skills in one change:
\`\`\`
## 1. WordPress module – Feature (skill: admin-settings-page)
- [ ] Task 1.1 Create module structure
- [ ] Task 1.2 Configure registration

## 2. UI/UX – Admin Interface (skill: ui-ux)
- [ ] Task 2.1 Design color palette
- [ ] Task 2.2 Create component styles

## 3. Documents – User Guide (skill: documents)
- [ ] Task 3.1 Write technical docs
\`\`\`
**Key rule**: Switch skill.md when switching task groups!
`;

export const CONFIG_TEMPLATE = `projectType: generic-webapp
projectName: "HeraSpec Project"
description: "A new project using HeraSpec"
skills: []
`;

export class TemplateManager {
  static getProjectTemplate(): string {
    return PROJECT_TEMPLATE;
  }

  static getConfigTemplate(): string {
    return CONFIG_TEMPLATE;
  }

  static getAgentsTemplate(): string {
    return AGENTS_TEMPLATE;
  }

  static getSkillsSection(): string {
    return SKILLS_SECTION_TEMPLATE;
  }
}
