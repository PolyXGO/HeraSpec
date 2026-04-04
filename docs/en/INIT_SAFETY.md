# HeraSpec Init - Safety Guide

## Overview

When running `heraspec init` on a previously initialized project, HeraSpec will be **SAFE** with existing data and will only **ADD** new features.

## Protected Data (NOT MODIFIED)

### ✅ Changes (Changes In Progress)
- **Location**: `heraspec/changes/`
- **Status**: **100% SAFE**
- **Behavior**: Only creates directory if it doesn't exist, does not delete or modify content

### ✅ Specs (Specifications)
- **Location**: `heraspec/specs/`
- **Status**: **100% SAFE**
- **Behavior**: Only creates directory if it doesn't exist, does not delete or modify content

### ✅ Archives
- **Location**: `heraspec/changes/archives/`
- **Status**: **100% SAFE**
- **Behavior**: Only creates directory if it doesn't exist, does not delete or modify content

### ✅ project.md
- **Location**: `heraspec/project.md`
- **Status**: **SAFE** (if already exists)
- **Behavior**: 
  - If file already exists: **DOES NOT overwrite**, keeps existing content
  - If file doesn't exist: Creates new file from template

### ✅ config.yaml
- **Location**: `heraspec/config.yaml`
- **Status**: **SAFE** (if already exists)
- **Behavior**:
  - If file already exists: **DOES NOT overwrite**, keeps existing content
  - If file doesn't exist: Creates new file from template

## Added Data (NEW ADDITIONS)

### ✅ Skills Directory
- **Location**: `heraspec/skills/`
- **Status**: **NEW** (only creates structure, doesn't copy skills)
- **Behavior**:
  - Creates `heraspec/skills/` directory if it doesn't exist
  - Creates `heraspec/skills/README.md` if it doesn't exist
  - **DOES NOT automatically copy** skills from HeraSpec core into project
  - **DOES NOT delete** existing skills (if you've created/copied them before)
- **Note**: Skills need to be **created manually** or **copied from templates** in HeraSpec core (`src/core/templates/skills/`) into the project when needed. See [SKILLS_SYSTEM.md](SKILLS_SYSTEM.md) for how to add skills.

### ✅ AGENTS.heraspec.md (Merge, not overwrite)
- **Location**: `AGENTS.heraspec.md` (project root)
- **Status**: **SMART MERGE**
- **Behavior**: 
  - **New project**: Creates new file with full template
  - **Existing project**: 
    - Keeps all existing content intact
    - If "## Skills System" section doesn't exist: **Adds new** before "## Rules" section
    - If "## Skills System" section already exists: **Updates** that section with latest content
    - **DOES NOT delete** your other customizations
- **Reason**: Ensures AI agents have the latest Skills system instructions while preserving customizations

## Summary

| Item | Status | Behavior |
|------|--------|----------|
| `heraspec/changes/` | ✅ Safe | Only creates directory, doesn't delete/modify |
| `heraspec/specs/` | ✅ Safe | Only creates directory, doesn't delete/modify |
| `heraspec/changes/archives/` | ✅ Safe | Only creates directory, doesn't delete/modify |
| `heraspec/project.md` | ✅ Safe | Doesn't overwrite if already exists |
| `heraspec/config.yaml` | ✅ Safe | Doesn't overwrite if already exists |
| `heraspec/skills/` | ✅ New | Creates directory and README if doesn't exist |
| `AGENTS.heraspec.md` | ✅ Smart merge | **Adds/updates** Skills section, keeps rest intact |

## Recommendations

### Before Running `heraspec init`:

1. **Backup (optional, but recommended)**:
   ```bash
   cp AGENTS.heraspec.md AGENTS.heraspec.md.backup
   ```

2. **Check git status** (if using git):
   ```bash
   git status
   git add -A
   git commit -m "Backup before heraspec init update"
   ```

**Note**: With the new merge logic, you don't need to backup because content will be kept intact, only the Skills section will be added/updated.

### After Running `heraspec init`:

1. **Check AGENTS.heraspec.md**:
   - See if "## Skills System" section has been added/updated
   - Confirm other customizations are still intact
   - If there are issues, you can restore from backup

2. **Check skills folder**:
   ```bash
   ls -la heraspec/skills/
   # Should see README.md
   ```

3. **Verify data**:
   ```bash
   heraspec list              # Check changes
   heraspec list --specs      # Check specs
   ```

## Examples

### Scenario 1: New Project
```bash
heraspec init
# → Creates all new structure
# → Creates project.md, config.yaml, AGENTS.heraspec.md
# → Creates skills/ directory
```

### Scenario 2: Project with existing changes and specs
```bash
heraspec init
# → Keeps heraspec/changes/ intact (changes in progress)
# → Keeps heraspec/specs/ intact (existing specs)
# → Keeps heraspec/project.md intact (if exists)
# → Adds heraspec/skills/ directory
# → Updates AGENTS.heraspec.md with new instructions
```

### Scenario 3: Project with existing skills folder
```bash
heraspec init
# → Keeps heraspec/skills/ intact (existing skills)
# → Only creates README.md if it doesn't exist
# → Updates AGENTS.heraspec.md
```

## Conclusion

**✅ SAFE**: All project data (changes, specs, archives, project.md, config.yaml) is protected.

**✅ ADDITIONS**: Skills system is added without affecting existing data.

**✅ SMART MERGE**: `AGENTS.heraspec.md` is intelligently merged:
- Keeps all existing content intact
- Only adds/updates "## Skills System" section
- Doesn't delete your customizations

**📝 NOTE ABOUT SKILLS**:
- `heraspec init` only creates the `heraspec/skills/` directory and `README.md`
- Skills are **NOT automatically copied** into the project
- You need to **create or copy** skills into `heraspec/skills/` when needed
- Skill templates are available in HeraSpec core but need to be copied manually
- See [SKILLS_SYSTEM.md](SKILLS_SYSTEM.md) for how to add skills to the project
