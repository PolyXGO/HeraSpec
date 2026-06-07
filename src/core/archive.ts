/**
 * HeraSpec Archive Command
 * Archives a change and merges delta specs into source specs
 */
import path from 'path';
import ora from 'ora';
import fs from 'fs';
import { createHash } from 'crypto';
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

      // 6. Auto-log to memory
      await this.autoLogToMemory(changeName, archivePath);

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

      // Read fingerprints
      const fingerprintsPath = path.join(changePath, 'fingerprints.json');
      let fingerprints: Record<string, string> = {};
      if (await FileSystemUtils.fileExists(fingerprintsPath)) {
        fingerprints = JSON.parse(await FileSystemUtils.readFile(fingerprintsPath));
      }

      // Validate fingerprints
      const reqs = [...delta.modified, ...delta.removed];
      for (const req of reqs) {
        const hashKey = `${relativePath}:${req.name}`;
        const expectedHash = fingerprints[hashKey];
        if (expectedHash) {
          const currentReqBlock = this.extractRequirementBlock(targetContent, req.name);
          const currentHash = currentReqBlock ? createHash('sha256').update(currentReqBlock).digest('hex') : null;
          
          if (currentHash !== expectedHash) {
            throw new Error(
              `Parallel Merge Conflict: The requirement "${req.name}" in ${relativePath} has been changed by someone else since you started this change.\n` +
              `Please run "heraspec sync ${changeName}" to update your base and resolve the conflict.`
            );
          }
        }
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
    let merged = existingContent || `# Spec: ${specName}\n\n## Purpose\n\n## Requirements\n\n`;

    // Process removed
    if (delta.removed && delta.removed.length > 0) {
      for (const req of delta.removed) {
        merged = this.modifyRequirementBlock(merged, req.name, null);
      }
    }

    // Process modified
    if (delta.modified && delta.modified.length > 0) {
      for (const req of delta.modified) {
        const newBlock = this.stringifyRequirement(req);
        merged = this.modifyRequirementBlock(merged, req.name, newBlock);
      }
    }

    // Add new requirements
    if (delta.added && delta.added.length > 0) {
      for (const req of delta.added) {
        const newBlock = this.stringifyRequirement(req);
        merged += `\n${newBlock}`;
      }
    }

    return merged;
  }

  private modifyRequirementBlock(content: string, reqName: string, newContent: string | null): string {
    const escapedName = reqName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const reqRegex = new RegExp(`###\\s+Requirement:\\s*${escapedName}\\s*\\n([\\s\\S]*?)(?=(?:###\\s+Requirement:|$))`, 'i');
    
    if (newContent === null) {
      return content.replace(reqRegex, '');
    } else {
      if (reqRegex.test(content)) {
        return content.replace(reqRegex, newContent);
      } else {
        return content + '\\n' + newContent;
      }
    }
  }

  private extractRequirementBlock(content: string, reqName: string): string | null {
    const escapedName = reqName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const reqRegex = new RegExp(`###\\s+Requirement:\\s*${escapedName}\\s*\\n([\\s\\S]*?)(?=(?:###\\s+Requirement:|$))`, 'i');
    const match = content.match(reqRegex);
    return match ? match[0].trim() : null;
  }

  private stringifyRequirement(req: any): string {
    let str = `### Requirement: ${req.name}\n${req.description}\n\n`;
    if (req.scenarios && req.scenarios.length > 0) {
      for (const sc of req.scenarios) {
        str += `#### Scenario: ${sc.name}\n`;
        for (const step of sc.steps) {
          str += `- ${step}\n`;
        }
        str += `\n`;
      }
    }
    return str;
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
  private async autoLogToMemory(changeName: string, archivePath: string): Promise<void> {
    try {
      // Check if memory is enabled/initialized
      const memoryDbPath = path.join('.', HERASPEC_DIR_NAME, 'memory', 'heraspec-memory.db');
      if (!(await FileSystemUtils.fileExists(memoryDbPath))) {
        // Memory system not initialized, skip auto-logging silently
        return;
      }

      // Dynamically import MemoryCommand to avoid circular dependencies if any
      const { MemoryCommand } = await import('../commands/memory.js');
      const memoryCmd = new MemoryCommand();

      // Read proposal content if exists
      let narrative = '';
      const proposalPath = path.join(archivePath, 'proposal.md');
      if (await FileSystemUtils.fileExists(proposalPath)) {
        narrative = await FileSystemUtils.readFile(proposalPath);
      }

      // Also grab tasks if available
      const tasksPath = path.join(archivePath, 'tasks.md');
      if (await FileSystemUtils.fileExists(tasksPath)) {
        const tasksContent = await FileSystemUtils.readFile(tasksPath);
        if (narrative) narrative += '\n\n---\n\n';
        narrative += tasksContent;
      }

      // Truncate narrative if too long to prevent token blowout
      const MAX_LENGTH = 10000;
      if (narrative.length > MAX_LENGTH) {
        narrative = narrative.substring(0, MAX_LENGTH) + '\n...[truncated]';
      }

      // We call log silently by capturing console.log temporarily or we can just call it
      // Wait, memoryCmd.log calls spinner.succeed and console.log, which is fine since we want to inform the user
      // But maybe we don't want spinner if we just succeeded. The log method uses its own spinner.
      
      // Call memoryCmd.log
      await memoryCmd.log({
        type: 'feature',
        title: `Archived change: ${changeName}`,
        narrative: narrative || `Auto-archived change: ${changeName}`,
        // We could theoretically set discoveryTokens here, but auto-log uses 0.
        discoveryTokens: '0'
      }, '.');

    } catch (error) {
      // Silently fail if something goes wrong with memory auto-logging
      // We don't want to break the archive process
    }
  }
}

