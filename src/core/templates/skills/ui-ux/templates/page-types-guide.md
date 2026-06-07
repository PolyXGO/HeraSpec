# Page Types Guide - Multi-Page Website Package

This guide provides templates and best practices for creating complete website packages with multiple page types.

## Default Page Set

When creating a complete website package (not just a landing page), the default set includes:

1. **Home** - Main homepage
2. **About** - Company/story page
3. **Post Details** - Blog/article detail page
4. **Category** - Blog/category listing page
5. **Pricing** - Pricing/plans page
6. **FAQ** - Frequently asked questions
7. **Contact** - Contact form and information
8. **Product Category** - E-commerce category listing
9. **Product Details** - E-commerce product detail page

## Page Type Templates

### 1. Home Page

**Purpose**: Main entry point, first impression, conversion focus

**Key Sections**:
- Hero with headline and primary CTA
- Value proposition (what makes you different)
- Key features (3-5 features with icons)
- Social proof (testimonials, logos, stats)
- Secondary CTA section
- Footer with navigation

**Layout Pattern**: Hero-Centric or Feature-Rich Showcase

**Search Query**: `python3 scripts/search.py "home homepage" --domain pages`

### 2. About Page

**Purpose**: Build trust, humanize brand, show expertise

**Key Sections**:
- Page header with title
- Mission/Vision statement
- Story/Timeline (how you started)
- Team grid (photos + roles)
- Values/Principles
- Optional: Stats/metrics
- Optional: CTA

**Layout Pattern**: Storytelling-Driven or Trust & Authority

**Search Query**: `python3 scripts/search.py "about company story" --domain pages`

### 3. Post Details (Blog Article)

**Purpose**: Content consumption, readability, SEO

**Key Sections**:
- Breadcrumbs navigation
- Article title + meta (date, author, category)
- Featured image
- Content body (readable typography)
- Author bio card
- Related posts grid
- Optional: Comments section
- Social share buttons

**Layout Pattern**: Minimal & Direct or Content-First

**Search Query**: `python3 scripts/search.py "post article blog" --domain pages`

### 4. Category Page (Blog/Content)

**Purpose**: Content discovery, filtering, browsing

**Key Sections**:
- Category header with title
- Category description
- Filter/search bar (optional)
- Post grid (cards or list view)
- Pagination
- Optional: Sidebar with widgets

**Layout Pattern**: Minimal & Direct or Bento Box Grid

**Search Query**: `python3 scripts/search.py "category archive listing" --domain pages`

### 5. Pricing Page

**Purpose**: Conversion, clear pricing, address objections

**Key Sections**:
- Hero headline
- Price comparison cards (3-4 tiers)
- Feature comparison table
- FAQ section (address common objections)
- Optional: Testimonials
- Final CTA

**Layout Pattern**: Pricing-Focused Landing

**Search Query**: `python3 scripts/search.py "pricing plans tiers" --domain pages`

### 6. FAQ Page

**Purpose**: Reduce support tickets, self-service

**Key Sections**:
- Hero with search bar
- Popular categories/tabs
- FAQ accordion (expandable Q&A)
- Contact/support CTA (for unresolved questions)
- Related articles

**Layout Pattern**: FAQ/Documentation Landing

**Search Query**: `python3 scripts/search.py "faq questions help" --domain pages`

### 7. Contact Page

**Purpose**: Lead capture, customer support

**Key Sections**:
- Hero/Header
- Contact form (name, email, message - max 3-4 fields)
- Contact information cards (address, phone, email)
- Optional: Map embed
- Social media links
- Success message feedback

**Layout Pattern**: Minimal & Direct or Trust & Authority

**Search Query**: `python3 scripts/search.py "contact get-in-touch" --domain pages`

### 8. Product Category (E-commerce)

**Purpose**: Product discovery, filtering, browsing

**Key Sections**:
- Category header
- Filter/sort bar
- Product grid (cards with images, titles, prices)
- Pagination or infinite scroll
- Optional: Sidebar filters
- Quick view modal (optional)

**Layout Pattern**: E-commerce Clean or Bento Box Grid

**Search Query**: `python3 scripts/search.py "product-category shop catalog" --domain pages`

### 9. Product Details (E-commerce)

**Purpose**: Conversion, product information, purchase decision

**Key Sections**:
- Breadcrumbs
- Product image gallery (with zoom)
- Product title + price
- Product description
- Add to cart form + options (size, color, quantity)
- Specifications table
- Reviews/ratings section
- Related products grid

**Layout Pattern**: Conversion-Optimized or Feature-Rich Showcase

**Search Query**: `python3 scripts/search.py "product-detail single-product" --domain pages`

## Implementation Workflow

### Step 1: Search Page Type Template

For each page type, search the pages database:

```bash
python3 scripts/search.py "<page-type-keywords>" --domain pages
```

### Step 2: Search Design System

For consistent design across all pages:

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

### Step 3: Create Shared Components

Before creating individual pages, create shared components:

- **Header/Navigation** - Consistent across all pages
- **Footer** - Consistent across all pages
- **Button styles** - Primary, secondary, CTA
- **Card components** - For features, products, posts
- **Form components** - For contact, search
- **Layout wrapper** - Consistent spacing and max-width

### Step 4: Implement Pages in Order

Recommended order:

1. **Home** - Establishes design system
2. **About** - Uses same header/footer
3. **Category** - Reuses card components
4. **Post Details** - Uses category navigation
5. **Pricing** - Standalone but consistent
6. **FAQ** - Standalone but consistent
7. **Contact** - Standalone but consistent
8. **Product Category** (if e-commerce)
9. **Product Details** (if e-commerce)

### Step 5: Ensure Consistency

- Same color palette across all pages
- Same typography (heading + body fonts)
- Same spacing system (Tailwind spacing scale)
- Same navigation structure
- Same footer content
- Consistent button styles
- Consistent card styles

## Code Organization

### File Structure

```
src/
├── components/
│   ├── shared/
│   │   ├── Header.tsx (or Header.html)
│   │   ├── Footer.tsx (or Footer.html)
│   │   ├── Button.tsx
│   │   └── Card.tsx
│   ├── home/
│   │   ├── Hero.tsx
│   │   └── Features.tsx
│   ├── about/
│   │   ├── Team.tsx
│   │   └── Timeline.tsx
│   └── ...
├── pages/
│   ├── index.html (or Home.tsx)
│   ├── about.html (or About.tsx)
│   ├── blog/
│   │   ├── [slug].html (or PostDetails.tsx)
│   │   └── category/[category].html
│   ├── pricing.html
│   ├── faq.html
│   ├── contact.html
│   └── products/
│       ├── category/[category].html
│       └── [slug].html
└── styles/
    ├── globals.css (or tailwind.config.js)
    └── components.css
```

### Component Reusability

- Extract common patterns into components
- Use props/variables for customization
- Keep components under 200-300 lines
- One component per file

## Best Practices

### Navigation

- Consistent navigation across all pages
- Active state indication (current page highlighted)
- Mobile-responsive hamburger menu
- Breadcrumbs for deep pages (3+ levels)

### Responsive Design

- Mobile-first approach
- Test at: 320px, 768px, 1024px, 1440px
- No horizontal scroll on mobile
- Touch-friendly targets (44x44px minimum)

### Performance

- Lazy load images below fold
- Optimize images (WebP format, appropriate sizes)
- Minimize JavaScript
- Use CSS for animations when possible

### Accessibility

- Semantic HTML
- ARIA labels where needed
- Keyboard navigation
- Focus indicators
- Alt text for images
- Form labels
- Color contrast (4.5:1 minimum)

## Example: Complete Website Package

**User Request**: "Tạo gói website đầy đủ cho dịch vụ chăm sóc da"

**Agent Workflow**:

1. Search product type: `python3 scripts/search.py "beauty spa wellness service" --domain product`
2. Search style: `python3 scripts/search.py "elegant minimal soft" --domain style`
3. Search color: `python3 scripts/search.py "beauty spa wellness" --domain color`
4. Search typography: `python3 scripts/search.py "elegant luxury" --domain typography`

5. For each page type:
   - `python3 scripts/search.py "home homepage" --domain pages`
   - `python3 scripts/search.py "about company" --domain pages`
   - `python3 scripts/search.py "post article" --domain pages`
   - `python3 scripts/search.py "category archive" --domain pages`
   - `python3 scripts/search.py "pricing plans" --domain pages`
   - `python3 scripts/search.py "faq questions" --domain pages`
   - `python3 scripts/search.py "contact" --domain pages`

6. Create shared components (Header, Footer, Button, Card)
7. Implement pages in recommended order
8. Ensure consistency across all pages
9. Verify with pre-delivery checklist

## Notes

- **Default pages**: If user doesn't specify, create all 9 default pages
- **Custom pages**: User can specify which pages to create
- **E-commerce pages**: Only create Product Category and Product Details if product type is e-commerce
- **Consistency**: Most important - all pages should feel like one cohesive website
