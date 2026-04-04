# HeraSpec Update Checklist

This document serves as a reminder for developers when updating HeraSpec source code. When adding new features, commands, or capabilities, ensure all documentation and helper guides are updated accordingly.

## When Adding New CLI Commands

### ✅ Required Updates

1. **Helper Command** (`src/commands/helper.ts`):
   - [ ] Add command to `showCommands()` method
   - [ ] Add example prompts in `showExamplePrompts()` if applicable
   - [ ] Add workflow step in `showWorkflow()` if it's part of main workflow
   - [ ] Add tips in `showTips()` if there are best practices

2. **User Guide** (`docs/vi/HUONG_DAN_SU_DUNG.md` for Vietnamese, English guide coming soon):
   - [ ] Add command to CLI commands section
   - [ ] Add usage examples
   - [ ] Add to workflow section if applicable
   - [ ] Add any important notes or limitations

3. **README** (`README.md`):
   - [ ] Update CLI Commands section
   - [ ] Add to feature list if significant

4. **Build Process** (`build.js`):
   - [ ] Ensure new templates/resources are copied to `dist/` if needed
   - [ ] Verify command works after build

### 📝 Example: Adding `heraspec make test`

**Helper Updates:**
- Added to commands list
- Added example prompts section
- Added workflow step
- Added tips about test types

**Docs Updates:**
- Added to CLI commands section
- Added usage examples
- Added workflow integration

## When Adding New Skills

### ✅ Required Updates

1. **Skills Template Map** (`src/core/templates/skills-template-map.ts`):
   - [ ] Add skill to `SKILL_TEMPLATE_MAP`
   - [ ] Specify if cross-cutting or project-specific
   - [ ] Include resource directories if needed

2. **Skill Template File** (`src/core/templates/skills/<skill-name>-skill.md`):
   - [ ] Create skill.md template
   - [ ] Include all required sections (Purpose, When to Use, Steps, etc.)
   - [ ] Add templates/scripts/examples if applicable

3. **Build Process** (`build.js`):
   - [ ] Ensure skill templates are copied to `dist/core/templates/skills/`
   - [ ] Verify `heraspec skill add <skill-name>` works

4. **Documentation**:
   - [ ] Update `docs/SKILLS_SYSTEM.md` if skill structure changes
   - [ ] Add skill to examples in user guide if significant

### 📝 Example: Adding Test Skills

**Template Map Updates:**
- Added `unit-test`, `integration-test`, `e2e-test` to map
- Marked as cross-cutting skills

**Template Files:**
- Created `unit-test-skill.md`
- Created `integration-test-skill.md`
- Created `e2e-test-skill.md`

**Build:**
- Templates automatically copied via existing build process

## When Modifying Core Functionality

### ✅ Required Updates

1. **Breaking Changes**:
   - [ ] Update version in `package.json`
   - [ ] Add migration guide if needed
   - [ ] Update `docs/INIT_SAFETY.md` if init behavior changes

2. **New Dependencies**:
   - [ ] Add to `package.json` dependencies or devDependencies
   - [ ] Update `docs/DEVELOPMENT_SETUP.md` if needed
   - [ ] Document in README if user-facing

3. **Configuration Changes**:
   - [ ] Update `src/core/config.ts` if adding constants
   - [ ] Update templates if config structure changes
   - [ ] Document in user guide

## Checklist Template

When adding a new feature, use this checklist:

```
## Feature: [Feature Name]

### Code Changes
- [ ] Core implementation
- [ ] CLI command (if applicable)
- [ ] Tests (if applicable)

### Documentation
- [ ] Helper command updated
- [ ] User guide updated
- [ ] README updated (if significant)
- [ ] API docs updated (if applicable)

### Integration
- [ ] Build process verified
- [ ] Templates copied (if applicable)
- [ ] Skills registered (if applicable)

### Testing
- [ ] Manual testing completed
- [ ] Works after `npm run build`
- [ ] Works with `npm link`
```

## Important Notes

1. **Always update helper first**: The helper command is the first point of reference for users
2. **Keep docs in sync**: User guide should reflect all CLI capabilities
3. **Test after build**: Always verify features work after building
4. **Update examples**: If adding new commands, add examples to helper and docs
5. **Consider backward compatibility**: Document breaking changes clearly

## Recent Updates

### Test Skills & Commands (2026-01-03)
- ✅ Added unit-test, integration-test, e2e-test skills
- ✅ Added `heraspec make test` command
- ✅ Added `heraspec suggest` command
- ✅ Updated helper command
- ✅ Updated user guide

### Documentation Generation (2026-01-03)
- ✅ Added `heraspec make docs` command
- ✅ Added `--agent` option
- ✅ Updated helper command
- ✅ Updated user guide

