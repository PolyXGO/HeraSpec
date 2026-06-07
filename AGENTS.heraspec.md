# HeraSpec — AI Agent Instructions

This document defines the workflow for AI agents working with HeraSpec.

## Universal Safety Rules

- **NO AUTO-COMMIT**: Agent MUST NOT perform `git commit` or `git push` autonomously. This task is reserved for the User unless explicitly ordered.
- **NO AUTO-PUBLISH**: Agent MUST NOT perform `npm publish` or trigger automated releases/deployments autonomously.
- **SKILL PREREQUISITE**: If a task maps to a skill (e.g., "Generate documentation"), you **MUST** verify the skill folder exists in `heraspec/skills/`. If missing:
  - **Preferred**: Proactively install it via `heraspec skill add <name>` (e.g., `heraspec skill add documents`) if you have terminal access.
  - **Fallback**: If you cannot install it, **STOP** and ask the user to add it. **DO NOT** attempt manual generation without the skill.
- **IGNORE VIETNAMESE SKILL FILES**: When reading and executing skill workflows, you **MUST ONLY** look at the English version of the skill instructions (e.g., `skill.md`). You **MUST completely ignore** all Vietnamese versions (e.g., `skill.vi.md` or files ending with `*.vi.md`). These Vietnamese files are for reference/development purposes by the user only.
- **USER CONFIRMATION**: For destructive actions or public releases, always request explicit User approval first.

### Restricted Commands (REQUIRE USER CONFIRMATION)

The following commands are classified by risk level. You **MUST NOT** execute them without explicit user confirmation/approval in the chat, especially if they are outside the source workspace or involve deletion.

#### GROUP 1 – EXTREMELY DANGEROUS (DATA DESTRUCTION, HARD / IMPOSSIBLE TO RECOVER)
- `rm -rf` : Recursive delete + no prompt, can wipe entire system
- `rm -r` : Delete directory and all contents
- `rm` : Delete file directly, bypassing trash
- `unlink` : Delete file at filesystem level, cannot undo
- `shred` : Overwrite data multiple times to make it unrecoverable
- `wipe` : Permanently wipe data on disk
- `dd` : Write/copy raw blocks, easily destroy disk or partition
- `mkfs`, `mkfs.ext4`, `mkfs.xfs` : Create new filesystem, wiping old data
- `format`, `Format-Volume` : Format drive/volume

#### GROUP 2 – HIGH DANGER (DELETE DIRECTORY / MULTIPLE FILES)
- `rmdir` : Delete directory
- `rd`, `rmdir /s` : Windows delete directory
- `Remove-Item -Recurse`, `Remove-Item` : PowerShell delete
- `del /s`, `erase /s` : CMD batch delete

#### GROUP 3 – MEDIUM DANGER (DELETE FILE / OVERWRITE)
- `del`, `erase` : Delete file
- `Clear-Content` : Clear file content
- `cp --remove-destination` : Overwrite destination by deleting first

#### GROUP 4 – INDIRECT DANGER (DATA LOSS)
- `mv` : Move / overwrite file, old data lost
- `rsync --delete` : Delete file at destination if not in source
- `install` : Overwrite system files

#### GROUP 5 – DISK / PARTITION MANAGEMENT
- `fdisk`, `cfdisk`, `parted`, `diskpart` : Partition management
- `mount`, `umount` : Filesystem mounting

#### GROUP 6 – LESS DANGEROUS (POTENTIAL CONSEQUENCES)
- `truncate` : Cutt off file content
- `chown`, `chmod` : Change ownership/permissions
- `attrib` : Change attributes

## Core Workflow

### Step 1 — Create a Change

**When creating changes, ALWAYS read heraspec/project.md first to understand:**
- Project types being used
- Tech stack and conventions
- Existing architecture patterns
- Coding standards

> **IGNORE backup files**: Files like \`project.back1.md\`, \`project.back2.md\`, etc. are automatic backups created during \`heraspec init\` updates. NEVER read or reference them unless explicitly asked by the user. Only \`project.md\` is the source of truth.

**Then scaffold:**
- `heraspec/changes/<slug>/` - Create proposal.md, tasks.md, design.md (optional)
- `heraspec/specs/<slug>/` - Create delta specs here (NOT inside changes folder)

**If user asks to create changes based on project.md:**
1. Read `heraspec/project.md` thoroughly
2. Identify all features/capabilities mentioned
3. Create separate changes for each major feature
4. Ensure each change follows project.md conventions
5. Use correct project types and skills from project.md

### Step 2 — Refine Specs
- Update delta specs in `heraspec/specs/<slug>/`
- Never modify source-of-truth specs directly

### Step 3 — Approval
- Wait for user: "Specs approved."

### Step 4 — Implementation

**CRITICAL: When implementing tasks, ALWAYS use Skills system:**

1. **Read task line** to identify skill:
   ```markdown
   ## 1. Perfex module – Category Management (projectType: perfex-module, skill: module-codebase)
   - [ ] 1.1 Create module structure
   ```

2. **Find skill folder**:
   - Project-specific: `heraspec/skills/<project-type>/<skill-name>/`
   - Cross-cutting: `heraspec/skills/<skill-name>/`

3. **Read skill.md**:
   - Understand purpose, steps, inputs, outputs
   - Follow tone, rules, and limitations
   - Check available templates and scripts
   - **Ignore Vietnamese Skill Files**: Only read the English `skill.md` instructions. Completely ignore any `*.vi.md` translation files.

4. **Use skill resources**:
   - Run scripts from `scripts/` folder if needed
   - Use templates from `templates/` folder
   - Reference examples from `examples/` folder

5. **Implement following skill.md guidance**:
   - Follow step-by-step process
   - Use correct naming conventions
   - Apply code style rules
   - Respect limitations

**Example workflow:**
- Task: `(projectType: perfex-module, skill: module-codebase)`
- Agent reads: `heraspec/skills/perfex-module/module-codebase/skill.md`
- Agent follows: Steps, uses templates, runs scripts
- Agent implements: According to skill.md guidelines

**Special case - UI/UX skill:**
- Task: `(skill: ui-ux)`
- Agent reads: `heraspec/skills/ui-ux/skill.md`
- Agent MUST use search scripts before implementing:
   ```bash
   # Search for design intelligence
   python3 heraspec/skills/ui-ux/scripts/search.py "<keyword>" --domain <domain>
   python3 heraspec/skills/ui-ux/scripts/search.py "<keyword>" --stack <stack>
   ```
- Agent synthesizes search results
- Agent implements with proper colors, fonts, styles from search results
- Agent verifies with pre-delivery checklist

**Special case - Flatsome UX Element skill:**
- Task: `(projectType: wordpress, skill: ux-element)`
- Agent reads: `heraspec/skills/wordpress/ux-element/skill.md`
- Agent MUST follow the **Wrapping Rule**: Use `<span>` with `id="{{:: shortcode.$id }}"`
- Agent uses templates from `heraspec/skills/wordpress/ux-element/templates/` (Controller, Shortcode, HTML Template, SVG Thumbnail)
- Agent ensures real-time preview support in AngularJS template.
- **Variable Translation**: Variables with underscores in PHP (e.g., `bg_color`) MUST be accessed via camelCase in AngularJS (e.g., `shortcode.options.bgColor`).

**Special case - Plugin Check skill:**
- Task: `(projectType: wordpress-plugin, skill: plugin-check)`
- Install: `heraspec skill add plugin-check --project-type wordpress-plugin`
- Agent reads: `heraspec/skills/wordpress-plugin/plugin-check/skill.md`
- Agent runs WordPress Plugin Check (PCP) tool
- Agent fixes coding standard issues iteratively until all pass

**Special case - Plugin Directory skill:**
- Task: `(projectType: wordpress-plugin, skill: plugin-directory)`
- Install: `heraspec skill add plugin-directory --project-type wordpress-plugin`
- Agent reads: `heraspec/skills/wordpress-plugin/plugin-directory/skill.md`
- Agent MUST review plugin against **18 WordPress.org Directory Guidelines**:
  1. GPL Compatibility
  2. Developer Responsibility
  3. Stable Version Availability
  4. Human Readable Code
  5. No Trialware
  6. Software as a Service
  7. User Tracking Consent
  8. No External Executable Code
  9. Legal and Ethical Conduct
  10. External Links and Credits
  11. Admin Dashboard Experience
  12. No Spam in Public Pages
  13. WordPress Default Libraries
  14. Commit Frequency
  15. Version Number Increment
  16. Complete Plugin Required
  17. Trademark and Copyright
  18. Directory Maintenance Rights
- Agent generates a **Compliance Report** with:
  - ✅ Passed items
  - ⚠️ Items needing review  
  - ❌ Violations with file paths and line numbers
- **CRITICAL**: Agent MUST present full report and **wait for user confirmation** before making changes
- Reference guideline numbers (e.g., "Guideline 7: User Tracking Consent")


- Follow tasks.md
- Mark tasks completed: `- [x]`

### Step 5 — Archive
- Run: `heraspec archive <slug> --yes`
- This merges delta specs into source specs
- Moves change folder to archives

#### Handling Parallel Merge Conflicts
If `heraspec archive` throws a **Parallel Merge Conflict** error:
1. It means someone else modified the base requirement in the source spec while you were working.
2. **DO NOT PANIC** and **DO NOT OVERWRITE** manually.
3. Run: `heraspec sync <slug>`
4. The system will automatically update your fingerprint to match the new source spec and warn you.
5. Review your delta spec again. Make sure your `MODIFIED/REMOVED` requirements still make sense given the new source.
6. Once verified, run `heraspec archive <slug> --yes` again.

## Spec Format

Specs must include:
- `## Meta` section with project type, domain, stack
- `## Purpose`
- `## Requirements` with scenarios

## Delta Spec Format

Delta specs use:
- `## ADDED Requirements`
- `## MODIFIED Requirements`
- `## REMOVED Requirements`

## Tasks Format

Tasks grouped by project type and skill:
```
## 1. WordPress plugin – admin settings page (projectType: wordpress-plugin, skill: admin-settings-page)
- [ ] Task description
```

## Skills System

**CRITICAL: Mandatory Prerequisite Check**

1. **Stop & Verify**: If you are asked to implement a task requiring a skill (e.g., "Generate documentation...", "Create UI/UX...", etc.), you MUST first check if the skill folder exists in `heraspec/skills/`.
2. **Missing Skill = AUTO-INSTALL OR STOP**: If the skill folder does NOT exist:
   - **Option A (Preferred)**: If you can run commands, execute `heraspec skill add <skill-name>` immediately.
   - **Option B (Fallback)**: If you cannot run commands, **STOP** and ask the user to run it.
     > "Tip: Add the 'documents' skill for premium HTML & Landing Page support: 
     > heraspec skill add documents"
   - **DO NOT** create a task plan or attempt manual generation without the skill language.
3. **Execute After Install**: Only after the skill folder is created (or installed), read the `skill.md` and proceed with the task.
4. **Ignore Vietnamese Skill Files**: You MUST only read the English `skill.md` file inside the skill folder. Completely ignore all `*.vi.md` files (e.g., `skill.vi.md`), as they are strictly for reference purposes by human developers.

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
1. **Create** the `/documentations` directory if it does not exist.
2. **Design** a custom layout and content structure suitable for the project type.
3. **Synchronize** with the `ui-ux` skill for premium visual design (colors, typography, animations).
4. **Scan All Specs**: If project-wide, read `heraspec/project.md` and all files in `heraspec/specs/` to synthesize the content.

### Skill Discovery & Usage

- List all skills: Check `heraspec/skills/` directory
- Project-specific skills: `heraspec/skills/<project-type>/`
- Cross-cutting skills: `heraspec/skills/<skill-name>/` (root level)
- **Consistency**: Follow the step-by-step process in the skill's `skill.md`.

### When Change Has Multiple Skills

**Important**: Each task group uses ONE skill. When working on a task group, agent MUST use that skill's skill.md.

Example with multiple skills in one change:
```
## 1. WordPress module – Feature (skill: admin-settings-page)
- [ ] Task 1.1 Create module structure
- [ ] Task 1.2 Configure registration

## 2. UI/UX – Admin Interface (skill: ui-ux)
- [ ] Task 2.1 Design color palette
- [ ] Task 2.2 Create component styles

## 3. Documents – User Guide (skill: documents)
- [ ] Task 3.1 Write technical docs
```

**Key rule**: Switch skill.md when switching task groups!

## Proactive Memory-Aware Development

If \`heraspec/skills/project-memory/\` exists, the agent MUST proactively use memory to maintain project context. DO NOT wait for the user to prompt you to use memory.

### CRITICAL RULES FOR AUTOMATIC MEMORY USAGE
1. **Always Check Context First**: At the beginning of a complex task or when encountering an unfamiliar codebase area, you MUST autonomously run \`heraspec memory context\` or \`heraspec memory search "keywords"\` BEFORE writing any code.
2. **Auto-Log via Archive**: You DO NOT need to run \`heraspec memory log\` manually. Every time you successfully implement a feature and run \`heraspec archive <change-name>\`, the system will automatically read your proposal and log the memory observation under the hood. Just use \`heraspec archive\` as normal!
3. **Session Summary**: (Optional) When wrapping up a large session, you can run \`heraspec memory summarize --request "..." --completed "..."\` to compress knowledge, though \`archive\` already auto-logs completed features.

### When to SKIP Memory
- Simple bug fixes, typo corrections, formatting changes
- Trivial tasks that take < 5 minutes
- When doing what the agent's built-in context already covers

### Smart Code Exploration
If \`heraspec/skills/smart-explore/\` exists, prefer token-efficient exploration:
- \`heraspec explore outline <file>\` → View structure (~1K tokens vs ~12K full file)
- \`heraspec explore search "<query>" <path>\` → Find symbols across codebase
- \`heraspec explore unfold <file> <symbol>\` → Read just one function

