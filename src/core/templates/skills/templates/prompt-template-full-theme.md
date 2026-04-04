# Prompt Template: Creating Full Theme Packages

## Basic Template (Copy & Paste)

```
Create a complete website package for [PRODUCT_TYPE] with the following requirements:

**Project Information:**
- Product type: [SaaS / E-commerce / Service / Portfolio / etc.]
- Style: [minimal / elegant / modern / bold / etc.]
- Industry: [Healthcare / Fintech / Beauty / etc.]
- Stack: [html-tailwind / react / nextjs / etc.]
- Pages to create: home, about, [add other pages if needed]

**Process:**
1. Use skill ui-ux to search design intelligence:
   - Product type recommendations (--mode hybrid)
   - Style guide (--mode hybrid)
   - Color palette
   - Typography (--mode vector)
   - Page types for each page (--domain pages)
   - UX guidelines
   - Stack-specific guidelines (--stack [stack])

2. Create shared components first:
   - Header/Navigation
   - Footer
   - Button components
   - Card components
   - Form components

3. Implement pages in order:
   - Home → About → [other pages]
   - Ensure consistency in colors, typography, spacing

4. Verify with pre-delivery checklist

**Quality Requirements:**
- ✅ Consistent design system (same colors, fonts, spacing)
- ✅ Responsive (320px, 768px, 1024px, 1440px)
- ✅ Accessible (WCAG AA minimum)
- ✅ Performance optimized
- ✅ Follow search results from ui-ux skill

**Notes:**
- Use hybrid/vector mode for better search results
- Split components into separate files
- Follow best practices from search results
```

---

## Template for E-Commerce

```
Create a complete website package for online [PRODUCT_TYPE] store with the following requirements:

**Information:**
- Product type: E-commerce [Luxury / General]
- Style: [elegant / modern / vibrant]
- Industry: [Fashion / Electronics / etc.]
- Stack: [html-tailwind / nextjs / react]
- Pages: home, about, product category, product details, cart, checkout, thank you, faq, contact

**Process:**
1. Search with skill ui-ux (use hybrid mode):
   - E-commerce product recommendations
   - Style guide
   - Color palette
   - Page types: product category, product details, cart, checkout, thank you
   - E-commerce UX guidelines
   - Stack guidelines

2. Create design system and shared components

3. Implement pages with focus on conversion:
   - Product pages with clear CTAs
   - Cart with easy management
   - Checkout with trust signals
   - Thank you with order confirmation

**Requirements:**
- Conversion optimization
- Trust signals (reviews, security badges)
- Clear pricing and product info
- Mobile-first responsive
- Fast loading
```

---

## Template for SaaS

```
Create a complete website package for SaaS platform [PRODUCT_NAME] with the following requirements:

**Information:**
- Product type: SaaS [General / Micro SaaS]
- Style: [modern / clean / professional / tech-forward]
- Industry: [B2B / B2C]
- Stack: [react / nextjs / vue]
- Pages: home, about, pricing, features, faq, contact, login, register, dashboard

**Process:**
1. Search with skill ui-ux (hybrid mode):
   - SaaS product recommendations
   - Modern/clean style guide
   - Professional color palette
   - Typography for SaaS
   - Page types: home, pricing, login, register, dashboard
   - SaaS UX guidelines
   - Stack guidelines

2. Create components library

3. Implement pages:
   - Home: Hero, features, social proof, CTA
   - Pricing: Plans comparison, FAQ
   - Auth: Login/Register with validation
   - Dashboard: User dashboard with stats

**Requirements:**
- Professional and trustworthy
- Clear value proposition
- Easy signup flow
- Responsive dashboard
```

---

## Template for Service Business

```
Create a complete website package for [SERVICE_TYPE] service with the following requirements:

**Information:**
- Product type: Service Landing Page / B2B Service
- Style: [elegant / professional / trustworthy]
- Industry: [Healthcare / Legal / Consulting / etc.]
- Stack: html-tailwind
- Pages: home, about, services, team, testimonials, faq, contact

**Process:**
1. Search with skill ui-ux:
   - Service business recommendations
   - Trust & Authority style
   - Professional color palette
   - Page types: home, about, services, team, testimonials
   - UX guidelines for service businesses

2. Create components

3. Implement pages with focus on trust:
   - Home: Hero, services preview, testimonials
   - About: Story, mission, values
   - Services: Service offerings
   - Team: Team members
   - Testimonials: Client feedback
   - Contact: Contact form

**Requirements:**
- Build trust and credibility
- Show expertise
- Professional appearance
- Easy contact
```

---

## Template for Blog/Content Site

```
Create a complete website package for [TOPIC] blog with the following requirements:

**Information:**
- Product type: Content/News
- Style: [clean / readable / minimal]
- Industry: [Technology / Education / etc.]
- Stack: [nextjs / react]
- Pages: home, blog listing, category, post details, about, contact, search results

**Process:**
1. Search with skill ui-ux:
   - Content site style
   - Readable typography
   - Color palette for reading
   - Page types: blog listing, category, post details, search results
   - Content UX guidelines

2. Create components:
   - Post cards
   - Category filters
   - Search bar
   - Author cards
   - Related posts

3. Implement pages with focus on readability:
   - Blog listing with pagination
   - Post details with good typography
   - Search results with filters
   - Category pages

**Requirements:**
- Readability is priority
- SEO optimization
- Fast loading
- Social sharing
- Easy navigation
```

---

## Quick Reference: Common Pages

### Default Set (9 pages)
- home
- about
- post details
- category
- pricing
- faq
- contact
- product category (e-commerce)
- product details (e-commerce)

### E-Commerce Additional
- cart
- checkout
- thank you

### User Accounts Additional
- login
- register
- dashboard
- account settings

### Content Sites Additional
- blog listing
- search results

---

## Tips for Using Templates

1. **Replace [PRODUCT_TYPE]** with specific product type
2. **Choose style keywords** that match your brand
3. **List all pages** that need to be created
4. **Choose stack** that fits your project
5. **Mention search modes** to get better results
6. **Require consistency** to ensure unified design system

---

## Complete Example

```
Create a complete website package for professional skincare service with the following requirements:

**Project Information:**
- Product type: Beauty & Wellness Service
- Style: elegant, minimal, soft, professional
- Industry: Healthcare/Beauty
- Stack: html-tailwind (default)
- Pages to create: home, about, services, blog listing, post details, category, pricing, faq, contact

**Process:**
1. Use skill ui-ux to search design intelligence:
   ```bash
   python3 heraspec/skills/ui-ux/scripts/search.py "beauty spa wellness service" --domain product --mode hybrid
   python3 heraspec/skills/ui-ux/scripts/search.py "elegant minimal soft professional" --domain style --mode hybrid
   python3 heraspec/skills/ui-ux/scripts/search.py "beauty spa wellness" --domain color
   python3 heraspec/skills/ui-ux/scripts/search.py "elegant luxury" --domain typography --mode vector
   python3 heraspec/skills/ui-ux/scripts/search.py "home homepage" --domain pages
   python3 heraspec/skills/ui-ux/scripts/search.py "about company story" --domain pages
   python3 heraspec/skills/ui-ux/scripts/search.py "services offerings" --domain pages
   python3 heraspec/skills/ui-ux/scripts/search.py "pricing plans" --domain pages
   python3 heraspec/skills/ui-ux/scripts/search.py "faq questions" --domain pages
   python3 heraspec/skills/ui-ux/scripts/search.py "contact" --domain pages
   python3 heraspec/skills/ui-ux/scripts/search.py "animation accessibility" --domain ux
   python3 heraspec/skills/ui-ux/scripts/search.py "layout responsive" --stack html-tailwind
   ```

2. Create shared components first:
   - Header with navigation
   - Footer
   - Button components (primary, secondary)
   - Card components (service cards, post cards)
   - Form components

3. Implement pages in order:
   - Home: Hero, services preview, testimonials, CTA
   - About: Mission, story, team, values
   - Services: Service offerings with descriptions
   - Blog listing: Post grid with pagination
   - Category: Category page with filters
   - Post details: Full article with author, related posts
   - Pricing: Plans comparison, FAQ
   - FAQ: Accordion with search
   - Contact: Contact form + info

4. Ensure:
   - ✅ Consistent design system (same colors, fonts from search results)
   - ✅ Responsive (320px, 768px, 1024px, 1440px)
   - ✅ Accessible (WCAG AA)
   - ✅ Performance optimized
   - ✅ Follow search results from ui-ux skill

**Notes:**
- Use hybrid/vector mode for better search results
- Split components into separate files
- Follow pre-delivery checklist
- Ensure all pages use the same design system
```
