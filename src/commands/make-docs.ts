/**
 * HeraSpec Make Docs Command
 * Generates user-friendly product documentation from specs
 */
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { FileSystemUtils } from '../utils/file-system.js';
import { HERASPEC_DIR_NAME, SPECS_DIR_NAME, HERASPEC_MARKERS } from '../core/config.js';

export class MakeDocsCommand {
  async execute(projectPath: string = '.', agent: string = 'chatgpt'): Promise<void> {
    const spinner = ora(`Generating product documentation (Agent: ${agent})...`).start();

    try {
      const resolvedPath = path.resolve(projectPath);
      const specsDir = path.join(resolvedPath, HERASPEC_DIR_NAME, SPECS_DIR_NAME);
      const docsDir = path.join(resolvedPath, 'documentations');
      const projectMdPath = path.join(resolvedPath, HERASPEC_DIR_NAME, HERASPEC_MARKERS.PROJECT_MD);

      // Check if specs directory exists
      if (!(await FileSystemUtils.fileExists(specsDir))) {
        spinner.fail('Specs directory not found. Run "heraspec init" first.');
        process.exitCode = 1;
        return;
      }

      // Ensure documentation directory exists
      await FileSystemUtils.createDirectory(docsDir);

      // Read project.md if exists (for context)
      let projectInfo: { name?: string; description?: string } = {};
      if (await FileSystemUtils.fileExists(projectMdPath)) {
        const projectContent = await FileSystemUtils.readFile(projectMdPath);
        projectInfo = this.extractProjectInfo(projectContent);
      }

      // Check for Skills
      const hasDocumentsSkill = await FileSystemUtils.fileExists(path.join(resolvedPath, HERASPEC_DIR_NAME, 'skills', 'documents'));
      const hasUIUXSkill = await FileSystemUtils.fileExists(path.join(resolvedPath, HERASPEC_DIR_NAME, 'skills', 'ui-ux'));

      // Find all spec files
      const specFiles = await this.findSpecFiles(specsDir);

      if (specFiles.length === 0) {
        spinner.warn('No specs found. Create specs first using "heraspec list --specs".');
        return;
      }

      // Read and parse all specs
      const specs = await this.readSpecs(specFiles);

      // Generate user-friendly documentation
      const docContent = this.generateProductDocumentation(specs, projectInfo, agent);

      // Write documentation file
      const docFilePath = path.join(docsDir, 'documentation.txt');
      await FileSystemUtils.writeFile(docFilePath, docContent);

      spinner.succeed(`Basic documentation generated: ${docFilePath}`);

      if (hasDocumentsSkill) {
        console.log(chalk.green.bold('\n✨ Documents Skill Detected!'));
        console.log(chalk.white('AI Agent Instruction:'));
        console.log(chalk.gray('   "Now use the documents skill to generate the full multi-format package:'));
        console.log(chalk.gray('    - Use documentation.txt as context'));
        console.log(chalk.gray('    - Create documentation.md, documentation.html, and landing page'));
        console.log(chalk.gray('    - CRITICAL: Save all files in the /documentations directory (create it if missing)'));
        if (hasUIUXSkill) {
          console.log(chalk.gray('    - Apply premium design from the ui-ux skill standards"'));
        } else {
          console.log(chalk.yellow('    - WARNING: "ui-ux" skill is MISSING but required for HTML/Landing Page.'));
          console.log(chalk.gray('    - Agent must install it first: heraspec skill add ui-ux"'));
        }
      } else {
        console.log(chalk.yellow('\n💡 Tip: Add the "documents" skill for premium HTML & Landing Page support:'));
        console.log(chalk.gray('   heraspec skill add documents'));
      }

      console.log(chalk.gray(`\nFound ${specFiles.length} feature(s)`));
    } catch (error) {
      spinner.fail(`Error: ${(error as Error).message}`);
      process.exitCode = 1;
      throw error;
    }
  }

  /**
   * Extract project information from project.md
   */
  private extractProjectInfo(projectContent: string): { name?: string; description?: string } {
    const info: { name?: string; description?: string } = {};
    
    // Extract project name (usually first heading or after # Project Name)
    const nameMatch = projectContent.match(/^#\s+(.+)$/m);
    if (nameMatch) {
      info.name = nameMatch[1].trim();
    }

    // Extract description (first paragraph after title)
    const lines = projectContent.split('\n');
    let descriptionStart = false;
    const descriptionLines: string[] = [];
    
    for (const line of lines) {
      if (line.startsWith('#') && !descriptionStart) {
        descriptionStart = true;
        continue;
      }
      if (descriptionStart && line.trim() && !line.startsWith('#')) {
        descriptionLines.push(line.trim());
        if (descriptionLines.length >= 3) break; // Get first few lines
      }
    }
    
    if (descriptionLines.length > 0) {
      info.description = descriptionLines.join(' ');
    }

    return info;
  }

  /**
   * Find all spec files recursively
   */
  private async findSpecFiles(specsDir: string): Promise<string[]> {
    const specFiles: string[] = [];
    await this.findSpecFilesRecursive(specsDir, specFiles);
    return specFiles.sort();
  }

  /**
   * Recursively find spec files
   */
  private async findSpecFilesRecursive(dir: string, files: string[]): Promise<void> {
    const fs = await import('fs/promises');
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const entryPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        await this.findSpecFilesRecursive(entryPath, files);
      } else if (entry.name.endsWith('.md')) {
        files.push(entryPath);
      }
    }
  }

  /**
   * Read all spec files
   */
  private async readSpecs(specFiles: string[]): Promise<Array<{ path: string; content: string; name: string }>> {
    const specs = [];

    for (const specFile of specFiles) {
      const content = await FileSystemUtils.readFile(specFile);
      const name = this.extractFeatureName(specFile, content);

      specs.push({
        path: specFile,
        content,
        name,
      });
    }

    return specs;
  }

  /**
   * Extract feature name from spec file
   */
  private extractFeatureName(filePath: string, content: string): string {
    // Try to get from first heading
    const headingMatch = content.match(/^#+\s+(.+)$/m);
    if (headingMatch) {
      return headingMatch[1].trim();
    }
    
    // Fallback to filename
    return path.basename(filePath, '.md')
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Generate product documentation from specs
   */
  private generateProductDocumentation(
    specs: Array<{ path: string; content: string; name: string }>,
    projectInfo: { name?: string; description?: string },
    agent: string = 'chatgpt'
  ): string {
    const lines: string[] = [];

    // Title
    const productName = projectInfo.name || 'Product';
    lines.push(`# ${productName}`);
    lines.push('');

    // Description
    if (projectInfo.description) {
      lines.push(projectInfo.description);
      lines.push('');
    }

    lines.push('---');
    lines.push('');

    // Overview
    lines.push('## Overview');
    lines.push('');
    lines.push(`This product includes ${specs.length} main feature${specs.length > 1 ? 's' : ''}:`);
    lines.push('');
    specs.forEach((spec, index) => {
      lines.push(`${index + 1}. ${spec.name}`);
    });
    lines.push('');
    lines.push('---');
    lines.push('');

    // Features (user-friendly descriptions)
    lines.push('## Features');
    lines.push('');

    specs.forEach((spec, index) => {
      const featureInfo = this.extractFeatureInfo(spec.content);
      
      lines.push(`### ${index + 1}. ${spec.name}`);
      lines.push('');

      // Purpose/Description
      if (featureInfo.description) {
        lines.push(featureInfo.description);
        lines.push('');
      }

      // Key Capabilities
      if (featureInfo.capabilities.length > 0) {
        lines.push('**Key Capabilities:**');
        lines.push('');
        featureInfo.capabilities.forEach(cap => {
          lines.push(`- ${cap}`);
        });
        lines.push('');
      }

      // Use Cases (if any scenarios)
      if (featureInfo.useCases.length > 0) {
        lines.push('**Use Cases:**');
        lines.push('');
        featureInfo.useCases.forEach(useCase => {
          lines.push(`- ${useCase}`);
        });
        lines.push('');
      }

      if (index < specs.length - 1) {
        lines.push('---');
        lines.push('');
      }
    });

    // Footer
    lines.push('');
    lines.push('---');
    lines.push('');
    lines.push(`*This documentation is auto-generated from product specifications using ${agent}.*`);
    lines.push('');

    return lines.join('\n');
  }

  /**
   * Extract user-friendly information from spec content
   */
  private extractFeatureInfo(content: string): {
    description: string;
    capabilities: string[];
    useCases: string[];
  } {
    const info: { description: string; capabilities: string[]; useCases: string[] } = {
      description: '',
      capabilities: [],
      useCases: [],
    };

    const lines = content.split('\n');
    let inPurpose = false;
    let inRequirements = false;
    let inScenarios = false;
    let currentSection = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      // Detect sections
      if (trimmed.match(/^##+\s+Purpose/i)) {
        inPurpose = true;
        inRequirements = false;
        inScenarios = false;
        continue;
      } else if (trimmed.match(/^##+\s+Requirements?/i)) {
        inPurpose = false;
        inRequirements = true;
        inScenarios = false;
        continue;
      } else if (trimmed.match(/^##+\s+Scenarios?/i)) {
        inPurpose = false;
        inRequirements = false;
        inScenarios = true;
        continue;
      } else if (trimmed.match(/^##+/)) {
        // New section, stop current
        inPurpose = false;
        inRequirements = false;
        inScenarios = false;
        continue;
      }

      // Extract Purpose as description
      if (inPurpose && trimmed && !trimmed.startsWith('#')) {
        if (!info.description) {
          info.description = trimmed;
        } else if (info.description.length < 300) {
          info.description += ' ' + trimmed;
        }
      }

      // Extract Requirements as capabilities
      if (inRequirements && trimmed.startsWith('-')) {
        const requirement = trimmed.replace(/^-\s*/, '').trim();
        if (requirement) {
          // Clean up technical terms, make user-friendly
          const userFriendly = this.makeUserFriendly(requirement);
          info.capabilities.push(userFriendly);
        }
      }

      // Extract Scenarios as use cases
      if (inScenarios && trimmed.match(/^[*-]\s*.+:/)) {
        const scenario = trimmed.replace(/^[*-]\s*/, '').split(':')[0].trim();
        if (scenario) {
          const userFriendly = this.makeUserFriendly(scenario);
          info.useCases.push(userFriendly);
        }
      }
    }

    // If no description found, use first paragraph
    if (!info.description) {
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.length > 20) {
          info.description = trimmed;
          break;
        }
      }
    }

    return info;
  }

  /**
   * Make technical text more user-friendly
   */
  private makeUserFriendly(text: string): string {
    // Remove technical markers
    let result = text
      .replace(/\([^)]*\)/g, '') // Remove parentheses
      .replace(/\[([^\]]+)\]/g, '$1') // Convert [text] to text
      .replace(/\{([^}]+)\}/g, '$1') // Convert {text} to text
      .replace(/\b(GET|POST|PUT|DELETE|API|REST|HTTP)\b/gi, '') // Remove API terms
      .replace(/\b(endpoint|route|method|parameter|query|body)\b/gi, '') // Remove technical terms
      .trim();

    // Capitalize first letter
    if (result) {
      result = result.charAt(0).toUpperCase() + result.slice(1);
    }

    // Clean up multiple spaces
    result = result.replace(/\s+/g, ' ');

    return result;
  }
}
