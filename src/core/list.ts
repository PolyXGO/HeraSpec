/**
 * HeraSpec List Command
 * Lists changes or specs
 */
import path from 'path';
import { FileSystemUtils } from '../utils/file-system.js';
import { HERASPEC_DIR_NAME, CHANGES_DIR_NAME, SPECS_DIR_NAME, ARCHIVES_DIR_NAME } from './config.js';

export class ListCommand {
  async execute(
    targetPath: string = '.',
    mode: 'changes' | 'specs' = 'changes'
  ): Promise<void> {
    const heraspecPath = path.join(targetPath, HERASPEC_DIR_NAME);

    if (mode === 'changes') {
      await this.listChanges(heraspecPath);
    } else {
      await this.listSpecs(heraspecPath);
    }
  }

  private async listChanges(heraspecPath: string): Promise<void> {
    const changesDir = path.join(heraspecPath, CHANGES_DIR_NAME);

    try {
      await FileSystemUtils.stat(changesDir);
    } catch {
      console.log('No HeraSpec changes directory found. Run "heraspec init" first.');
      return;
    }

    const entries = await FileSystemUtils.readDirectory(changesDir);
    const changeDirs: string[] = [];

    for (const entry of entries) {
      const entryPath = path.join(changesDir, entry);
      const stats = await FileSystemUtils.stat(entryPath);
      if (stats.isDirectory() && entry !== ARCHIVES_DIR_NAME) {
        changeDirs.push(entry);
      }
    }

    if (changeDirs.length === 0) {
      console.log('No active changes found.');
      return;
    }

    changeDirs.sort();

    console.log('\nActive changes:');
    console.log('─'.repeat(50));
    for (const change of changeDirs) {
      console.log(`  • ${change}`);
    }
    console.log();
  }

  private async listSpecs(heraspecPath: string): Promise<void> {
    const specsDir = path.join(heraspecPath, SPECS_DIR_NAME);

    try {
      await FileSystemUtils.stat(specsDir);
    } catch {
      console.log('No HeraSpec specs directory found. Run "heraspec init" first.');
      return;
    }

    const specs = await this.findSpecFiles(specsDir, '');

    if (specs.length === 0) {
      console.log('No specs found.');
      return;
    }

    specs.sort();

    console.log('\nSpecs:');
    console.log('─'.repeat(50));
    for (const spec of specs) {
      console.log(`  • ${spec}`);
    }
    console.log();
  }

  private async findSpecFiles(dir: string, prefix: string): Promise<string[]> {
    const specs: string[] = [];
    const entries = await FileSystemUtils.readDirectory(dir);

    for (const entry of entries) {
      const entryPath = path.join(dir, entry);
      const stats = await FileSystemUtils.stat(entryPath);

      if (stats.isDirectory()) {
        const subSpecs = await this.findSpecFiles(
          entryPath,
          prefix ? `${prefix}/${entry}` : entry
        );
        specs.push(...subSpecs);
      } else if (entry === 'spec.md') {
        specs.push(prefix || 'global');
      }
    }

    return specs;
  }
}

