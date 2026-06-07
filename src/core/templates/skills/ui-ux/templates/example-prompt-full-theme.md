# Example Prompts: Creating Full Theme Packages

## Example Prompt 1: Healthcare & Spa Service Theme

```
Create a complete website package for professional healthcare and spa services with the following requirements:

**Requirements:**
- Product type: Beauty & Wellness Service
- Style: Elegant, minimal, soft, professional
- Industry: Healthcare/Beauty
- Stack: html-tailwind (default)
- Create all pages: home, about, services, blog listing, blog post details, category, pricing, faq, contact

**Process:**
1. Use skill ui-ux to search for design intelligence
2. Create shared components first (Header, Footer, Button, Card)
3. Implement each page in order: Home → About → Services → Category → Post Details → Pricing → FAQ → Contact
4. Ensure consistency in colors, typography, spacing
5. Responsive and accessible

**Notes:**
- Use search scripts with hybrid mode for best results
- Follow pre-delivery checklist
- Split components into separate files
```

---

## Example Prompt 2: E-Commerce Theme

```
Create a complete website package for an online fashion store with the following requirements:

**Requirements:**
- Product type: E-commerce Luxury
- Style: Elegant, premium, sophisticated
- Industry: Fashion/Retail
- Stack: Next.js with Tailwind CSS
- Create all pages: home, about, product category, product details, cart, checkout, thank you, faq, contact

**Process:**
1. Use skill ui-ux to search:
   - Product type recommendations
   - Style guide with hybrid mode
   - Color palette
   - Typography
   - Page types (home, product category, product details, cart, checkout, thank you)
   - UX guidelines for e-commerce
   - Next.js stack guidelines

2. Create design system:
   - Color palette from search results
   - Typography from search results
   - Component library (Button, Card, Form, etc.)

3. Implement pages:
   - Home with hero, featured products, testimonials
   - Product category with filters
   - Product details with gallery, add to cart
   - Cart with quantity controls
   - Checkout with form validation
   - Thank you with order confirmation

4. Ensure:
   - Conversion optimization
   - Mobile-first responsive
   - Accessibility (WCAG AA)
   - Performance optimization

**Notes:**
- Use vector/hybrid mode for better semantic search
- Follow e-commerce best practices from search results
```

---

## Example Prompt 3: SaaS Landing Theme

```
Create a complete website package for a project management SaaS platform with the following requirements:

**Requirements:**
- Product type: SaaS (General)
- Style: Modern, clean, professional, tech-forward
- Industry: B2B SaaS
- Stack: React with Tailwind CSS
- Create all pages: home, about, pricing, features, faq, contact, login, register, dashboard

**Process:**
1. Use skill ui-ux to search design intelligence:
   ```bash
   # Search with hybrid mode for best results
   python3 heraspec/skills/ui-ux/scripts/search.py "SaaS project management" --domain product --mode hybrid
   python3 heraspec/skills/ui-ux/scripts/search.py "modern clean professional tech" --domain style --mode hybrid
   python3 heraspec/skills/ui-ux/scripts/search.py "SaaS" --domain color
   python3 heraspec/skills/ui-ux/scripts/search.py "professional modern" --domain typography --mode vector
   python3 heraspec/skills/ui-ux/scripts/search.py "home homepage" --domain pages
   python3 heraspec/skills/ui-ux/scripts/search.py "pricing plans tiers" --domain pages
   python3 heraspec/skills/ui-ux/scripts/search.py "login sign-in" --domain pages
   python3 heraspec/skills/ui-ux/scripts/search.py "dashboard account" --domain pages
   python3 heraspec/skills/ui-ux/scripts/search.py "responsive layout" --stack react --mode vector
   ```

2. Create shared components:
   - Header with navigation
   - Footer
   - Button variants (primary, secondary, outline)
   - Card components
   - Form components
   - Modal components

3. Implement pages in order:
   - Home: Hero, features, testimonials, CTA
   - About: Mission, team, values
   - Pricing: Plans comparison, FAQ
   - Features: Feature showcase
   - FAQ: Accordion with search
   - Contact: Form + info
   - Login/Register: Auth forms
   - Dashboard: User dashboard with stats

4. Ensure:
   - Consistent design system
   - Responsive design
   - Accessibility
   - Performance

**Notes:**
- Use search results to implement correct colors, fonts, styles
- Follow SaaS design patterns from search results
```

---

## Example Prompt 4: Blog/Content Site Theme

```
Create a complete website package for a technology blog with the following requirements:

**Requirements:**
- Product type: Content/News
- Style: Clean, readable, modern
- Industry: Technology/Education
- Stack: Next.js with Tailwind CSS
- Create all pages: home, blog listing, category, post details, about, contact, search results

**Process:**
1. Use skill ui-ux to search:
   - Style recommendations for content sites
   - Typography for readability
   - Color palette for reading experience
   - Page types (home, blog listing, category, post details, search results)

2. Create components:
   - Header with navigation and search
   - Footer
   - Post card component
   - Category filter
   - Search bar
   - Author card
   - Related posts component

3. Implement pages:
   - Home: Featured posts, recent posts, categories
   - Blog listing: Post grid with pagination
   - Category: Filtered post listing
   - Post details: Full article with author, related posts
   - Search results: Search with filters
   - About: Author/company info
   - Contact: Contact form

4. Ensure:
   - Readability is priority
   - SEO optimization
   - Fast loading
   - Social sharing

**Notes:**
- Focus on typography and readability
- Use vector mode for better semantic search
```

---

## Example Prompt 5: Portfolio/Creative Agency Theme

```
Create a complete website package for a creative agency with the following requirements:

**Requirements:**
- Product type: Creative Agency
- Style: Bold, creative, modern, artistic
- Industry: Design/Marketing
- Stack: React with Tailwind CSS
- Create all pages: home, about, portfolio, services, team, contact, case studies

**Process:**
1. Use skill ui-ux to search:
   - Creative agency style recommendations
   - Bold, artistic color palettes
   - Creative typography
   - Portfolio page patterns
   - Motion-driven design patterns

2. Create components:
   - Animated hero section
   - Portfolio grid with filters
   - Service cards
   - Team member cards
   - Case study components

3. Implement pages:
   - Home: Bold hero, featured work, services preview
   - About: Agency story, mission
   - Portfolio: Project grid with filters and lightbox
   - Services: Service offerings
   - Team: Team members
   - Case studies: Detailed project showcases
   - Contact: Contact form

4. Ensure:
   - Creative and unique
   - Smooth animations
   - Showcase work effectively
   - Professional but artistic

**Notes:**
- Use motion-driven patterns from search results
- Focus on visual impact
```

---

## Standard Prompt Structure

When creating prompts, should include:

### 1. Basic Information
```
**Requirements:**
- Product type: [SaaS, E-commerce, Service, etc.]
- Style: [minimal, elegant, modern, etc.]
- Industry: [Healthcare, Fintech, etc.]
- Stack: [html-tailwind, react, nextjs, etc.]
- Pages: [list pages to create]
```

### 2. Clear Process
```
**Process:**
1. Use skill ui-ux to search design intelligence
2. Create shared components
3. Implement pages in order
4. Ensure consistency and quality
```

### 3. Specific Search Commands (Optional)
```
**Search commands:**
```bash
python3 heraspec/skills/ui-ux/scripts/search.py "..." --domain ... --mode hybrid
```
```

### 4. Special Notes
```
**Notes:**
- Use appropriate search modes
- Follow best practices
- Check pre-delivery checklist
```

---

## Tips for Effective Prompts

1. **Be specific about product type and style** - Helps search more accurately
2. **List all pages to create clearly** - Agent knows exact scope
3. **Mention search modes** - Encourages using hybrid/vector for better results
4. **Require consistency** - Ensures unified design system
5. **Mention stack** - Agent will search stack-specific guidelines
6. **Require accessibility** - Ensures WCAG compliance

---

## Short Prompt Example

```
Create a complete website package for [product type] with style [style keywords]. 
Use skill ui-ux to search design intelligence with hybrid mode. 
Create pages: [list pages]. 
Stack: [stack]. 
Ensure responsive, accessible, and consistent design system.
```

---

## Detailed Prompt Example

```
Create a complete website package for [product type] with the following requirements:

**Information:**
- Product type: [type]
- Style: [keywords]
- Industry: [industry]
- Stack: [stack]
- Pages: [list]

**Process:**
1. Search design intelligence with skill ui-ux (use hybrid mode)
2. Create shared components (Header, Footer, Button, Card)
3. Implement pages: [order]
4. Verify with pre-delivery checklist

**Quality Requirements:**
- Consistent design system
- Responsive (320px, 768px, 1024px, 1440px)
- Accessible (WCAG AA)
- Performance optimized
- Follow search results from ui-ux skill
```

---

## Important Notes

1. **Always mention skill ui-ux** - Agent will know to use this skill
2. **Encourage using search modes** - Hybrid/Vector for better results
3. **Require multi-page** - Agent will create full package instead of just landing page
4. **Mention consistency** - Ensures all pages use same design system
5. **Require checklist** - Agent will verify before delivering
