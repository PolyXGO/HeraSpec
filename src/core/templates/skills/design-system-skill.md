# Skill: Design System Reference (Cross-Cutting)

## Purpose

This skill provides access to **54 real-world design systems** extracted from production websites (Stripe, Vercel, Linear, Supabase, Apple, etc.) in the Google Stitch DESIGN.md format. Each design system contains detailed color palettes, typography rules, component stylings, shadow systems, and agent-ready prompts.

Use this skill to create UIs that match the look and feel of specific well-known brands, or to find design inspiration from real-world references.

## When to Use

- When user requests UI "like Stripe" / "inspired by Vercel" / "Linear-style"
- When building a product in a specific industry (fintech, devtools, AI) and need proven design patterns
- When you need precise color values, font weights, shadow values from real design systems
- When creating a DESIGN.md for a new project
- When comparing design approaches (e.g., Stripe vs Vercel shadow philosophies)

## Prerequisites

None — this skill uses the same search engine as UI/UX skill.

## Step-by-Step Process

### Step 1: Identify the Design Reference

Determine which design system(s) are relevant:

**By brand name:**
```bash
python3 scripts/search.py "stripe" --domain design-system
python3 scripts/search.py "linear dark mode" --domain design-system  
python3 scripts/search.py "vercel minimal" --domain design-system
```

**By style/industry:**
```bash
python3 scripts/search.py "fintech premium dark" --domain design-system
python3 scripts/search.py "developer tools dark emerald" --domain design-system
python3 scripts/search.py "ai platform warm editorial" --domain design-system
python3 scripts/search.py "enterprise blue structured" --domain design-system
```

**By visual technique:**
```bash
python3 scripts/search.py "shadow-as-border" --domain design-system
python3 scripts/search.py "neon glow dark" --domain design-system
python3 scripts/search.py "blue-tinted shadows" --domain design-system
python3 scripts/search.py "luminance stacking" --domain design-system
```

### Step 2: Read the Full DESIGN.md

After finding a matching brand, read the complete DESIGN.md from knowledge base:

```
knowledge/design-systems/<folder>/DESIGN.md
```

The `Folder` field in search results tells you the directory name. For example:
- Stripe → `knowledge/design-systems/stripe/DESIGN.md`
- Linear → `knowledge/design-systems/linear.app/DESIGN.md`
- Supabase → `knowledge/design-systems/supabase/DESIGN.md`

### Step 3: Apply the Design System

Use the `Agent_Quick_Prompt` from search results as a starting point, then reference the full DESIGN.md for details:

1. **Colors**: Apply exact hex values from Color Palette section
2. **Typography**: Use specified fonts, weights, and letter-spacing
3. **Components**: Follow button, card, input, navigation specifications
4. **Shadows**: Use exact shadow values (this is often what makes a design "feel" right)
5. **Spacing**: Follow the spacing scale and border-radius values
6. **Do's/Don'ts**: Respect the design system's guardrails

### Step 4: Combine with UI/UX Skill

For maximum quality, combine design-system references with other UI/UX skill searches:

```bash
# 1. Get the design system reference
python3 scripts/search.py "stripe" --domain design-system

# 2. Get UX guidelines
python3 scripts/search.py "animation" --domain ux
python3 scripts/search.py "accessibility" --domain ux

# 3. Get page structure
python3 scripts/search.py "pricing plans" --domain pages

# 4. Get stack-specific guidelines
python3 scripts/search.py "responsive layout" --stack html-tailwind
```

## Available Design Systems

### By Category

| Category | Count | Examples |
|----------|-------|---------|
| **AI & ML** | 12 | Claude, Mistral AI, Ollama, Cursor, xAI, ElevenLabs |
| **Developer Tools** | 14 | Vercel, Linear, Supabase, Raycast, Warp, Sentry |
| **Infrastructure** | 6 | Stripe, MongoDB, HashiCorp, ClickHouse, Sanity |
| **Design & Productivity** | 10 | Notion, Figma, Framer, Miro, Airtable, Pinterest |
| **Fintech & Crypto** | 4 | Coinbase, Revolut, Wise, Kraken |
| **Enterprise & Consumer** | 8 | Apple, Airbnb, Spotify, BMW, SpaceX, Uber, IBM |

### By Theme

| Theme | Brands |
|-------|--------|
| **Dark-mode native** | Linear, Supabase, Cursor, Spotify, SpaceX, Warp, Resend |
| **Light-first** | Stripe, Vercel, Notion, Apple, Mintlify, Ollama |
| **Both modes** | IBM, Uber, Framer, Lovable, Cohere, Together AI |

### By Design Philosophy

| Philosophy | Brand | Key Technique |
|------------|-------|---------------|
| Weight-as-luxury | Stripe | font-weight: 300 for elegance |
| Shadow-as-border | Vercel | box-shadow: 0px 0px 0px 1px rgba() |
| Luminance stacking | Linear | Background opacity stepping for depth |
| Warm editorial | Claude | Terracotta accent, anti-tech-cold palette |
| Terminal-native | Resend, Warp | Monospace accents, dark void backgrounds |
| Full-bleed imagery | SpaceX | Text over cinematic photos |

## Search Reference

```bash
# Search by brand
python3 scripts/search.py "<brand-name>" --domain design-system

# Search by keywords
python3 scripts/search.py "<style-keywords>" --domain design-system

# Search with semantic mode
python3 scripts/search.py "elegant dark developer tool" --domain design-system --mode hybrid

# Multiple results
python3 scripts/search.py "fintech" --domain design-system -n 5
```

## DESIGN.md Format (Google Stitch Standard)

Each DESIGN.md file contains 9 standard sections:

1. **Visual Theme & Atmosphere** — Design philosophy, mood, density
2. **Color Palette & Roles** — Hex values with semantic roles
3. **Typography Rules** — Font families, full type scale table
4. **Component Stylings** — Buttons, cards, inputs with states
5. **Layout Principles** — Spacing scale, grid, whitespace
6. **Depth & Elevation** — Shadow system, surface hierarchy
7. **Do's and Don'ts** — Design guardrails, anti-patterns
8. **Responsive Behavior** — Breakpoints, touch targets
9. **Agent Prompt Guide** — Quick reference prompts for AI agents

## Updating Design Systems

Design system files are sourced from [awesome-design-md](https://github.com/VoltAgent/awesome-design-md). To update:

1. Pull latest from `awesome-design-md` repository
2. Copy updated `DESIGN.md` files to `knowledge/design-systems/<folder>/`
3. Update `design-systems.csv` in `data/` if new brands are added
4. Update `index.json` in `knowledge/design-systems/` with new entries

## Tips for Best Results

1. **Be specific** — "dark mode with purple accents" is better than "dark"
2. **Reference real brands** — "like Stripe" gives much better results than "fintech"
3. **Read the full DESIGN.md** — The CSV gives a summary, but the DESIGN.md has full specs
4. **Combine skills** — Design-system + UI/UX + Stack = production-quality output
5. **Use Agent_Quick_Prompt** — Each entry has a ready-to-use prompt in the CSV

## Links to Other Skills

- **ui-ux**: Use together for comprehensive design system + UX guidelines
- **documents**: Use to document your project's design system
- **content-optimization**: Use to optimize CTA placement with brand colors
