# Design System Skill Guide

## Overview

The `design-system` skill is a powerful extension to HeraSpec's UI/UX capabilities. It integrates **54 real-world design systems** from top technology brands (Stripe, Vercel, Apple, Supabase, Linear, etc.) extracted from production websites using the Google Stitch `DESIGN.md` format.

While the `ui-ux` skill gives you generic recommendations (e.g., "minimalist", "glassmorphism"), the `design-system` skill provides **pixel-perfect brand intelligence** (e.g., the exact hex codes, border radii, and "blue-tinted shadows" that make Stripe look like Stripe).

## Quick Start

### 1. Add the skill to your project
```bash
heraspec skill add design-system
```

### 2. Search for a brand reference
Use the search engine to find a design system that matches your needs:
```bash
# Search by exact brand
python3 heraspec/skills/ui-ux/scripts/search.py "stripe" --domain design-system

# Search by category or style
python3 heraspec/skills/ui-ux/scripts/search.py "dark developer tools" --domain design-system
python3 heraspec/skills/ui-ux/scripts/search.py "fintech premium shadow" --domain design-system
```

### 3. Read the Reference DESIGN.md
The search result will give you a quick summary and an `Agent_Quick_Prompt`. To get the full context (including color palette, typography rules, layout principles, and shadows), read the original `DESIGN.md` located in the knowledge base:
```
heraspec/skills/design-system/knowledge/design-systems/<folder>/DESIGN.md
```

## Agent Workflow

When asking an AI agent (like Cursor or Claude) to build a UI, reference the design system explicitly:

**Good Prompt:**
> "Create a pricing page. `(skill: design-system)` Search for 'Vercel' to use their shadow-as-border philosophy, typography (Geist), and monochrome palette. Then implement the HTML/Tailwind code."

**The agent will:**
1. Check the `design-system` skill workflow.
2. Query the search engine for "Vercel" in the `design-system` domain.
3. Locate the `vercel/DESIGN.md` file and read its 9 standard sections.
4. Implement the UI using the exact values from the design system, leading to a much higher quality output than generic Tailwind presets.

## The 9-Section Google Stitch Format

Each `DESIGN.md` reference is organized into 9 consistent sections:
1. **Visual Theme & Atmosphere** — Overall philosophy
2. **Color Palette & Roles** — Semantic hex colors
3. **Typography Rules** — Exact font families and weights
4. **Component Stylings** — Button, card, and input specifications
5. **Layout Principles** — Consistency in spacing and grids
6. **Depth & Elevation** — Crucial shadow metrics
7. **Do's and Don'ts** — Strict brand guardrails
8. **Responsive Behavior** — Breakpoints and mobile layout
9. **Agent Prompt Guide** — Ready-to-copy AI prompts

## Combining Capabilities

For the highest quality results, instruct agents to combine `design-system` with the `ui-ux` structural logic:
- **`design-system` (domain):** Defines the **Look & Feel** (colors, typography, shadow radius).
- **`pages` (domain):** Defines the **Structure** (what sections go on a 'pricing' page vs 'about' page).
- **`ux` (domain):** Defines the **Behavior** (accessibility, focus states, animations).
