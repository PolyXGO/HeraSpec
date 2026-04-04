/**
 * HeraSpec Make Test Command
 * Generates test cases for project features
 */
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { FileSystemUtils } from '../utils/file-system.js';
import { HERASPEC_DIR_NAME, SPECS_DIR_NAME, HERASPEC_MARKERS } from '../core/config.js';

export class MakeTestCommand {
  async execute(projectPath: string = '.', testType: string = 'unit'): Promise<void> {
    const spinner = ora(`Generating ${testType} tests...`).start();

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

      // Determine test directory based on project type (can be customized)
      const testDir = this.getTestDirectory(resolvedPath, testType);

      // Ensure test directory exists
      await FileSystemUtils.createDirectory(testDir);

      // Read project.md if exists
      let projectInfo: { projectType?: string; stack?: string[] } = {};
      if (await FileSystemUtils.fileExists(projectMdPath)) {
        const projectContent = await FileSystemUtils.readFile(projectMdPath);
        projectInfo = this.extractProjectInfo(projectContent);
      }

      // Find all spec files
      const specFiles = await this.findSpecFiles(specsDir);

      if (specFiles.length === 0) {
        spinner.warn('No specs found. Create specs first using "heraspec list --specs".');
        return;
      }

      // Read and parse all specs
      const specs = await this.readSpecs(specFiles);

      // Generate test files
      const testFilesCreated = await this.generateTestFiles(specs, testDir, testType, projectInfo);

      spinner.succeed(`Generated ${testFilesCreated.length} test file(s) in ${testDir}`);
      console.log(chalk.gray(`\nTest type: ${testType}`));
      console.log(chalk.gray(`Specs analyzed: ${specFiles.length}`));
    } catch (error) {
      spinner.fail(`Error: ${(error as Error).message}`);
      process.exitCode = 1;
      throw error;
    }
  }

  /**
   * Get test directory path based on project type and test type
   */
  private getTestDirectory(projectPath: string, testType: string): string {
    // Default test directories
    const testDirs: Record<string, string> = {
      unit: 'tests/unit',
      integration: 'tests/integration',
      e2e: 'tests/e2e',
    };

    const baseDir = testDirs[testType] || 'tests';
    return path.join(projectPath, baseDir);
  }

  /**
   * Extract project information from project.md
   */
  private extractProjectInfo(projectContent: string): { projectType?: string; stack?: string[] } {
    const info: { projectType?: string; stack?: string[] } = {};

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
    // Try to get from first heading
    const headingMatch = content.match(/^#+\s+(.+)$/m);
    if (headingMatch) {
      return headingMatch[1].trim();
    }

    // Fallback to filename
    return path.basename(filePath, '.md');
  }

  /**
   * Generate test files from specs
   */
  private async generateTestFiles(
    specs: Array<{ path: string; content: string; name: string }>,
    testDir: string,
    testType: string,
    projectInfo: { projectType?: string; stack?: string[] }
  ): Promise<string[]> {
    const createdFiles: string[] = [];

    for (const spec of specs) {
      const testFileName = this.getTestFileName(spec.name, testType, projectInfo);
      const testFilePath = path.join(testDir, testFileName);

      // Check if file already exists
      if (await FileSystemUtils.fileExists(testFilePath)) {
        console.log(chalk.yellow(`  ℹ Skipping ${path.basename(testFilePath)} - already exists.`));
        continue;
      }

      const testContent = this.generateTestContent(spec, testType, projectInfo);
      await FileSystemUtils.writeFile(testFilePath, testContent);
      createdFiles.push(testFilePath);
    }

    return createdFiles;
  }

  /**
   * Generate test file content
   */
  private generateTestContent(
    spec: { path: string; content: string; name: string },
    testType: string,
    projectInfo: { projectType?: string; stack?: string[] }
  ): string {
    const featureInfo = this.extractFeatureInfo(spec.content);
    const testFramework = this.determineTestFramework(projectInfo);

    const lines: string[] = [];

    // Header comment
    lines.push(`/**`);
    lines.push(` * ${testType.charAt(0).toUpperCase() + testType.slice(1)} tests for: ${spec.name}`);
    lines.push(` * Generated from spec: ${path.basename(spec.path)}`);
    lines.push(` */`);
    lines.push('');

    // Test framework setup
    if (testFramework === 'jest') {
      lines.push(`describe('${spec.name}', () => {`);
      lines.push('  // TODO: Implement test cases based on spec requirements');
      lines.push('');
      if (featureInfo.requirements.length > 0) {
        featureInfo.requirements.forEach((req, index) => {
          lines.push(`  test('should ${req}', () => {`);
          lines.push(`    // Test implementation needed`);
          lines.push(`    expect(true).toBe(true);`);
          lines.push(`  });`);
          if (index < featureInfo.requirements.length - 1) {
            lines.push('');
          }
        });
      }
      lines.push('});');
    } else if (testFramework === 'phpunit') {
      lines.push(`class ${this.toPascalCase(spec.name)}Test extends TestCase`);
      lines.push('{');
      lines.push('    // TODO: Implement test cases based on spec requirements');
      lines.push('');
      if (featureInfo.requirements.length > 0) {
        featureInfo.requirements.forEach((req, index) => {
          lines.push(`    public function test_${this.toSnakeCase(req)}()`);
          lines.push('    {');
          lines.push('        // Test implementation needed');
          lines.push('        $this->assertTrue(true);');
          lines.push('    }');
          if (index < featureInfo.requirements.length - 1) {
            lines.push('');
          }
        });
      }
      lines.push('}');
    } else {
      // Generic test structure
      lines.push(`// ${testType.charAt(0).toUpperCase() + testType.slice(1)} tests for: ${spec.name}`);
      lines.push('');
      lines.push('// TODO: Implement test cases based on spec requirements');
      lines.push('');
      if (featureInfo.requirements.length > 0) {
        featureInfo.requirements.forEach((req) => {
          lines.push(`// Test: ${req}`);
        });
      }
    }

    return lines.join('\n');
  }

  /**
   * Determine test framework based on project info
   */
  private determineTestFramework(projectInfo: { projectType?: string; stack?: string[] }): string {
    if (projectInfo.stack) {
      if (projectInfo.stack.some(s => s.toLowerCase().includes('php'))) {
        return 'phpunit';
      }
      if (projectInfo.stack.some(s => s.toLowerCase().includes('node') || s.toLowerCase().includes('javascript'))) {
        return 'jest';
      }
    }

    // Default to jest for modern projects
    return 'jest';
  }

  /**
   * Get test file name
   */
  private getTestFileName(featureName: string, testType: string, projectInfo: { projectType?: string; stack?: string[] }): string {
    const framework = this.determineTestFramework(projectInfo);
    const baseName = this.toKebabCase(featureName);

    if (framework === 'phpunit') {
      return `${this.toPascalCase(featureName)}Test.php`;
    } else if (framework === 'jest') {
      return `${baseName}.test.js`;
    }

    return `${baseName}.test.js`;
  }

  /**
   * Extract feature info from spec content
   */
  private extractFeatureInfo(content: string): { requirements: string[] } {
    const info: { requirements: string[] } = {
      requirements: [],
    };

    const lines = content.split('\n');
    let inRequirements = false;

    for (const line of lines) {
      const trimmed = line.trim();

      if (trimmed.match(/^##+\s+Requirements?/i)) {
        inRequirements = true;
        continue;
      } else if (trimmed.match(/^##+/) && inRequirements) {
        break;
      }

      if (inRequirements && trimmed.startsWith('-')) {
        const requirement = trimmed.replace(/^-\s*/, '').trim();
        if (requirement) {
          info.requirements.push(requirement);
        }
      }
    }

    return info;
  }

  /**
   * Convert to kebab-case
   */
  private toKebabCase(str: string): string {
    return str
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  /**
   * Convert to PascalCase
   */
  private toPascalCase(str: string): string {
    return str
      .split(/[^a-zA-Z0-9]+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('');
  }

  /**
   * Convert to snake_case
   */
  private toSnakeCase(str: string): string {
    return str
      .replace(/([a-z])([A-Z])/g, '$1_$2')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_|_$/g, '');
  }
}

