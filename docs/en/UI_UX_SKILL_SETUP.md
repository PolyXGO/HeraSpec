# UI/UX Skill Setup Guide

## Overview

The UI/UX skill integrates with **UI/UX Builder** search engine (built upon [UI UX Pro Max Skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)) to provide design intelligence for building professional UI/UX. It includes:

- **57 UI Styles** - Glassmorphism, Claymorphism, Minimalism, Brutalism, etc.
- **95 Color Palettes** - Industry-specific palettes
- **56 Font Pairings** - Curated typography combinations
- **24 Chart Types** - Dashboard and analytics recommendations
- **9+ Page Types** - Home, About, Post Details, Category, Pricing, FAQ, Contact, Product Category, Product Details, and more
- **8 Tech Stacks** - React, Next.js, Vue, Svelte, SwiftUI, React Native, Flutter, HTML+Tailwind
- **98 UX Guidelines** - Best practices and anti-patterns

## Prerequisites

**Python 3.x is required:**

```bash
# Check if Python is installed
python3 --version || python --version

# macOS
brew install python3

# Ubuntu/Debian
sudo apt update && sudo apt install python3

# Windows
winget install Python.Python.3.12
```

## Setup UI/UX Skill

### Option 1: Using HeraSpec CLI (Recommended)

The easiest way to add UI/UX skill to your project:

```bash
heraspec skill add ui-ux
```

This command will:
- Copy the skill template, scripts, data, and templates to your project
- If the skill already exists, it will remove the old version and update with the latest
- Set up all necessary files and permissions

### Option 2: Manual Setup

If you prefer manual setup:

1. **Create skill folder structure:**
   ```bash
   mkdir -p heraspec/skills/ui-ux/{scripts,data,templates,examples}
   ```

2. **Copy skill.md:**
   ```bash
   cp HeraSpec/src/core/templates/skills/ui-ux-skill.md heraspec/skills/ui-ux/skill.md
   ```

3. **Copy scripts:**
   ```bash
   cp HeraSpec/src/core/templates/skills/scripts/*.py heraspec/skills/ui-ux/scripts/
   chmod +x heraspec/skills/ui-ux/scripts/search.py
   ```

4. **Copy data:**
   ```bash
   cp -r HeraSpec/src/core/templates/skills/data/* heraspec/skills/ui-ux/data/
   ```

5. **Copy templates:**
   ```bash
   cp -r HeraSpec/src/core/templates/skills/templates/*.md heraspec/skills/ui-ux/templates/
   ```

## Usage

### In Tasks

When creating tasks that require UI/UX work, use the `ui-ux` skill:

```markdown
## 1. Landing Page Design (skill: ui-ux)
- [ ] 1.1 Design hero section
- [ ] 1.2 Create color palette
- [ ] 1.3 Implement responsive layout
```

### Agent Workflow

When an agent encounters a task with `skill: ui-ux`, it will:

1. **Read skill.md** to understand the workflow
2. **Use search scripts** to find relevant design intelligence:
   ```bash
   # BM25 mode (default, fast, no dependencies)
   python3 heraspec/skills/ui-ux/scripts/search.py "beauty spa wellness" --domain product
   python3 heraspec/skills/ui-ux/scripts/search.py "elegant minimal" --domain style
   
   # Vector mode (semantic search, better results)
   python3 heraspec/skills/ui-ux/scripts/search.py "elegant dark theme" --domain style --mode vector
   
   # Hybrid mode (best results, combines BM25 + Vector)
   python3 heraspec/skills/ui-ux/scripts/search.py "modern minimal design" --domain style --mode hybrid
   
   # Search page types for multi-page websites
   python3 heraspec/skills/ui-ux/scripts/search.py "home homepage" --domain pages
   python3 heraspec/skills/ui-ux/scripts/search.py "pricing plans" --domain pages
   ```
3. **Synthesize results** to create a complete design system
4. **Implement** following the design system and best practices
5. **Verify** using the pre-delivery checklist

## Search Modes

UI/UX Builder supports three search modes:

### BM25 (Default)
- **Fast keyword-based search**
- **Zero dependencies** - works out of the box
- **Best for**: Exact keyword matches
- **Usage:**
  ```bash
  python3 heraspec/skills/ui-ux/scripts/search.py "minimalism" --domain style
  ```

### Vector (Semantic)
- **Semantic search** using sentence transformers
- **~15-20% better results** than BM25
- **Understands meaning and synonyms**
- **Requires**: `pip install sentence-transformers scikit-learn`
- **Usage:**
  ```bash
  python3 heraspec/skills/ui-ux/scripts/search.py "elegant dark theme" --domain style --mode vector
  ```

### Hybrid (Best)
- **Combines BM25 + Vector** for optimal results
- **~25% better results** than BM25 alone
- **Best of both worlds**: Keyword matching + semantic understanding
- **Requires**: `pip install sentence-transformers scikit-learn`
- **Usage:**
  ```bash
  python3 heraspec/skills/ui-ux/scripts/search.py "modern minimal design" --domain style --mode hybrid
  ```

**Note**: If Vector/Hybrid dependencies are not installed, the system automatically falls back to BM25 mode.

## Search Domains

| Domain | Use For | Example |
|--------|---------|---------|
| `product` | Product type recommendations | `--domain product` |
| `style` | UI styles, colors, effects | `--domain style` |
| `typography` | Font pairings, Google Fonts | `--domain typography` |
| `color` | Color palettes by product type | `--domain color` |
| `landing` | Page structure, CTA strategies | `--domain landing` |
| `pages` | Page types for multi-page websites | `--domain pages` |
| `chart` | Chart types, library recommendations | `--domain chart` |
| `ux` | Best practices, anti-patterns | `--domain ux` |
| `prompt` | AI prompts, CSS keywords | `--domain prompt` |

## Available Stacks

| Stack | Description |
|-------|-------------|
| `html-tailwind` | Tailwind utilities, responsive, a11y (DEFAULT) |
| `react` | State, hooks, performance, patterns |
| `nextjs` | SSR, routing, images, API routes |
| `vue` | Composition API, Pinia, Vue Router |
| `svelte` | Runes, stores, SvelteKit |
| `swiftui` | Views, State, Navigation, Animation |
| `react-native` | Components, Navigation, Lists |
| `flutter` | Widgets, State, Layout, Theming |

## Multi-Page Website Support

UI/UX Builder now supports creating complete multi-page website packages, not just landing pages.

### Default Page Set

When creating a "complete website package", the default set includes 9 pages:

1. **Home** - Main homepage
2. **About** - Company/story page
3. **Post Details** - Blog/article detail
4. **Category** - Blog/category listing
5. **Pricing** - Pricing plans
6. **FAQ** - Frequently asked questions
7. **Contact** - Contact form
8. **Product Category** - E-commerce category (if applicable)
9. **Product Details** - E-commerce product detail (if applicable)

### Searching Page Types

Use the `pages` domain to search for page type recommendations:

```bash
# Home page
python3 heraspec/skills/ui-ux/scripts/search.py "home homepage" --domain pages

# About page
python3 heraspec/skills/ui-ux/scripts/search.py "about company story" --domain pages

# Pricing page
python3 heraspec/skills/ui-ux/scripts/search.py "pricing plans tiers" --domain pages

# E-commerce pages
python3 heraspec/skills/ui-ux/scripts/search.py "product-category shop catalog" --domain pages
python3 heraspec/skills/ui-ux/scripts/search.py "product-detail single-product" --domain pages
```

### Prompt Templates for Multi-Page Websites

See detailed prompt templates in:
- `heraspec/skills/ui-ux/templates/example-prompt-full-theme.md` - Detailed prompt examples
- `heraspec/skills/ui-ux/templates/prompt-template-full-theme.md` - Copy-paste ready templates

**Basic Multi-Page Prompt Template:**

```
Create a complete website package for [PRODUCT_TYPE] with the following requirements:

**Project Information:**
- Product type: [SaaS / E-commerce / Service / Portfolio / etc.]
- Style: [minimal / elegant / modern / bold / etc.]
- Industry: [Healthcare / Fintech / Beauty / etc.]
- Stack: [html-tailwind / react / nextjs / etc.]
- Pages to create: home, about, [add other pages if needed]

**Process:**
1. Use skill ui-ux to search design intelligence with hybrid mode
2. Create shared components first (Header, Footer, Button, Card)
3. Implement pages in order
4. Ensure consistency in colors, typography, spacing
5. Verify with pre-delivery checklist

**Quality Requirements:**
- ✅ Consistent design system
- ✅ Responsive (320px, 768px, 1024px, 1440px)
- ✅ Accessible (WCAG AA minimum)
- ✅ Performance optimized
```

## Example Workflows

### Example 1: Single Landing Page

**User request:** "Create a landing page for professional skincare services"

**Agent workflow:**

```bash
# 1. Search product type
python3 heraspec/skills/ui-ux/scripts/search.py "beauty spa wellness service" --domain product

# 2. Search style (using hybrid mode for best results)
python3 heraspec/skills/ui-ux/scripts/search.py "elegant minimal soft" --domain style --mode hybrid

# 3. Search typography
python3 heraspec/skills/ui-ux/scripts/search.py "elegant luxury" --domain typography

# 4. Search color palette
python3 heraspec/skills/ui-ux/scripts/search.py "beauty spa wellness" --domain color

# 5. Search landing page structure
python3 heraspec/skills/ui-ux/scripts/search.py "hero-centric social-proof" --domain landing

# 6. Search UX guidelines
python3 heraspec/skills/ui-ux/scripts/search.py "animation" --domain ux
python3 heraspec/skills/ui-ux/scripts/search.py "accessibility" --domain ux

# 7. Search stack guidelines (default: html-tailwind)
python3 heraspec/skills/ui-ux/scripts/search.py "layout responsive" --stack html-tailwind
```

**Then:** Synthesize all search results and implement the design.

### Example 2: Multi-Page Website Package

**User request:** "Create a complete website package for an online fashion store"

**Agent workflow:**

```bash
# 1. Search product type
python3 heraspec/skills/ui-ux/scripts/search.py "e-commerce luxury fashion" --domain product

# 2. Search style (hybrid mode)
python3 heraspec/skills/ui-ux/scripts/search.py "elegant premium sophisticated" --domain style --mode hybrid

# 3. Search page types for each page
python3 heraspec/skills/ui-ux/scripts/search.py "home homepage" --domain pages
python3 heraspec/skills/ui-ux/scripts/search.py "product-category shop catalog" --domain pages
python3 heraspec/skills/ui-ux/scripts/search.py "product-detail single-product" --domain pages
python3 heraspec/skills/ui-ux/scripts/search.py "pricing plans tiers" --domain pages

# 4. Search typography and colors
python3 heraspec/skills/ui-ux/scripts/search.py "elegant luxury" --domain typography
python3 heraspec/skills/ui-ux/scripts/search.py "e-commerce luxury" --domain color

# 5. Search UX guidelines
python3 heraspec/skills/ui-ux/scripts/search.py "conversion optimization" --domain ux
```

**Then:** 
1. Create shared components (Header, Footer, Button, Card)
2. Implement each page following page type recommendations
3. Ensure consistency across all pages
4. Verify with pre-delivery checklist

## Verification

Before delivering UI code, verify using the pre-delivery checklist:

```bash
# Check checklist
cat heraspec/skills/ui-ux/templates/pre-delivery-checklist.md
```

Or use the checklist in `skill.md`.

## Troubleshooting

### Python not found

If you get `python3: command not found`:

```bash
# Check if Python is installed
which python3 || which python

# Install Python (see Prerequisites above)
```

### Script permission denied

```bash
chmod +x heraspec/skills/ui-ux/scripts/search.py
```

### Data files not found

Make sure you copied the `data/` folder:

```bash
ls heraspec/skills/ui-ux/data/
# Should show: charts.csv, colors.csv, landing.csv, products.csv, etc.
```

## Optional Dependencies for Vector/Hybrid Search

To use Vector or Hybrid search modes, install additional Python packages:

```bash
pip install sentence-transformers scikit-learn
```

**Note**: These are optional. BM25 mode works without any additional dependencies.

## See Also

- [SKILLS_SYSTEM.md](SKILLS_SYSTEM.md) - General skills system guide
- [SKILLS_STRUCTURE_PROPOSAL.md](SKILLS_STRUCTURE_PROPOSAL.md) - Skills structure details
- [UI UX Pro Max Skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) - Original project that UI/UX Builder is built upon

