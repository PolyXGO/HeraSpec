/**
 * HeraSpec Archive Command
 * Archives a change and merges delta specs into source specs
 */
import path from 'path';
import ora from 'ora';
import chalk from 'chalk';
import { FileSystemUtils } from '../utils/file-system.js';
import {
  HERASPEC_DIR_NAME,
  CHANGES_DIR_NAME,
  ARCHIVES_DIR_NAME,
  SPECS_DIR_NAME,
} from './config.js';
import { MarkdownParser } from './parsers/markdown-parser.js';

export class ArchiveCommand {
  async execute(changeName?: string, options?: { yes?: boolean }): Promise<void> {
    if (!changeName) {
      console.error('Error: Please specify a change name');
      console.log('Usage: heraspec archive <change-name> [--yes]');
      process.exitCode = 1;
      return;
    }

    const changePath = path.join('.', HERASPEC_DIR_NAME, CHANGES_DIR_NAME, changeName);

    if (!(await FileSystemUtils.fileExists(changePath))) {
      console.error(`Error: Change "${changeName}" not found`);
      process.exitCode = 1;
      return;
    }

    // Confirm if not --yes
    if (!options?.yes) {
      console.log(`\nThis will archive "${changeName}" and merge delta specs into source specs.`);
      console.log('This action cannot be undone.\n');
      // In a real implementation, you'd prompt here
      // For now, we'll require --yes flag
      console.error('Error: Please use --yes flag to confirm');
      process.exitCode = 1;
      return;
    }

    const spinner = ora({
      text: `Archiving change "${changeName}"...`,
      color: 'blue',
    }).start();

    try {
      // 1. Merge delta specs into source specs
      await this.mergeDeltaSpecs(changePath, changeName);

      // 2. Remove specs directory after merge (specs are now in source specs)
      const specsDir = path.join(
        '.',
        HERASPEC_DIR_NAME,
        SPECS_DIR_NAME,
        changeName
      );
      if (await FileSystemUtils.fileExists(specsDir)) {
        await FileSystemUtils.removeDirectory(specsDir, true);
      }

      // 3. Create archive directory with date prefix
      const archiveDir = path.join(
        '.',
        HERASPEC_DIR_NAME,
        CHANGES_DIR_NAME,
        ARCHIVES_DIR_NAME
      );
      await FileSystemUtils.createDirectory(archiveDir);

      const datePrefix = new Date().toISOString().split('T')[0];
      const archivePath = path.join(archiveDir, `${datePrefix}-${changeName}`);

      // 4. Move change to archive
      await FileSystemUtils.createDirectory(archivePath);
      await this.moveChangeToArchive(changePath, archivePath);

      // 5. Remove original change directory
      await FileSystemUtils.removeDirectory(changePath, true);

      spinner.succeed(chalk.green(`Change "${changeName}" archived successfully`));
    } catch (error) {
      spinner.fail(chalk.red(`Error: ${(error as Error).message}`));
      throw error;
    }
  }

  private async mergeDeltaSpecs(changePath: string, changeName: string): Promise<void> {
    // Specs are now in heraspec/specs/<changeName>/ instead of heraspec/changes/<changeName>/specs/
    const deltaSpecsDir = path.join(
      '.',
      HERASPEC_DIR_NAME,
      SPECS_DIR_NAME,
      changeName
    );
    
    if (!(await FileSystemUtils.fileExists(deltaSpecsDir))) {
      return; // No delta specs to merge
    }

    const deltaSpecs = await this.findDeltaSpecFiles(deltaSpecsDir);

    for (const deltaSpec of deltaSpecs) {
      // Calculate relative path from specs/<changeName>/
      const relativePath = path.relative(deltaSpecsDir, deltaSpec.path);
      // Target is in specs/ (source of truth), maintaining the same relative path structure
      const targetSpecPath = path.join(
        '.',
        HERASPEC_DIR_NAME,
        SPECS_DIR_NAME,
        relativePath
      );

      // Read delta spec
      const deltaContent = await FileSystemUtils.readFile(deltaSpec.path);
      const parser = new MarkdownParser(deltaContent);
      const delta = parser.parseDeltaSpec(deltaContent);

      // Read or create target spec
      let targetContent = '';
      if (await FileSystemUtils.fileExists(targetSpecPath)) {
        targetContent = await FileSystemUtils.readFile(targetSpecPath);
      }

      // Merge delta into target
      const mergedContent = this.mergeDeltaIntoSpec(targetContent, delta, deltaSpec.name);

      // Ensure directory exists
      await FileSystemUtils.createDirectory(path.dirname(targetSpecPath));

      // Write merged spec
      await FileSystemUtils.writeFile(targetSpecPath, mergedContent);
    }
  }

  private mergeDeltaIntoSpec(
    existingContent: string,
    delta: { added: any[]; modified: any[]; removed: any[] },
    specName: string
  ): string {
    // Simple merge implementation
    // In a real implementation, this would be more sophisticated
    
    let merged = existingContent || `# Spec: ${specName}\n\n## Purpose\n\n## Requirements\n\n`;

    // Add new requirements
    if (delta.added.length > 0) {
      merged += '\n## ADDED Requirements\n\n';
      for (const req of delta.added) {
        merged += `### Requirement: ${req.name}\n${req.description}\n\n`;
      }
    }

    // Note: Full merge logic would require more sophisticated parsing
    // For now, this is a basic implementation
    
    return merged;
  }

  private async moveChangeToArchive(sourcePath: string, archivePath: string): Promise<void> {
    const entries = await FileSystemUtils.readDirectory(sourcePath);

    for (const entry of entries) {
      const sourceEntry = path.join(sourcePath, entry);
      const archiveEntry = path.join(archivePath, entry);
      const stats = await FileSystemUtils.stat(sourceEntry);

      if (stats.isDirectory()) {
        await FileSystemUtils.createDirectory(archiveEntry);
        await this.moveChangeToArchive(sourceEntry, archiveEntry);
      } else {
        await FileSystemUtils.moveFile(sourceEntry, archiveEntry);
      }
    }
  }

  private async findDeltaSpecFiles(
    dir: string,
    prefix = ''
  ): Promise<Array<{ name: string; path: string }>> {
    const specs: Array<{ name: string; path: string }> = [];
    const entries = await FileSystemUtils.readDirectory(dir);

    for (const entry of entries) {
      const entryPath = path.join(dir, entry);
      const stats = await FileSystemUtils.stat(entryPath);

      if (stats.isDirectory()) {
        const subSpecs = await this.findDeltaSpecFiles(
          entryPath,
          prefix ? `${prefix}/${entry}` : entry
        );
        specs.push(...subSpecs);
      } else if (entry.endsWith('.md')) {
        specs.push({
          name: prefix || path.basename(entry, '.md'),
          path: entryPath,
        });
      }
    }

    return specs;
  }
}

