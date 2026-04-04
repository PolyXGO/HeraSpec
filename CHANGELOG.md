# HeraSpec Changelog

## [0.1.12] - 2026-01-30

### Added

#### New Skills

- **`plugin-directory` skill** - Review WordPress plugins against all 18 WordPress.org Plugin Directory Guidelines before submission
  - Generates comprehensive compliance report
  - Marks ✅ passed, ⚠️ needs review, ❌ violations
  - Requires user confirmation before making changes
  - Install: `heraspec skill add plugin-directory --project-type wordpress-plugin`

### Updated

#### Documentation
- Updated `docs/en/USER_GUIDE.md` with WordPress Plugin Skills section
- Updated `docs/en/SKILLS_SYSTEM.md` with plugin-check and plugin-directory skills
- Updated `docs/en/PROJECT_TYPES_AND_SKILLS.md` with new skills
- Updated `docs/vi/` Vietnamese documentation
- Updated `src/core/templates/skills-section.md` with plugin-directory special case
- Updated `src/core/templates/skills/README.md` with new skills

#### Configuration
- Added `plugin-check` and `plugin-directory` to `wordpress-plugin` PROJECT_TYPES in `config.ts`
- Added `wordpress-plugin:plugin-check` and `wordpress-plugin:plugin-directory` mappings to `skills-template-map.ts`

### Migration Guide

If you have an existing HeraSpec project and want to use the new `plugin-directory` skill:

1. **Update HeraSpec CLI:**
   ```bash
   cd /path/to/HeraSpec
   git pull
   npm install
   npm run build
   npm link
   ```

2. **Add skill to your project:**
   ```bash
   cd /path/to/your-wordpress-plugin
   heraspec skill add plugin-directory --project-type wordpress-plugin
   ```

3. **Update existing skills:**
   ```bash
   heraspec skill update plugin-directory --project-type wordpress-plugin
   ```

4. **Update AGENTS.heraspec.md (optional):**
   ```bash
   heraspec init  # This updates AGENTS.heraspec.md with latest template
   ```

---

## [0.1.11] and earlier

See previous versions for older changelog entries.
