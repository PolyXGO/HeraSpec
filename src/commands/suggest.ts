/**
 * HeraSpec Suggest Command
 * Analyzes project and suggests new features
 */
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { FileSystemUtils } from '../utils/file-system.js';
import { HERASPEC_DIR_NAME, SPECS_DIR_NAME, HERASPEC_MARKERS } from '../core/config.js';

export class SuggestCommand {
  async execute(projectPath: string = '.'): Promise<void> {
    const spinner = ora('Analyzing project and generating suggestions...').start();

    try {
      const resolvedPath = path.resolve(projectPath);
      const specsDir = path.join(resolvedPath, HERASPEC_DIR_NAME, SPECS_DIR_NAME);
      const suggestionsDir = path.join(resolvedPath, HERASPEC_DIR_NAME, 'suggestions');
      const projectMdPath = path.join(resolvedPath, HERASPEC_DIR_NAME, HERASPEC_MARKERS.PROJECT_MD);

      // Check if specs directory exists
      if (!(await FileSystemUtils.fileExists(specsDir))) {
        spinner.fail('Specs directory not found. Run "heraspec init" first.');
        process.exitCode = 1;
        return;
      }

      // Ensure suggestions directory exists
      await FileSystemUtils.createDirectory(suggestionsDir);

      // Read project.md if exists
      let projectInfo: { name?: string; projectType?: string; stack?: string[] } = {};
      if (await FileSystemUtils.fileExists(projectMdPath)) {
        const projectContent = await FileSystemUtils.readFile(projectMdPath);
        projectInfo = this.extractProjectInfo(projectContent);
      }

      // Find all spec files
      const specFiles = await this.findSpecFiles(specsDir);

      // Read existing specs
      const specs = specFiles.length > 0 ? await this.readSpecs(specFiles) : [];

      // Generate suggestions
      const suggestions = this.generateSuggestions(specs, projectInfo);

      // Write suggestions file
      const suggestionsFilePath = path.join(suggestionsDir, 'feature-suggestions.md');
      const suggestionsContent = this.formatSuggestions(suggestions, projectInfo);
      await FileSystemUtils.writeFile(suggestionsFilePath, suggestionsContent);

      spinner.succeed(`Feature suggestions generated: ${suggestionsFilePath}`);
      console.log(chalk.gray(`\nFound ${specs.length} existing feature(s)`));
      console.log(chalk.gray(`Generated ${suggestions.length} suggestion(s)`));
    } catch (error) {
      spinner.fail(`Error: ${(error as Error).message}`);
      process.exitCode = 1;
      throw error;
    }
  }

  /**
   * Extract project information from project.md
   */
  private extractProjectInfo(projectContent: string): { name?: string; projectType?: string; stack?: string[] } {
    const info: { name?: string; projectType?: string; stack?: string[] } = {};

    // Extract project name
    const nameMatch = projectContent.match(/^#\s+(.+)$/m);
    if (nameMatch) {
      info.name = nameMatch[1].trim();
    }

    // Extract project type
    const projectTypeMatch = projectContent.match(/project[-\s]type[s]?[:\s]+([^\n]+)/i);
    if (projectTypeMatch) {
      info.projectType = projectTypeMatch[1].trim();
    }

    // Extract tech stack
    const stackMatch = projectContent.match(/tech[-\s]stack[:\s]+([^\n]+)/i);
    if (stackMatch) {
      info.stack = stackMatch[1]
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);
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
    const headingMatch = content.match(/^#+\s+(.+)$/m);
    if (headingMatch) {
      return headingMatch[1].trim();
    }
    return path.basename(filePath, '.md');
  }

  /**
   * Generate feature suggestions based on existing specs
   */
  private generateSuggestions(
    specs: Array<{ path: string; content: string; name: string }>,
    projectInfo: { name?: string; projectType?: string; stack?: string[] }
  ): Array<{ title: string; description: string; category: string; integrationPoints: string[] }> {
    const suggestions: Array<{ title: string; description: string; category: string; integrationPoints: string[] }> = [];

    // Analyze existing features and suggest enhancements
    const existingFeatures = specs.map(s => s.name.toLowerCase());

    // Common suggestion patterns based on project type
    if (projectInfo.projectType?.toLowerCase().includes('plugin') || projectInfo.projectType?.toLowerCase().includes('module')) {
      if (!existingFeatures.some(f => f.includes('settings') || f.includes('config'))) {
        suggestions.push({
          title: 'Settings/Configuration Management',
          description: 'Add a centralized settings management feature to allow users to configure plugin/module behavior.',
          category: 'Configuration',
          integrationPoints: ['Admin interface', 'Database storage'],
        });
      }

      if (!existingFeatures.some(f => f.includes('report') || f.includes('analytics'))) {
        suggestions.push({
          title: 'Reporting and Analytics',
          description: 'Add reporting functionality to track usage, generate analytics, and provide insights.',
          category: 'Analytics',
          integrationPoints: ['Data collection', 'Dashboard'],
        });
      }
    }

    // General suggestions
    if (!existingFeatures.some(f => f.includes('export') || f.includes('import'))) {
      suggestions.push({
        title: 'Data Import/Export',
        description: 'Add functionality to import and export data in various formats (CSV, JSON, XML).',
        category: 'Data Management',
        integrationPoints: ['File handling', 'Data processing'],
      });
    }

    if (!existingFeatures.some(f => f.includes('search') || f.includes('filter'))) {
      suggestions.push({
        title: 'Advanced Search and Filtering',
        description: 'Implement advanced search and filtering capabilities to help users find information quickly.',
        category: 'User Experience',
        integrationPoints: ['Search interface', 'Data indexing'],
      });
    }

    if (!existingFeatures.some(f => f.includes('notification') || f.includes('alert'))) {
      suggestions.push({
        title: 'Notifications and Alerts',
        description: 'Add notification system to alert users about important events and updates.',
        category: 'Communication',
        integrationPoints: ['Event system', 'User preferences'],
      });
    }

    return suggestions;
  }

  /**
   * Format suggestions as markdown
   */
  private formatSuggestions(
    suggestions: Array<{ title: string; description: string; category: string; integrationPoints: string[] }>,
    projectInfo: { name?: string; projectType?: string; stack?: string[] }
  ): string {
    const lines: string[] = [];

    // Header
    lines.push('# Feature Suggestions');
    lines.push('');
    lines.push(`Generated for: ${projectInfo.name || 'Project'}`);
    lines.push(`Project Type: ${projectInfo.projectType || 'Not specified'}`);
    lines.push(`Generated on: ${new Date().toISOString()}`);
    lines.push('');
    lines.push('---');
    lines.push('');

    // Overview
    lines.push('## Overview');
    lines.push('');
    lines.push(`This document contains ${suggestions.length} feature suggestions that could enhance the project.`);
    lines.push('Each suggestion includes integration points and considerations for implementation.');
    lines.push('');
    lines.push('---');
    lines.push('');

    // Group by category
    const byCategory: Record<string, Array<{ title: string; description: string; category: string; integrationPoints: string[] }>> = {};
    suggestions.forEach(suggestion => {
      if (!byCategory[suggestion.category]) {
        byCategory[suggestion.category] = [];
      }
      byCategory[suggestion.category].push(suggestion);
    });

    // Write suggestions by category
    Object.entries(byCategory).forEach(([category, categorySuggestions]) => {
      lines.push(`## ${category}`);
      lines.push('');
      categorySuggestions.forEach((suggestion, index) => {
        lines.push(`### ${index + 1}. ${suggestion.title}`);
        lines.push('');
        lines.push(suggestion.description);
        lines.push('');
        if (suggestion.integrationPoints.length > 0) {
          lines.push('**Integration Points:**');
          lines.push('');
          suggestion.integrationPoints.forEach(point => {
            lines.push(`- ${point}`);
          });
          lines.push('');
        }
        if (index < categorySuggestions.length - 1) {
          lines.push('---');
          lines.push('');
        }
      });
      lines.push('');
    });

    // Footer
    lines.push('---');
    lines.push('');
    lines.push('*These suggestions are generated based on analysis of existing features and common patterns.*');
    lines.push('*Review and prioritize suggestions based on project requirements and goals.*');
    lines.push('');

    return lines.join('\n');
  }
}

