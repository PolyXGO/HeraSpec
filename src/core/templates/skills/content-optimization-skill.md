# Skill: Content Optimization (Cross-Cutting)

## Purpose

This skill is used to optimize content and increase CTA (Call-to-Action) conversion for the product/module being developed. Focus on conversion optimization and user engagement.

## When to Use

- When creating landing pages
- When designing CTA buttons
- When writing marketing content
- When optimizing email campaigns
- When needing to increase conversion rates

## Step-by-Step Process

### Step 1: Analyze Goals
- Identify conversion goal (signup, purchase, download, etc.)
- Identify target audience
- Identify value proposition
- Research competitors

### Step 2: Create Content Variants
- Use template: `templates/cta-template.md`
- Use template: `templates/landing-page-template.md`
- Create multiple variants for A/B testing
- Run script: `scripts/generate-ab-test-variants.sh`

### Step 3: Optimize CTA Placement
- Above the fold for primary CTA
- Multiple CTAs for long pages
- Exit-intent CTAs
- Follow good examples in `examples/high-conversion-cta/`

### Step 4: Test & Measure
- Setup A/B testing
- Run script: `scripts/analyze-cta-performance.py`
- Measure conversion rates
- Track user behavior

### Step 5: Iterate
- Analyze results
- Optimize based on data
- Test new variants
- Continuously improve

## Required Input

- **Conversion goal**: Signup, purchase, download, etc.
- **Target audience**: Demographics, interests, pain points
- **Value proposition**: Unique selling points
- **Current conversion rate**: Baseline for comparison
- **Content type**: Landing page, email, banner, etc.

## Expected Output

- Optimized content with clear CTAs
- Multiple variants for A/B testing
- Performance metrics and analysis
- Recommendations for improvement

## Tone & Rules

### Content Principles
- **Clear value**: Clear value proposition
- **Urgency**: Create sense of urgency (if appropriate)
- **Benefit-focused**: Focus on benefits, not just features
- **Action-oriented**: Language that stimulates action

### CTA Best Practices
- Action verbs: "Get Started", "Download Now", "Try Free"
- Clear and specific
- Visually prominent
- Above the fold
- Mobile-friendly

### Limitations
- ❌ DO NOT use misleading claims
- ❌ DO NOT create too many CTAs (confusion)
- ❌ DO NOT ignore mobile experience
- ❌ DO NOT skip loading speed
- ❌ DO NOT test without measuring

## Available Templates

- `templates/cta-template.md` - CTA template
- `templates/landing-page-template.md` - Landing page template
- `templates/email-campaign-template.md` - Email marketing template

## Available Scripts

- `scripts/analyze-cta-performance.py` - Analyze CTA performance
- `scripts/generate-ab-test-variants.sh` - Generate variants for A/B testing

## Examples

See `examples/` directory for reference:
- `high-conversion-cta/` - Effective CTA (high conversion)
- `low-conversion-cta/` - CTA that needs improvement (low conversion)

## Links to Other Skills

- **ui-ux**: Use to style CTAs and optimize visual hierarchy
- **documents**: Use to document conversion strategies
