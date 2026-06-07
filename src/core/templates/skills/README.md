# Skills Templates

This directory contains self-contained skill templates and resources for HeraSpec skills. Every skill is placed inside its own subdirectory to hold its `skill.md` and associated assets (templates, scripts, design knowledge, etc.).

## Directory Structure

```
skills/
├── <skill-name>/
│   ├── skill.md                 ← Skill guidelines (English)
│   ├── skill.vi.md              ← Skill guidelines (Vietnamese, optional)
│   ├── templates/               ← Skill-specific templates (optional)
│   ├── scripts/                 ← Skill-specific automation scripts (optional)
│   └── data/                    ← Skill-specific databases/assets (optional)
└── knowledge/                   ← HeRaSpec global knowledge base (pre-analyzed profiles)
```

## Available Skills

- **`ui-ux/`** - For UI/UX design and styling (includes search script, design databases, and prompt templates).
- **`design-system/`** - For designing according to specific popular design systems (references `knowledge/design-systems`).
- **`documents/`** - For technical and user documentation.
- **`content-optimization/`** - For content and CTA optimization.
- **`unit-test/`**, **`integration-test/`**, **`e2e-test/`** - Testing skills.
- **`sourcecode-analyzer/`** - Pre-analyzed codebase scanning.
- **`project-memory/`** - Memory-aware session summary and indexing.
- **`smart-explore/`** - Smart file/project exploration.
- **`deploy-documentation/`** - Automating deploy instructions.
- **`code-review/`**, **`debug/`**, **`system-design/`**, **`tech-debt/`**, **`spec-writer/`** - Standard coding lifecycle skills.
- **`seo-audit/`**, **`campaign-plan/`**, **`content-creation/`**, **`email-sequence/`**, **`sql-queries/`** - Marketing, SEO, and database planning skills.
- **`perfex-module/module-codebase/`** - Perfex CRM module codebase skill.
- **`wordpress/ux-element/`** - flatsome UX Builder element development.
- **`wordpress/plugin-standard/`** - WordPress plugin coding standards.
- **`wordpress/plugin-check/`** - WordPress Plugin Check tool running and fix guidelines.
- **`wordpress/plugin-directory/`** - WordPress.org Plugin Directory submission guideline checks.

## UI/UX & Design System Resources

- **`ui-ux/scripts/`**: `search.py` and `core.py` for searching the design databases.
- **`ui-ux/data/`**: CSV databases for Styles, Colors, Typography, Stacks, UX guidelines, etc.
- **`design-system/knowledge/design-systems/`**: Complete markdown design guidelines (`DESIGN.md`) for popular platforms like Stripe, Notion, Linear, Vercel, etc.
