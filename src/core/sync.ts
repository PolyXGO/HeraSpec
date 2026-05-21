/**
 * HeraSpec Sync Command
 * Syncs a change with its base source specs (Rebasing)
 */
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { createHash } from 'crypto';
import { FileSystemUtils } from '../utils/file-system.js';
import { MarkdownParser } from './parsers/markdown-parser.js';
import { HERASPEC_DIR_NAME, CHANGES_DIR_NAME, SPECS_DIR_NAME } from './config.js';
import { readFileSync } from 'fs';

export class SyncCommand {
  async execute(changeName?: string): Promise<void> {
    if (!changeName) {
      console.error('Error: Please specify a change name to sync');
      console.log('Usage: heraspec sync <change-name>');
      process.exitCode = 1;
      return;
    }

    const changePath = path.join('.', HERASPEC_DIR_NAME, CHANGES_DIR_NAME, changeName);
    if (!(await FileSystemUtils.fileExists(changePath))) {
      console.error(`Error: Change "${changeName}" not found at ${changePath}`);
      process.exitCode = 1;
      return;
    }

    const spinner = ora(`Syncing fingerprints for "${changeName}"...`).start();

    try {
      const fingerprintsPath = path.join(changePath, 'fingerprints.json');
      let fingerprints: Record<string, string> = {};
      
      if (await FileSystemUtils.fileExists(fingerprintsPath)) {
        fingerprints = JSON.parse(readFileSync(fingerprintsPath, 'utf-8'));
      } else {
        spinner.info(chalk.blue(`No fingerprints.json found for "${changeName}". Run 'heraspec validate ${changeName}' to capture initial fingerprints.`));
        return;
      }

      const specsDir = path.join('.', HERASPEC_DIR_NAME, SPECS_DIR_NAME);
      const deltaSpecsDir = path.join(specsDir, changeName);
      
      if (!(await FileSystemUtils.fileExists(deltaSpecsDir))) {
        spinner.info(chalk.yellow(`No delta specs found for "${changeName}". Nothing to sync.`));
        return;
      }

      const deltaSpecs = await this.findDeltaSpecs(deltaSpecsDir);
      let updatedCount = 0;

      for (const specPath of deltaSpecs) {
        const relativePath = path.relative(path.resolve(deltaSpecsDir), path.resolve(specPath));
        const sourceSpecPath = path.join(path.resolve(specsDir), relativePath);
        
        let sourceContent = '';
        if (await FileSystemUtils.fileExists(sourceSpecPath)) {
          sourceContent = readFileSync(sourceSpecPath, 'utf-8');
        }

        const deltaContent = readFileSync(specPath, 'utf-8');
        const parser = new MarkdownParser(deltaContent);
        const delta = parser.parseDeltaSpec(deltaContent);
        const reqs = [...delta.modified, ...delta.removed];

        for (const req of reqs) {
          const hashKey = `${relativePath}:${req.name}`;
          const expectedHash = fingerprints[hashKey];
          
          if (expectedHash) {
            const currentReqBlock = this.extractRequirementBlock(sourceContent, req.name);
            const currentHash = currentReqBlock ? createHash('sha256').update(currentReqBlock).digest('hex') : null;
            
            if (currentHash && currentHash !== expectedHash) {
              spinner.stop();
              console.log(chalk.yellow(`\n⚠️  Conflict detected for requirement "${req.name}" in ${relativePath}`));
              console.log(chalk.gray(`Source spec was updated after your change started.`));
              
              // Auto-sync by updating the fingerprint
              fingerprints[hashKey] = currentHash;
              updatedCount++;
              
              console.log(chalk.green(`✓ Fingerprint updated. Please review the delta spec to ensure your modifications still apply correctly to the new source.`));
              spinner.start();
            } else if (!currentHash) {
              spinner.stop();
              console.log(chalk.red(`\n❌ Requirement "${req.name}" no longer exists in source spec ${relativePath}!`));
              console.log(chalk.gray(`You should probably remove this requirement from your delta spec.`));
              spinner.start();
            }
          }
        }
      }

      if (updatedCount > 0) {
        await FileSystemUtils.writeFile(fingerprintsPath, JSON.stringify(fingerprints, null, 2));
        spinner.succeed(chalk.green(`Synced ${updatedCount} fingerprint(s) successfully.`));
      } else {
        spinner.succeed(chalk.green('Already up to date. No conflicts detected.'));
      }
    } catch (error) {
      spinner.fail(chalk.red(`Error: ${(error as Error).message}`));
      process.exitCode = 1;
    }
  }

  private async findDeltaSpecs(dir: string): Promise<string[]> {
    const specs: string[] = [];
    const entries = await FileSystemUtils.readDirectory(dir);

    for (const entry of entries) {
      const entryPath = path.join(dir, entry);
      const stats = await FileSystemUtils.stat(entryPath);

      if (stats.isDirectory()) {
        const subSpecs = await this.findDeltaSpecs(entryPath);
        specs.push(...subSpecs);
      } else if (entry.endsWith('.md')) {
        specs.push(entryPath);
      }
    }

    return specs;
  }

  private extractRequirementBlock(content: string, reqName: string): string | null {
    const escapedName = reqName.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\$&');
    const reqRegex = new RegExp(`###\\S+Requirement:\\S*${escapedName}\\S*\\\\n([\\S\\S]*?)(?=(?:###\\S+Requirement:|$))`, 'i');
    const match = content.match(reqRegex);
    return match ? match[0].trim() : null;
  }
}
