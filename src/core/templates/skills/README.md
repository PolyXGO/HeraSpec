# Skills Templates

This directory contains skill.md templates and resources for HeraSpec skills.

## Available Skills

- `module-codebase-skill.md` - For Perfex module codebase structure
- `ui-ux-skill.md` - For UI/UX design and styling (with UI/UX Builder integration)
- `documents-skill.md` - For technical and user documentation
- `content-optimization-skill.md` - For content and CTA optimization

## UI/UX Skill Resources

The `ui-ux-skill.md` includes integration with UI/UX Builder (built upon [UI UX Pro Max Skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)):

- **Scripts**: `scripts/search.py` and `scripts/core.py` for searching design database
- **Search Modes**: 
  - **BM25** (default) - Fast keyword-based search, zero dependencies
  - **Vector** - Semantic search with ~15-20% better results (requires: `pip install sentence-transformers scikit-learn`)
  - **Hybrid** - Best of both worlds with ~25% better results (requires: `pip install sentence-transformers scikit-learn`)
- **Data**: `data/` folder contains CSV databases for:
  - Styles (57 UI styles)
  - Colors (95 color palettes)
  - Typography (56 font pairings)
  - Charts (24 chart types)
  - Products (product recommendations)
  - Pages (9+ page types for multi-page websites)
  - Landing pages (page structures)
  - UX guidelines (98 best practices)
  - Stacks (8 tech stack guidelines)

## Usage

When creating a new skill, copy the appropriate template and customize it for your specific skill.

For UI/UX tasks, agents will automatically use the search scripts to find relevant design intelligence before implementing.
