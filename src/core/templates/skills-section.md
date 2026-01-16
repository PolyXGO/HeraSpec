## Skills System

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

