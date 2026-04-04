# Skill: Documents (Cross-Cutting & Multi-Format)

## Purpose

This skill is used to create comprehensive documentation for both technical and end-user audiences. It supports parallel generation of Markdown files (for repository/GitHub) and interactive HTML files (for browser-based manuals).

## Core Requirements

### 1. Multi-Format Output
Every documentation task should ideally generate four versions:
- `documentation.txt`: A concise, text-only overview for quick reading and AI context.
- `documentation.md`: High-quality Markdown for version control and GitHub READMEs.
- `documentation.html`: An interactive, premium documentation page with sidebar navigation.
- `documentation-landing-page.html`: A visual, high-end landing page to showcase the project/plugin.

### 2. Dynamic Design (Not Fixed Templates)
- **Do NOT follow a rigid template**: The Agent must **design** the documentation layout and content structure specifically for the project.
- **Synergy with ui-ux**: use of the `ui-ux` skill is **MANDATORY** for `documentation.html` and `documentation-landing-page.html`.

### 3. Standard Quality Structure (Mandatory)
To ensure clarity and completeness, the generated documentation MUST include:

#### A. Interactive Documentation (documentation.html)
1.  **Quick Start**: Clear steps to get running in < 2 minutes.
2.  **System Requirements**: OS, versions, dependencies.
3.  **Installation & Setup**: Detailed step-by-step guide.
4.  **Configuration**: Explanation of all settings (config files, UI settings).
5.  **Core Features**: Deep dive into each component found in `heraspec/specs/`.
6.  **Technical Reference**: (For Devs) API endpoints, Hooks, Filters, Functions.
7.  **Troubleshooting & FAQ**: Common issues and solutions.

#### B. Premium Landing Page (documentation-landing-page.html)
1.  **Hero Section**: High-impact headline and clear sub-headline.
2.  **Value Proposition**: Briefly explain "The Problem" vs "The Solution".
3.  **Feature Showcase**: A visual grid of key benefits with icons/images.
4.  **How It Works**: A simplified 1-2-3 step process of using the project.
5.  **CTA (Call to Action)**: Prominent buttons to "Get Started" or "View Docs".

### 4. Visual Excellence
- Use gradients, smooth animations (fade-in, slide), and premium fonts (e.g., Inter, Montserrat).
- The HTML documentation should feel like a modern SaaS dashboard or a high-end technical manual.

### 4. Project-Wide Scope
When tasked with generating documentation for the entire project:
- **Data Source**: Agent MUST read `heraspec/project.md` and ALL files in `heraspec/specs/`.
- **Synthesis**: Agent must combine information from all components and features into a unified manual.
- **Landing Page**: Should serve as the project homepage, summarizing the main value proposition and key features across all modules.

## Implementation Steps

### Step 1: Intelligence Gathering & Design Planning
1. **Analyze Project**: Scan all relevant `.md` files in the project. Understand the core purpose and technical details.
2. **Enforce UI/UX Dependency**:
   - Check if `heraspec/skills/ui-ux/` exists.
   - If missing: **Execute `heraspec skill add ui-ux`** immediately. Do NOT proceed with HTML generation until this skill is available.
3. **Define Design System**: Consult the `ui-ux` skill to establish a visual language (colors, fonts, animation styles).
4. **Plan Structures**: Outline what needs to go into the `.txt`, `.md`, and `.html` versions.

### Step 2: Constructing Documentation Assets
1. **Compose documentation.txt & .md**: Focus on clarity and technical accuracy.
2. **Develop documentation.html**: Build a split-panel layout (Sidebar + Content). DO NOT just fill a template; **write the HTML/CSS/JS** needed to make it look premium and project-specific.
3. **Design documentation-landing-page.html**: Create a compelling Hero section and feature showcase. Link to the main docs.

## Required Input

- **Project Context**: The name of the plugin/project (e.g., "polyutilities").
- **Specs/Docs**: All existing documentation and specification files.
- **Design Guidelines**: Inputs from the `ui-ux` skill.

## Expected Output (Save to /documentations/)

**CRITICAL**: All files MUST be placed in a `/documentations` folder at the project root. If this folder does not exist, the Agent MUST create it first.

- `/documentations/documentation.txt`: Plain text overview.
- `/documentations/documentation.md`: Markdown version.
- `/documentations/documentation.html`: Interactive split-panel HTML.
- `/documentations/documentation-landing-page.html`: Visual landing page.
- `/documentations/style.css` & `/documentations/landing-style.css`: Custom-generated styles.
- `/documentations/script.js` & `/documentations/landing-script.js`: Interactive logic.

## Tone & Rules

- **Consistent Content**: The core information must be synchronized across all formats.
- **Design Autonomy**: The Agent is responsible for the final aesthetic and structural quality.
- **Visual Impact**: Documentation must WOW the user with its premium feel.

## Reference Templates
These are provided as starting points or inspiration. The Agent should feel free to expand or modify them to suit the project:

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
