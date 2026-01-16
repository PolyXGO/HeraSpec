/**
 * HeraSpec Init Command
 * Initializes HeraSpec in a project
 */
import ora from 'ora';
import chalk from 'chalk';
import path from 'path';
import { FileSystemUtils } from '../utils/file-system.js';
import { TemplateManager } from './templates/index.js';
import {
  HERASPEC_DIR_NAME,
  SPECS_DIR_NAME,
  CHANGES_DIR_NAME,
  ARCHIVES_DIR_NAME,
  SKILLS_DIR_NAME,
  HERASPEC_MARKERS,
} from './config.js';

export class InitCommand {
  async execute(targetPath: string = '.'): Promise<void> {
    const resolvedPath = path.resolve(targetPath);
    const heraspecPath = path.join(resolvedPath, HERASPEC_DIR_NAME);

    // Check if already initialized
    const alreadyInitialized = await FileSystemUtils.fileExists(
      path.join(heraspecPath, HERASPEC_MARKERS.PROJECT_MD)
    );

    const spinner = ora({
      text: alreadyInitialized ? 'Updating HeraSpec...' : 'Initializing HeraSpec...',
      color: 'blue',
    }).start();

    try {
      // Create directory structure
      await FileSystemUtils.createDirectory(heraspecPath);
      await FileSystemUtils.createDirectory(path.join(heraspecPath, SPECS_DIR_NAME));
      await FileSystemUtils.createDirectory(path.join(heraspecPath, CHANGES_DIR_NAME));
      await FileSystemUtils.createDirectory(path.join(heraspecPath, ARCHIVES_DIR_NAME));
      await FileSystemUtils.createDirectory(path.join(heraspecPath, SKILLS_DIR_NAME));

      // Create skills README
      const skillsReadmePath = path.join(heraspecPath, SKILLS_DIR_NAME, 'README.md');
      if (!(await FileSystemUtils.fileExists(skillsReadmePath))) {
        const skillsReadme = await this.getSkillsReadmeTemplate();
        await FileSystemUtils.writeFile(skillsReadmePath, skillsReadme);
      }

      // Create UI/UX skill quick reference guide
      const uiuxGuidePath = path.join(heraspecPath, SKILLS_DIR_NAME, 'UI_UX_SKILL_QUICK_REFERENCE.md');
      if (!(await FileSystemUtils.fileExists(uiuxGuidePath))) {
        const uiuxGuide = await this.getUIUXQuickReference();
        await FileSystemUtils.writeFile(uiuxGuidePath, uiuxGuide);
      }

      // Create template files
      await this.createTemplateFiles(heraspecPath, alreadyInitialized);

      // Create or update root AGENTS.heraspec.md (merge Skills section if exists)
      const agentsPath = path.join(resolvedPath, HERASPEC_MARKERS.AGENTS_MD);
      await this.updateAgentsFile(agentsPath, alreadyInitialized);

      // Update related markdown files (README.md, etc.)
      await this.updateRelatedMarkdownFiles(resolvedPath);

      spinner.succeed(
        chalk.green(
          alreadyInitialized
            ? 'HeraSpec updated successfully'
            : 'HeraSpec initialized successfully'
        )
      );

      console.log();
      console.log(chalk.cyan('Next steps:'));
      console.log(
        chalk.gray('1. Review and update heraspec/project.md with your project details')
      );
      console.log(
        chalk.gray('2. Create your first change: "Create a HeraSpec change to..."')
      );
      console.log(
        chalk.gray('3. List changes: heraspec list')
      );
    } catch (error) {
      spinner.fail(chalk.red(`Error: ${(error as Error).message}`));
      throw error;
    }
  }

  private async createTemplateFiles(
    heraspecPath: string,
    skipExisting: boolean
  ): Promise<void> {
    const projectMdPath = path.join(heraspecPath, HERASPEC_MARKERS.PROJECT_MD);
    const configYamlPath = path.join(heraspecPath, HERASPEC_MARKERS.CONFIG_YAML);

    // Create project.md
    if (!(await FileSystemUtils.fileExists(projectMdPath)) || !skipExisting) {
      await FileSystemUtils.writeFile(
        projectMdPath,
        TemplateManager.getProjectTemplate()
      );
    }

    // Create config.yaml
    if (!(await FileSystemUtils.fileExists(configYamlPath)) || !skipExisting) {
      await FileSystemUtils.writeFile(
        configYamlPath,
        TemplateManager.getConfigTemplate()
      );
    }
  }

  private async updateAgentsFile(agentsPath: string, alreadyInitialized: boolean): Promise<void> {
    const skillsSectionMarker = '## Skills System';
    const skillsSectionEndMarker = '**Key rule**: Switch skill.md when switching task groups!';

    if (!alreadyInitialized) {
      // New project: create full template
      await FileSystemUtils.writeFile(
        agentsPath,
        TemplateManager.getAgentsTemplate()
      );
      return;
    }

    // Existing project: merge Skills section
    let existingContent = '';
    if (await FileSystemUtils.fileExists(agentsPath)) {
      existingContent = await FileSystemUtils.readFile(agentsPath);
    }

    // Check if Skills section already exists
    if (existingContent.includes(skillsSectionMarker)) {
      // Update existing Skills section
      const skillsSection = await this.getSkillsSection();
      const updatedContent = this.replaceSkillsSection(existingContent, skillsSection);
      await FileSystemUtils.writeFile(agentsPath, updatedContent);
    } else {
      // Append Skills section before "## Rules" or at the end
      const skillsSection = await this.getSkillsSection();
      const updatedContent = this.appendSkillsSection(existingContent, skillsSection);
      await FileSystemUtils.writeFile(agentsPath, updatedContent);
    }
  }

  private replaceSkillsSection(existingContent: string, newSkillsSection: string): string {
    const startMarker = '## Skills System';
    
    const startIndex = existingContent.indexOf(startMarker);
    if (startIndex === -1) {
      return this.appendSkillsSection(existingContent, newSkillsSection);
    }

    // Find the end of Skills section (before next ## section or end of file)
    // Look for next ## that is not part of Skills section
    let endIndex = existingContent.indexOf('\n## ', startIndex + startMarker.length);
    if (endIndex === -1) {
      // No next section, replace to end of file
      endIndex = existingContent.length;
    }

    // Replace the section
    const before = existingContent.substring(0, startIndex).trimEnd();
    const after = existingContent.substring(endIndex);
    return before + '\n\n' + newSkillsSection + (after.trimStart().startsWith('\n') ? '' : '\n\n') + after;
  }

  private appendSkillsSection(existingContent: string, skillsSection: string): string {
    // Try to insert before "## Rules" section
    const rulesMarker = '\n## Rules\n';
    const rulesIndex = existingContent.indexOf(rulesMarker);
    
    if (rulesIndex !== -1) {
      const before = existingContent.substring(0, rulesIndex).trimEnd();
      const after = existingContent.substring(rulesIndex);
      return before + '\n\n' + skillsSection + '\n\n' + after;
    }

    // If no Rules section, try before any "## Rules" (without newline)
    const rulesMarker2 = '## Rules';
    const rulesIndex2 = existingContent.indexOf(rulesMarker2);
    if (rulesIndex2 !== -1 && rulesIndex2 > 0) {
      const before = existingContent.substring(0, rulesIndex2).trimEnd();
      const after = existingContent.substring(rulesIndex2);
      return before + '\n\n' + skillsSection + '\n\n' + after;
    }

    // If no Rules section, append at the end
    return existingContent.trimEnd() + '\n\n' + skillsSection;
  }


  private async getSkillsSection(): Promise<string> {
    return TemplateManager.getSkillsSection();
  }

  private async getSkillsReadmeTemplate(): Promise<string> {
    return `# Skills Directory

This directory contains reusable skills for HeraSpec projects.

## What Are Skills?

Skills are reusable patterns and workflows that help AI agents implement tasks consistently. Each skill contains:

- **skill.md**: Complete guide on how to use the skill
- **templates/**: Reusable templates
- **scripts/**: Automation scripts
- **examples/**: Good and bad examples

## How Agents Use Skills

When a task has a skill tag:
\`\`\`markdown
## 1. Feature (projectType: perfex-module, skill: module-codebase)
- [ ] Task 1.1
\`\`\`

The agent will:
1. Find skill folder: \`heraspec/skills/perfex-module/module-codebase/\`
2. Read \`skill.md\` to understand process
3. Use templates and scripts from skill folder
4. Follow guidelines in skill.md

## Available Skills

Run \`heraspec skill list\` to see all available skills.

## UI/UX Skill - Creating Full Theme Packages

The **UI/UX skill** is particularly useful for creating complete website themes with multiple pages.

### Quick Start

When you need to create a full website package, use prompts like:

\`\`\`
Tạo gói website đầy đủ cho [PRODUCT_TYPE] với style [STYLE_KEYWORDS].
Sử dụng skill ui-ux với hybrid mode để search design intelligence.
Tạo các trang: home, about, [other pages].
Stack: [html-tailwind/react/nextjs].
Đảm bảo responsive, accessible, consistent design system.
\`\`\`

### Prompt Templates

For detailed prompt examples and templates, see:
- **Example Prompts**: \`heraspec/skills/ui-ux/templates/example-prompt-full-theme.md\`
- **Prompt Templates**: \`heraspec/skills/ui-ux/templates/prompt-template-full-theme.md\`

These templates include:
- Ready-to-use prompts for different website types (E-commerce, SaaS, Service, Blog, Portfolio)
- Step-by-step instructions
- Search command examples
- Best practices

### Search Modes

UI/UX skill supports 3 search modes:
- **BM25 (default)**: Fast keyword-based search, zero dependencies
- **Vector**: Semantic search, ~15-20% better results (requires: \`pip install sentence-transformers scikit-learn\`)
- **Hybrid**: Best of both, ~25% better results (requires: \`pip install sentence-transformers scikit-learn\`)

**Usage:**
\`\`\`bash
# BM25 (default)
python3 heraspec/skills/ui-ux/scripts/search.py "minimalism" --domain style

# Vector (semantic)
python3 heraspec/skills/ui-ux/scripts/search.py "elegant dark theme" --domain style --mode vector

# Hybrid (best)
python3 heraspec/skills/ui-ux/scripts/search.py "modern minimal design" --domain style --mode hybrid
\`\`\`

### Multi-Page Support

Default page set includes:
1. Home
2. About
3. Post Details
4. Category
5. Pricing
6. FAQ
7. Contact
8. Product Category (e-commerce)
9. Product Details (e-commerce)

Search page types:
\`\`\`bash
python3 heraspec/skills/ui-ux/scripts/search.py "home homepage" --domain pages
python3 heraspec/skills/ui-ux/scripts/search.py "pricing plans" --domain pages
\`\`\`

### Adding UI/UX Skill to Your Project

1. Copy skill from HeraSpec core:
   \`\`\`bash
   # Copy UI/UX skill
   cp -r /path/to/HeraSpec/src/core/templates/skills/ui-ux-skill.md heraspec/skills/ui-ux/
   cp -r /path/to/HeraSpec/src/core/templates/skills/scripts heraspec/skills/ui-ux/
   cp -r /path/to/HeraSpec/src/core/templates/skills/data heraspec/skills/ui-ux/
   cp -r /path/to/HeraSpec/src/core/templates/skills/templates heraspec/skills/ui-ux/
   \`\`\`

2. Or use \`heraspec skill add ui-ux\` (if available)

3. Read \`heraspec/skills/ui-ux/ui-ux-skill.md\` for complete documentation

## Creating New Skills

1. Create skill folder structure
2. Write \`skill.md\` following the template
3. Add templates, scripts, examples as needed

See \`docs/SKILLS_STRUCTURE_PROPOSAL.md\` for detailed structure.
`;
  }

  private async getUIUXQuickReference(): Promise<string> {
    return `# UI/UX Skill - Quick Reference Guide

Quick guide for creating prompts to build full theme packages with multiple pages using the ui-ux skill.

## 📋 Basic Prompt Template

\`\`\`
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
\`\`\`

## 🎯 Specific Prompt Examples

### E-Commerce
\`\`\`
Create a complete website package for an online fashion store.

Product type: E-commerce Luxury
Style: elegant, premium, sophisticated
Stack: Next.js with Tailwind CSS
Pages: home, about, product category, product details, cart, checkout, thank you, faq, contact

Use skill ui-ux with hybrid mode. Focus on conversion optimization.
\`\`\`

### SaaS
\`\`\`
Create a complete website package for a project management SaaS platform.

Product type: SaaS (General)
Style: modern, clean, professional
Stack: React with Tailwind CSS
Pages: home, about, pricing, features, faq, contact, login, register, dashboard

Use skill ui-ux with hybrid mode. Ensure professional and trustworthy.
\`\`\`

### Service Business
\`\`\`
Create a complete website package for a healthcare service.

Product type: Beauty & Wellness Service
Style: elegant, minimal, soft, professional
Stack: html-tailwind
Pages: home, about, services, blog listing, post details, category, pricing, faq, contact

Use skill ui-ux with hybrid mode. Focus on trust and credibility.
\`\`\`

## 🔍 Search Modes

### BM25 (Default)
\`\`\`bash
python3 heraspec/skills/ui-ux/scripts/search.py "minimalism" --domain style
\`\`\`
- ✅ Fast, zero dependencies
- ✅ Best for exact keyword matches

### Vector (Semantic)
\`\`\`bash
python3 heraspec/skills/ui-ux/scripts/search.py "elegant dark theme" --domain style --mode vector
\`\`\`
- ✅ Understands meaning and synonyms
- ✅ ~15-20% better results
- ⚠️ Requires: \`pip install sentence-transformers scikit-learn\`

### Hybrid (Best)
\`\`\`bash
python3 heraspec/skills/ui-ux/scripts/search.py "modern minimal design" --domain style --mode hybrid
\`\`\`
- ✅ Combines BM25 + Vector
- ✅ ~25% better results
- ⚠️ Requires: \`pip install sentence-transformers scikit-learn\`

## 📄 Default Page Set

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

## 🔧 Search Page Types

\`\`\`bash
# Home page
python3 heraspec/skills/ui-ux/scripts/search.py "home homepage" --domain pages

# About page
python3 heraspec/skills/ui-ux/scripts/search.py "about company story" --domain pages

# Pricing page
python3 heraspec/skills/ui-ux/scripts/search.py "pricing plans tiers" --domain pages

# E-commerce pages
python3 heraspec/skills/ui-ux/scripts/search.py "product-category shop catalog" --domain pages
python3 heraspec/skills/ui-ux/scripts/search.py "product-detail single-product" --domain pages
\`\`\`

## 📚 Detailed Documentation

After copying UI/UX skill to your project, see:
- \`heraspec/skills/ui-ux/ui-ux-skill.md\` - Complete skill documentation
- \`heraspec/skills/ui-ux/templates/example-prompt-full-theme.md\` - Detailed prompt examples
- \`heraspec/skills/ui-ux/templates/prompt-template-full-theme.md\` - Copy-paste templates

## 💡 Tips

1. **Always mention "skill ui-ux"** - Agent will know to use this skill
2. **Encourage using hybrid mode** - Best results
3. **List all pages clearly** - Agent knows exact scope
4. **Require consistency** - Ensures unified design system
5. **Mention pre-delivery checklist** - Agent will verify before delivering

## 🚀 Quick Start

1. Copy UI/UX skill to project:
   \`\`\`bash
   cp -r /path/to/HeraSpec/src/core/templates/skills/ui-ux-skill.md heraspec/skills/ui-ux/
   cp -r /path/to/HeraSpec/src/core/templates/skills/scripts heraspec/skills/ui-ux/
   cp -r /path/to/HeraSpec/src/core/templates/skills/data heraspec/skills/ui-ux/
   cp -r /path/to/HeraSpec/src/core/templates/skills/templates heraspec/skills/ui-ux/
   \`\`\`

2. Use prompt template from above

3. Agent will automatically:
   - Search design intelligence with skill ui-ux
   - Create shared components
   - Implement each page
   - Verify with checklist
`;
  }

  /**
   * Update related markdown files in the project (README.md, etc.)
   */
  private async updateRelatedMarkdownFiles(projectPath: string): Promise<void> {
    // Update README.md if exists
    const readmePath = path.join(projectPath, 'README.md');
    if (await FileSystemUtils.fileExists(readmePath)) {
      await this.updateReadmeFile(readmePath);
    }
  }

  /**
   * Update README.md with HeraSpec information
   */
  private async updateReadmeFile(readmePath: string): Promise<void> {
    const existingContent = await FileSystemUtils.readFile(readmePath);
    const heraspecSection = this.getHeraSpecReadmeSection();

    // Check if HeraSpec section already exists
    const sectionMarkers = [
      '## HeraSpec',
      '## HeraSpec Development',
      '### HeraSpec',
      '### HeraSpec Development',
      '<!-- HeraSpec Section -->',
    ];

    let hasHeraSpecSection = false;
    let sectionStartIndex = -1;
    let sectionEndIndex = -1;

    for (const marker of sectionMarkers) {
      const index = existingContent.indexOf(marker);
      if (index !== -1) {
        hasHeraSpecSection = true;
        sectionStartIndex = index;
        // Find the end of the section (next ## or end of file)
        sectionEndIndex = existingContent.indexOf('\n## ', index + marker.length);
        if (sectionEndIndex === -1) {
          sectionEndIndex = existingContent.indexOf('\n### ', index + marker.length);
        }
        if (sectionEndIndex === -1) {
          sectionEndIndex = existingContent.length;
        }
        break;
      }
    }

    if (hasHeraSpecSection && sectionStartIndex !== -1) {
      // Update existing section
      const before = existingContent.substring(0, sectionStartIndex).trimEnd();
      const after = existingContent.substring(sectionEndIndex);
      const updatedContent = before + '\n\n' + heraspecSection + (after.trimStart().startsWith('\n') ? '' : '\n\n') + after;
      await FileSystemUtils.writeFile(readmePath, updatedContent);
    } else {
      // Add new section
      // Try to insert before common sections like "## Development", "## Setup", "## Contributing"
      const insertBeforeMarkers = [
        '\n## Development',
        '\n## Setup',
        '\n## Contributing',
        '\n## Installation',
        '\n## Getting Started',
      ];

      let inserted = false;
      for (const marker of insertBeforeMarkers) {
        const index = existingContent.indexOf(marker);
        if (index !== -1) {
          const before = existingContent.substring(0, index).trimEnd();
          const after = existingContent.substring(index);
          const updatedContent = before + '\n\n' + heraspecSection + '\n\n' + after;
          await FileSystemUtils.writeFile(readmePath, updatedContent);
          inserted = true;
          break;
        }
      }

      if (!inserted) {
        // Append at the end
        const updatedContent = existingContent.trimEnd() + '\n\n' + heraspecSection;
        await FileSystemUtils.writeFile(readmePath, updatedContent);
      }
    }
  }

  /**
   * Get HeraSpec section content for README.md
   */
  private getHeraSpecReadmeSection(): string {
    return `<!-- HeraSpec Section -->
## HeraSpec Development

This project uses [HeraSpec](https://github.com/your-org/heraspec) for spec-driven development.

### Quick Start

\`\`\`bash
# Initialize HeraSpec (if not already done)
heraspec init

# List active changes
heraspec list

# View a change
heraspec show <change-name>

# Validate changes
heraspec validate <change-name>
\`\`\`

### Project Structure

- \`heraspec/project.md\` - Project overview and configuration
- \`heraspec/specs/\` - Source of truth specifications
- \`heraspec/changes/\` - Active changes in progress
- \`heraspec/skills/\` - Reusable skills for AI agents
- \`AGENTS.heraspec.md\` - AI agent instructions

### Working with Changes

1. **Create a change**: Ask AI to create a HeraSpec change, or create manually
2. **Refine specs**: Review and update delta specs in \`heraspec/specs/<change-name>/\`
3. **Implement**: Follow tasks in \`heraspec/changes/<change-name>/tasks.md\`
4. **Archive**: Run \`heraspec archive <change-name> --yes\` when complete

### Skills

Add skills to your project:

\`\`\`bash
# List available skills
heraspec skill list

# Add a skill
heraspec skill add ui-ux
heraspec skill add unit-test

# View skill details
heraspec skill show ui-ux
\`\`\`

For more information, see the [HeraSpec documentation](https://github.com/your-org/heraspec/docs).

---

*This section is automatically updated by \`heraspec init\`. Last updated: ${new Date().toISOString().split('T')[0]}*`;
  }
}

