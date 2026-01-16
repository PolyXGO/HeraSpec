/**
 * HeraSpec Make Code Command
 * Generates code skeletons from specs
 */
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { FileSystemUtils } from '../utils/file-system.js';
import { HERASPEC_DIR_NAME, SPECS_DIR_NAME, HERASPEC_MARKERS } from '../core/config.js';
import { MarkdownParser } from '../core/parsers/markdown-parser.js';

export class MakeCodeCommand {
  async execute(projectPath: string = '.', specName?: string): Promise<void> {
    const spinner = ora('Generating code from specs...').start();

    try {
      const resolvedPath = path.resolve(projectPath);
      const specsDir = path.join(resolvedPath, HERASPEC_DIR_NAME, SPECS_DIR_NAME);
      const projectMdPath = path.join(resolvedPath, HERASPEC_DIR_NAME, HERASPEC_MARKERS.PROJECT_MD);

      // Check if specs directory exists
      if (!(await FileSystemUtils.fileExists(specsDir))) {
        spinner.fail('Specs directory not found. Run "heraspec init" first.');
        process.exitCode = 1;
        return;
      }

      // Read project.md for context
      let projectInfo: { projectType?: string; stack?: string[] } = {};
      if (await FileSystemUtils.fileExists(projectMdPath)) {
        const projectContent = await FileSystemUtils.readFile(projectMdPath);
        projectInfo = this.extractProjectInfo(projectContent);
      }

      // Find spec files
      let specFiles: string[] = [];
      if (specName) {
        // Find specific spec
        const specPath = this.findSpecPath(specsDir, specName);
        if (specPath && (await FileSystemUtils.fileExists(specPath))) {
          specFiles = [specPath];
        } else {
          spinner.fail(`Spec "${specName}" not found`);
          process.exitCode = 1;
          return;
        }
      } else {
        // Find all specs
        specFiles = await this.findSpecFiles(specsDir);
      }

      if (specFiles.length === 0) {
        spinner.warn('No specs found. Create specs first using "heraspec list --specs".');
        return;
      }

      // Read and parse specs
      const specs = await this.readSpecs(specFiles);

      // Generate code files
      const generatedFiles = await this.generateCodeFiles(specs, resolvedPath, projectInfo);

      spinner.succeed(`Generated ${generatedFiles.length} code file(s)`);
      console.log(chalk.gray(`\nSpecs analyzed: ${specFiles.length}`));
      generatedFiles.forEach((file: string) => {
        console.log(chalk.cyan(`  ✓ ${path.relative(resolvedPath, file)}`));
      });
    } catch (error) {
      spinner.fail(`Error: ${(error as Error).message}`);
      process.exitCode = 1;
      throw error;
    }
  }

  private extractProjectInfo(content: string): { projectType?: string; stack?: string[] } {
    const projectTypeMatch = content.match(/project[-\s]type[s]?[:\s]+([^\n]+)/i);
    const stackMatch = content.match(/tech[-\s]stack[:\s]+([^\n]+)/i);

    return {
      projectType: projectTypeMatch ? projectTypeMatch[1].trim().split(',')[0].trim() : undefined,
      stack: stackMatch ? stackMatch[1].split(',').map(s => s.trim()).filter(Boolean) : undefined,
    };
  }

  private findSpecPath(specsDir: string, specName: string): string | null {
    // Try direct path first
    const directPath = path.join(specsDir, `${specName}.md`);
    // Try nested path
    const nestedPath = path.join(specsDir, specName, 'spec.md');
    return directPath; // Return first option, caller will check existence
  }

  private async findSpecFiles(specsDir: string): Promise<string[]> {
    const specFiles: string[] = [];
    await this.findSpecFilesRecursive(specsDir, specFiles);
    return specFiles.sort();
  }

  private async findSpecFilesRecursive(dir: string, files: string[]): Promise<void> {
    const fs = await import('fs/promises');
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const entryPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        await this.findSpecFilesRecursive(entryPath, files);
      } else if (entry.name.endsWith('.md') && entry.name !== 'README.md') {
        files.push(entryPath);
      }
    }
  }

  private async readSpecs(specFiles: string[]): Promise<Array<{ path: string; content: string; name: string; parsed: any }>> {
    const specs = [];

    for (const specFile of specFiles) {
      const content = await FileSystemUtils.readFile(specFile);
      const parser = new MarkdownParser(content);
      const specName = path.basename(specFile, '.md');

      try {
        const parsed = parser.parseSpec(specName);
        specs.push({
          path: specFile,
          content,
          name: parsed.name,
          parsed,
        });
      } catch (error) {
        console.warn(chalk.yellow(`Warning: Could not parse spec file ${specFile}. Skipping.`));
      }
    }

    return specs;
  }

  private async generateCodeFiles(
    specs: Array<{ path: string; content: string; name: string; parsed: any }>,
    projectPath: string,
    projectInfo: { projectType?: string; stack?: string[] }
  ): Promise<string[]> {
    const generatedFiles: string[] = [];
    const projectType = projectInfo.projectType || 'generic-webapp';

    for (const spec of specs) {
      const codeContent = this.generateCodeContent(spec, projectType, projectInfo);
      const outputPath = this.getOutputPath(projectPath, spec.name, projectType);
      
      // Ensure directory exists
      await FileSystemUtils.createDirectory(path.dirname(outputPath));
      await FileSystemUtils.writeFile(outputPath, codeContent);
      generatedFiles.push(outputPath);
    }

    return generatedFiles;
  }

  private getOutputPath(projectPath: string, specName: string, projectType: string): string {
    // Generate appropriate path based on project type
    const sanitizedName = specName.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    
    if (projectType.includes('wordpress-plugin')) {
      return path.join(projectPath, 'includes', `class-${sanitizedName}.php`);
    } else if (projectType.includes('perfex-module')) {
      return path.join(projectPath, 'modules', sanitizedName, `${sanitizedName}.php`);
    } else if (projectType.includes('laravel')) {
      return path.join(projectPath, 'app', 'Services', `${this.toPascalCase(sanitizedName)}Service.php`);
    } else if (projectType.includes('node')) {
      return path.join(projectPath, 'src', 'services', `${sanitizedName}.js`);
    } else {
      // Generic
      return path.join(projectPath, 'src', `${sanitizedName}.ts`);
    }
  }

  private generateCodeContent(
    spec: { path: string; content: string; name: string; parsed: any },
    projectType: string,
    projectInfo: { projectType?: string; stack?: string[] }
  ): string {
    const lines: string[] = [];
    const className = this.toPascalCase(spec.name.replace(/[^a-zA-Z0-9]/g, ''));

    // Header comment
    lines.push(`/**`);
    lines.push(` * ${spec.name}`);
    lines.push(` * Generated from spec: ${path.basename(spec.path)}`);
    lines.push(` *`);
    lines.push(` * ${spec.parsed.overview || 'Generated code skeleton'}`);
    lines.push(` */`);
    lines.push('');

    if (projectType.includes('wordpress-plugin') || projectType.includes('perfex-module')) {
      // PHP class
      lines.push(`<?php`);
      lines.push('');
      lines.push(`class ${className} {`);
      lines.push('');
      
      // Add methods based on requirements
      spec.parsed.requirements.forEach((req: any) => {
        const methodName = this.toCamelCase(req.name.replace(/[^a-zA-Z0-9]/g, ''));
        lines.push(`  /**`);
        lines.push(`   * ${req.description || req.name}`);
        lines.push(`   */`);
        lines.push(`  public function ${methodName}() {`);
        lines.push(`    // TODO: Implement ${req.name}`);
        lines.push(`  }`);
        lines.push('');
      });
      
      lines.push('}');
    } else if (projectType.includes('laravel')) {
      // PHP Service class
      lines.push(`<?php`);
      lines.push('');
      lines.push(`namespace App\\Services;`);
      lines.push('');
      lines.push(`class ${className}Service {`);
      lines.push('');
      
      spec.parsed.requirements.forEach((req: any) => {
        const methodName = this.toCamelCase(req.name.replace(/[^a-zA-Z0-9]/g, ''));
        lines.push(`  /**`);
        lines.push(`   * ${req.description || req.name}`);
        lines.push(`   */`);
        lines.push(`  public function ${methodName}() {`);
        lines.push(`    // TODO: Implement ${req.name}`);
        lines.push(`  }`);
        lines.push('');
      });
      
      lines.push('}');
    } else if (projectType.includes('node')) {
      // JavaScript/TypeScript
      lines.push(`/**`);
      lines.push(` * ${spec.name} service`);
      lines.push(` */`);
      lines.push('');
      lines.push(`class ${className} {`);
      lines.push('');
      
      spec.parsed.requirements.forEach((req: any) => {
        const methodName = this.toCamelCase(req.name.replace(/[^a-zA-Z0-9]/g, ''));
        lines.push(`  /**`);
        lines.push(`   * ${req.description || req.name}`);
        lines.push(`   */`);
        lines.push(`  ${methodName}() {`);
        lines.push(`    // TODO: Implement ${req.name}`);
        lines.push(`  }`);
        lines.push('');
      });
      
      lines.push('}');
      lines.push('');
      lines.push(`module.exports = ${className};`);
    } else {
      // Generic TypeScript
      lines.push(`export class ${className} {`);
      lines.push('');
      
      spec.parsed.requirements.forEach((req: any) => {
        const methodName = this.toCamelCase(req.name.replace(/[^a-zA-Z0-9]/g, ''));
        lines.push(`  /**`);
        lines.push(`   * ${req.description || req.name}`);
        lines.push(`   */`);
        lines.push(`  ${methodName}(): void {`);
        lines.push(`    // TODO: Implement ${req.name}`);
        lines.push(`  }`);
        lines.push('');
      });
      
      lines.push('}');
    }

    lines.push('');
    lines.push(`// Generated by HeraSpec - Update this file based on implementation requirements`);

    return lines.join('\n');
  }

  private toPascalCase(str: string): string {
    return str
      .replace(/[^a-zA-Z0-9]/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('');
  }

  private toCamelCase(str: string): string {
    const pascal = this.toPascalCase(str);
    return pascal.charAt(0).toLowerCase() + pascal.slice(1);
  }
}
