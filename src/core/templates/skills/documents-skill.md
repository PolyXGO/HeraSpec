# Skill: Documents (Cross-Cutting & Multi-Format)

## Purpose

This skill is used to create comprehensive documentation for both technical and end-user audiences. It supports parallel generation of Markdown files (for repository/GitHub) and interactive HTML files (for browser-based manuals).

## Core Requirements

### 1. Multi-Format Output
Every documentation task should ideally generate three versions:
- `doc-name.md`: Clean Markdown for version control.
- `doc-name.html`: Interactive HTML with a modern split-panel layout for deep reading.
- `documentation-landing-page.html`: A high-end, visual landing page to showcase features and provide entry points.

### 2. HTML Layout (Premium Standard)
- **Documentation Page**: Split-panel (Sidebar for Nav, Content for reading). Smooth scroll-spy included.
- **Landing Page**: Full-screen Hero section, feature grids with hover effects, and clear Calls to Action (CTA).

### 3. Visual Excellence
- Use the `ui-ux` skill to determine the theme colors, typography gradients, and spacing.
- The Landing Page must include scroll animations (fade-in, transform) to feel premium and alive.

## Implementation Steps

### Step 1: Define Content and Flow
1. Outline the main technical content for the `.md` and `.html` docs.
2. Identify the "Key Features" and "USP" (Unique Selling Points) for the Landing Page feature grid.

### Step 2: Generate Markdown & Documentation HTML
1. Populate `technical-doc-template.md` (or user guide).
2. Populate `documentation.html` with navigation and sections.

### Step 3: Integrate Landing Page
1. Use `templates/documentation-landing-page.html`.
2. **Hero Section**: Write a compelling headline and description.
3. **Feature Grid**: Create cards for each major feature using `<div class="feature-card">`.
4. **Integration**: Link the CTA buttons to `documentation.html`.
5. Apply `landing-style.css` and `landing-script.js`.

## Required Input

- **Document type**: Technical, user guide, API, changelog
- **Target audience**: Developers, end-users, admins
- **Structural Outline**: List of headings and sub-headings
- **Design Cues**: Colors and icons from `ui-ux` skill

## Expected Output

- `file.md`: Complete documentation in Markdown.
- `file.html`: Interactive split-panel HTML documentation.
- `style.css`: Documentation styles.
- `script.js`: Documentation interactivity.

## Tone & Rules

- **Consistent Content**: The content in MD and HTML MUST be identical in substance.
- **No Inline Bloat**: Keep CSS and JS in separate files as provided in the templates.
- **Interactive T.O.C**: Sidebar links MUST use smooth-scroll IDs.

## Available Templates

- `templates/documentation.html` - Base HTML documentation layout
- `templates/documentation-landing-page.html` - Premium Landing Page layout
- `templates/style.css` - Premium styles for HTML documentation
- `templates/landing-style.css` - Premium styles for Landing Page
- `templates/script.js` - Interactive logic for HTML documentation
- `templates/landing-script.js` - Interactive logic for Landing Page
- `templates/technical-doc-template.md` - Technical documentation
- `templates/user-guide-template.md` - User guide
- `templates/api-doc-template.md` - API documentation
- `templates/changelog-template.md` - Changelog template

## Links to Other Skills

- **ui-ux**: ESSENTIAL. Use this to determine the look and feel of the HTML documentation.
- **content-optimization**: Use to ensure the text is clear and professional.
