# Skill: UI/UX (Cross-Cutting)

## Purpose

This skill is used to handle style, interface, UX, UI for all project types. Uses UI/UX Builder search engine (built upon [UI UX Pro Max Skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)) with multiple search modes (BM25, Vector, Hybrid) to search for design intelligence from a database containing 57 UI styles, 95 color palettes, 56 font pairings, 24 chart types, 9+ page types, and 98 UX guidelines.

## When to Use

- When creating or updating user interfaces
- When designing responsive layouts
- When ensuring accessibility (WCAG compliance)
- When creating component styles
- When optimizing user experience
- When finding appropriate color palettes, typography, or UI styles

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

## Step-by-Step Process

### Step 1: Analyze User Requirements

Extract key information from user request:
- **Product type**: SaaS, e-commerce, portfolio, dashboard, landing page, etc.
- **Style keywords**: minimal, playful, professional, elegant, dark mode, etc.
- **Industry**: healthcare, fintech, gaming, education, etc.
- **Stack**: React, Vue, Next.js, or default `html-tailwind`

### Step 2: Search Relevant Domains

Use `scripts/search.py` multiple times to gather comprehensive information. Search until you have enough context.

**Search Mode Tips:**
- Use **BM25 (default)** for simple keyword queries
- Use **Vector mode** (`--mode vector`) for natural language queries or when you need semantic matches
- Use **Hybrid mode** (`--mode hybrid`) for best overall results

**Recommended search order:**

1. **Product** - Get style recommendations for product type
   ```bash
   python3 scripts/search.py "<product-type>" --domain product
   # Or with semantic search:
   python3 scripts/search.py "<product-type>" --domain product --mode vector
   ```

2. **Style** - Get detailed style guide (colors, effects, frameworks)
   ```bash
   python3 scripts/search.py "<style-keywords>" --domain style
   # For natural language queries:
   python3 scripts/search.py "elegant dark theme for modern apps" --domain style --mode hybrid
   ```

3. **Typography** - Get font pairings with Google Fonts imports
   ```bash
   python3 scripts/search.py "<typography-keywords>" --domain typography
   ```

4. **Color** - Get color palette (Primary, Secondary, CTA, Background, Text, Border)
   ```bash
   python3 scripts/search.py "<product-type>" --domain color
   ```

5. **Landing** - Get page structure (if landing page)
   ```bash
   python3 scripts/search.py "<landing-keywords>" --domain landing
   ```

6. **Chart** - Get chart recommendations (if dashboard/analytics)
   ```bash
   python3 scripts/search.py "<chart-type>" --domain chart
   ```

7. **UX** - Get best practices and anti-patterns
   ```bash
   python3 scripts/search.py "animation" --domain ux
   python3 scripts/search.py "accessibility" --domain ux
   ```

8. **Stack** - Get stack-specific guidelines (default: html-tailwind)
   ```bash
   python3 scripts/search.py "<keyword>" --stack html-tailwind
   # Or with semantic search:
   python3 scripts/search.py "make layout responsive" --stack html-tailwind --mode vector
   ```

### Step 3: Synthesize Search Results

Combine all search results to create a complete design system:
- Color palette from color search
- Typography from typography search
- UI style from style search
- UX guidelines from ux search
- Stack-specific patterns from stack search

### Step 4: Implement Design

Implement UI following:
- Color palette found
- Typography pairings with Google Fonts
- UI style patterns
- Stack-specific best practices
- UX guidelines and accessibility rules

### Step 5: Pre-Delivery Checklist

Before delivering UI code, verify:

**Visual Quality:**
- [ ] No emojis used as icons (use SVG instead - Heroicons, Lucide, Simple Icons)
- [ ] All icons from consistent icon set
- [ ] Brand logos are correct (verified from Simple Icons)
- [ ] Hover states don't cause layout shift

**Interaction:**
- [ ] All clickable elements have `cursor-pointer`
- [ ] Hover states provide clear visual feedback
- [ ] Transitions are smooth (150-300ms)
- [ ] Focus states visible for keyboard navigation

**Light/Dark Mode:**
- [ ] Light mode text has sufficient contrast (4.5:1 minimum)
- [ ] Glass/transparent elements visible in light mode (`bg-white/80` not `bg-white/10`)
- [ ] Borders visible in both modes
- [ ] Test both modes before delivery

**Layout:**
- [ ] Floating elements have proper spacing from edges
- [ ] No content hidden behind fixed navbars
- [ ] Responsive at 320px, 768px, 1024px, 1440px
- [ ] No horizontal scroll on mobile

**Accessibility:**
- [ ] All images have alt text
- [ ] Form inputs have labels
- [ ] Color is not the only indicator
- [ ] `prefers-reduced-motion` respected

## Required Input

- **Product type**: SaaS, e-commerce, portfolio, dashboard, landing page, etc.
- **Style keywords**: minimal, playful, professional, elegant, dark mode, etc.
- **Industry**: healthcare, fintech, gaming, education, etc.
- **Stack**: React, Vue, Next.js, html-tailwind (default)
- **Target devices**: Desktop, mobile, tablet
- **Accessibility level**: WCAG AA or AAA

## Expected Output

- Complete design system with color palette, typography, and UI style
- Stack-specific implementation code
- Responsive and accessible UI components
- UX-optimized user flows

## Search Reference

### Available Domains

| Domain | Use For | Example Keywords |
|--------|---------|------------------|
| `product` | Product type recommendations | SaaS, e-commerce, portfolio, healthcare, beauty, service |
| `style` | UI styles, colors, effects | glassmorphism, minimalism, dark mode, brutalism |
| `typography` | Font pairings, Google Fonts | elegant, playful, professional, modern |
| `color` | Color palettes by product type | saas, ecommerce, healthcare, beauty, fintech, service |
| `landing` | Page structure, CTA strategies | hero, hero-centric, testimonial, pricing, social-proof |
| `pages` | Page type templates (home, about, post, etc.) | home, about, post, category, pricing, faq, contact, product |
| `chart` | Chart types, library recommendations | trend, comparison, timeline, funnel, pie |
| `ux` | Best practices, anti-patterns | animation, accessibility, z-index, loading |
| `prompt` | AI prompts, CSS keywords | (style name) |

### Available Stacks

| Stack | Focus |
|-------|-------|
| `html-tailwind` | Tailwind utilities, responsive, a11y (DEFAULT) |
| `react` | State, hooks, performance, patterns |
| `nextjs` | SSR, routing, images, API routes |
| `vue` | Composition API, Pinia, Vue Router |
| `svelte` | Runes, stores, SvelteKit |
| `swiftui` | Views, State, Navigation, Animation |
| `react-native` | Components, Navigation, Lists |
| `flutter` | Widgets, State, Layout, Theming |

## Tone & Rules

### Common Rules for Professional UI

**Icons & Visual Elements:**
- ✅ Use SVG icons (Heroicons, Lucide, Simple Icons)
- ✅ Use fixed viewBox (24x24) with w-6 h-6
- ✅ Stable hover states (color/opacity transitions, not scale transforms)
- ❌ NO emoji icons (🎨 🚀 ⚙️)
- ❌ NO incorrect brand logos

**Interaction & Cursor:**
- ✅ Add `cursor-pointer` to all clickable/hoverable cards
- ✅ Provide visual feedback (color, shadow, border) on hover
- ✅ Use `transition-colors duration-200` (150-300ms)
- ❌ NO instant state changes or too slow (>500ms)

**Light/Dark Mode Contrast:**
- ✅ Glass card light mode: `bg-white/80` or higher
- ✅ Text contrast light: `#0F172A` (slate-900) for text
- ✅ Muted text light: `#475569` (slate-600) minimum
- ✅ Border visibility: `border-gray-200` in light mode
- ❌ NO `bg-white/10` (too transparent)
- ❌ NO `#94A3B8` (slate-400) for body text
- ❌ NO `border-white/10` (invisible)

**Layout & Spacing:**
- ✅ Floating navbar: `top-4 left-4 right-4` spacing
- ✅ Content padding: Account for fixed navbar height
- ✅ Consistent max-width: Same `max-w-6xl` or `max-w-7xl`
- ❌ NO navbar stuck to `top-0 left-0 right-0`
- ❌ NO content hidden behind fixed elements

### Code Style

- **Default stack**: `html-tailwind` (unless specified)
- **Mobile-first**: Responsive design approach
- **Accessibility**: WCAG AA minimum
- **Icons**: Heroicons, Lucide, Simple Icons (SVG only)
- **Transitions**: 150-300ms for smooth interactions

### Naming Conventions

- **Tailwind**: Use utility classes
- **Components**: Semantic naming
- **CSS Variables**: For theming

### Limitations

- ❌ DO NOT use emoji as icons
- ❌ DO NOT hardcode colors (use variables or search results)
- ❌ DO NOT skip accessibility
- ❌ DO NOT create fixed-width layouts (unless necessary)
- ❌ DO NOT use inline styles (except dynamic values)
- ❌ DO NOT create non-responsive components
- ❌ DO NOT use scale transforms for hover (causes layout shift)

## Available Scripts

- `scripts/search.py` - Main search script for UI/UX Builder database
- `scripts/core.py` - Core search engine (BM25, Vector, Hybrid)

## Search Modes

UI/UX Builder supports multiple search algorithms for different use cases:

UI/UX Builder supports 3 search modes for different use cases:

1. **BM25 (default)** - Keyword-based search
   - ✅ Fastest, zero dependencies
   - ✅ Best for exact keyword matches
   - ✅ Works out of the box

2. **Vector** - Semantic search
   - ✅ Understands meaning and synonyms
   - ✅ Better results (~15-20% improvement)
   - ⚠️ Requires: `pip install sentence-transformers scikit-learn`

3. **Hybrid** - Best of both worlds
   - ✅ Combines BM25 + Vector
   - ✅ Best results (~25% improvement)
   - ⚠️ Requires: `pip install sentence-transformers scikit-learn`

**Usage:**
```bash
# Search by domain (BM25 - default)
python3 scripts/search.py "<keyword>" --domain <domain> [-n <max_results>]

# Search with Vector mode (semantic)
python3 scripts/search.py "<keyword>" --domain <domain> --mode vector

# Search with Hybrid mode (best results)
python3 scripts/search.py "<keyword>" --domain <domain> --mode hybrid

# Search by stack
python3 scripts/search.py "<keyword>" --stack <stack> [-n <max_results>] [--mode <mode>]

# Examples
python3 scripts/search.py "beauty spa wellness" --domain product
python3 scripts/search.py "elegant dark theme" --domain style --mode vector
python3 scripts/search.py "modern minimal design" --domain style --mode hybrid
python3 scripts/search.py "layout responsive" --stack html-tailwind
```

**Note:** If Vector/Hybrid mode is requested but dependencies are not installed, the system automatically falls back to BM25 mode with a warning message.

## Multi-Page Website Package

### When to Create Full Package vs Landing Page

**Create Full Package** when user requests:
- "Tạo website đầy đủ" / "Create complete website"
- "Tạo gói giao diện đầy đủ" / "Create full interface package"
- Multiple pages mentioned (home, about, contact, etc.)
- E-commerce site (needs product pages)
- Blog/content site (needs post and category pages)

**Create Landing Page Only** when user requests:
- "Tạo landing page" / "Create landing page"
- Single page conversion focus
- Marketing campaign page
- Product launch page

### Default Page Set

When creating a complete website package (not specified), include these 9 pages:

1. **Home** - Main homepage with hero, features, testimonials
2. **About** - Company story, mission, team
3. **Post Details** - Blog/article detail page
4. **Category** - Blog/category listing page
5. **Pricing** - Pricing plans and comparison
6. **FAQ** - Frequently asked questions
7. **Contact** - Contact form and information
8. **Product Category** - E-commerce category listing (if applicable)
9. **Product Details** - E-commerce product detail page (if applicable)

### Multi-Page Workflow

**Step 1: Search Design System** (once for all pages)

```bash
# Product type
python3 scripts/search.py "<product-type>" --domain product

# Style
python3 scripts/search.py "<style-keywords>" --domain style

# Color palette
python3 scripts/search.py "<product-type>" --domain color

# Typography
python3 scripts/search.py "<typography-keywords>" --domain typography
```

**Step 2: Search Each Page Type**

```bash
# Home page
python3 scripts/search.py "home homepage" --domain pages
# Or with semantic search for better results:
python3 scripts/search.py "homepage with hero section" --domain pages --mode hybrid

# About page
python3 scripts/search.py "about company story" --domain pages

# Post details
python3 scripts/search.py "post article blog" --domain pages

# Category page
python3 scripts/search.py "category archive listing" --domain pages

# Pricing page
python3 scripts/search.py "pricing plans tiers" --domain pages

# FAQ page
python3 scripts/search.py "faq questions help" --domain pages

# Contact page
python3 scripts/search.py "contact get-in-touch" --domain pages

# Product category (if e-commerce)
python3 scripts/search.py "product-category shop catalog" --domain pages

# Product details (if e-commerce)
python3 scripts/search.py "product-detail single-product" --domain pages
```

**Step 3: Create Shared Components First**

Before individual pages, create:
- **Header/Navigation** - Consistent across all pages
- **Footer** - Consistent across all pages
- **Button components** - Primary, secondary, CTA styles
- **Card components** - For features, products, posts
- **Form components** - For contact, search
- **Layout wrapper** - Consistent spacing and max-width

**Step 4: Implement Pages in Order**

1. **Home** - Establishes design system
2. **About** - Uses same header/footer
3. **Category** - Reuses card components
4. **Post Details** - Uses category navigation
5. **Pricing** - Standalone but consistent
6. **FAQ** - Standalone but consistent
7. **Contact** - Standalone but consistent
8. **Product Category** (if e-commerce)
9. **Product Details** (if e-commerce)

**Step 5: Ensure Consistency**

- ✅ Same color palette across all pages
- ✅ Same typography (heading + body fonts)
- ✅ Same spacing system
- ✅ Same navigation structure
- ✅ Same footer content
- ✅ Consistent button styles
- ✅ Consistent card styles

### Code Organization

**File Structure:**
```
src/
├── components/
│   ├── shared/
│   │   ├── Header.tsx (or Header.html)
│   │   ├── Footer.tsx (or Footer.html)
│   │   ├── Button.tsx
│   │   └── Card.tsx
│   └── [page-specific components]
├── pages/
│   ├── index.html (or Home.tsx)
│   ├── about.html (or About.tsx)
│   ├── blog/
│   │   ├── [slug].html
│   │   └── category/[category].html
│   ├── pricing.html
│   ├── faq.html
│   ├── contact.html
│   └── products/ (if e-commerce)
│       ├── category/[category].html
│       └── [slug].html
└── styles/
    └── globals.css (or tailwind.config.js)
```

**Component Guidelines:**
- Extract common patterns into reusable components
- One component per file
- Keep components under 200-300 lines
- Use props/variables for customization

See `templates/page-types-guide.md` for detailed page templates.

## Available Templates

- `templates/responsive-design.md` - Responsive checklist
- `templates/accessibility-checklist.md` - Accessibility checklist
- `templates/pre-delivery-checklist.md` - Pre-delivery verification
- `templates/page-types-guide.md` - Multi-page website package guide
- `templates/example-prompt-full-theme.md` - Example prompts for creating full theme packages
- `templates/prompt-template-full-theme.md` - Prompt templates (copy-paste ready)

## Examples

See `examples/` directory for reference:
- `good-ux-patterns/` - Good patterns (high conversion, accessible)
- `bad-ux-patterns/` - Patterns to avoid (confusing, inaccessible)

## Example Workflows

### Example 1: Landing Page Only

**User request:** "Create landing page for professional skincare service"

**Agent should:**

```bash
# 1. Search product type
python3 scripts/search.py "beauty spa wellness service" --domain product
# Or with semantic search for better results:
python3 scripts/search.py "professional skincare service business" --domain product --mode vector

# 2. Search style (based on industry: beauty, elegant)
python3 scripts/search.py "elegant minimal soft" --domain style
# Or with hybrid for best results:
python3 scripts/search.py "elegant minimal design for beauty services" --domain style --mode hybrid

# 3. Search typography
python3 scripts/search.py "elegant luxury" --domain typography

# 4. Search color palette
python3 scripts/search.py "beauty spa wellness" --domain color

# 5. Search landing page structure
python3 scripts/search.py "hero-centric social-proof" --domain landing

# 6. Search UX guidelines
python3 scripts/search.py "animation" --domain ux
python3 scripts/search.py "accessibility" --domain ux

# 7. Search stack guidelines (default: html-tailwind)
python3 scripts/search.py "layout responsive" --stack html-tailwind
```

**Then:** Synthesize all search results and implement the design.

### Example 2: Complete Website Package

**User request:** "Tạo gói website đầy đủ cho dịch vụ chăm sóc da chuyên nghiệp"

**Agent should:**

```bash
# Step 1: Search design system (once for all pages)
# Use hybrid mode for better semantic understanding
python3 scripts/search.py "beauty spa wellness service" --domain product --mode hybrid
python3 scripts/search.py "elegant minimal soft design" --domain style --mode hybrid
python3 scripts/search.py "beauty spa wellness" --domain color
python3 scripts/search.py "elegant luxury typography" --domain typography --mode vector

# Step 2: Search each page type
python3 scripts/search.py "home homepage" --domain pages
python3 scripts/search.py "about company story" --domain pages
python3 scripts/search.py "post article blog" --domain pages
python3 scripts/search.py "category archive" --domain pages
python3 scripts/search.py "pricing plans" --domain pages
python3 scripts/search.py "faq questions" --domain pages
python3 scripts/search.py "contact" --domain pages

# Step 3: Search UX guidelines
python3 scripts/search.py "animation" --domain ux
python3 scripts/search.py "accessibility" --domain ux

# Step 4: Search stack guidelines
python3 scripts/search.py "layout responsive" --stack html-tailwind
# Or with semantic search:
python3 scripts/search.py "how to make layout responsive" --stack html-tailwind --mode vector
```

**Then:**
1. Create shared components (Header, Footer, Button, Card)
2. Implement pages in order: Home → About → Category → Post Details → Pricing → FAQ → Contact
3. Ensure consistency across all pages
4. Verify with pre-delivery checklist

## Tips for Better Results

1. **Be specific with keywords** - "healthcare SaaS dashboard" > "app"
2. **Use appropriate search mode:**
   - **BM25 (default)** for simple keyword queries
   - **Vector mode** (`--mode vector`) for natural language or when you need semantic matches
   - **Hybrid mode** (`--mode hybrid`) for best overall results
3. **Search multiple times** - Different keywords reveal different insights
4. **Combine domains** - Style + Typography + Color = Complete design system
5. **Always check UX** - Search "animation", "z-index", "accessibility" for common issues
6. **Use stack flag** - Get implementation-specific best practices
7. **Iterate** - If first search doesn't match, try different keywords or switch search mode
8. **Split Into Multiple Files** - For better maintainability:
   - Separate components into individual files (e.g., `Header.tsx`, `Footer.tsx`)
   - Extract reusable styles into dedicated files
   - Keep each file focused and under 200-300 lines

### Search Mode Selection Guide

- **Use BM25 when:**
  - You have clear, specific keywords
  - Speed is priority
  - Simple queries work well

- **Use Vector when:**
  - Natural language queries ("elegant dark theme for modern apps")
  - Need to find synonyms or related terms
  - Dataset > 500 records

- **Use Hybrid when:**
  - Need best possible results
  - Mix of keyword and natural language queries
  - Production use cases

## Links to Other Skills

- **documents**: Use to document design system
- **content-optimization**: Use to optimize CTA placement and styling
