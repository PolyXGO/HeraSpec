/**
 * HeraSpec Show Command
 * Shows a change or spec in readable format
 */
import path from 'path';
import { readFileSync } from 'fs';
import chalk from 'chalk';
import { FileSystemUtils } from '../utils/file-system.js';
import { TaskParser } from '../utils/task-parser.js';
import {
  HERASPEC_DIR_NAME,
  CHANGES_DIR_NAME,
  SPECS_DIR_NAME,
  HERASPEC_MARKERS,
} from '../core/config.js';

export class ShowCommand {
  async execute(itemName?: string): Promise<void> {
    if (!itemName) {
      console.error('Error: Please specify a change or spec name');
      console.log('Usage: heraspec show <change-name>');
      process.exitCode = 1;
      return;
    }

    // Try to find as change first
    const changePath = path.join(
      '.',
      HERASPEC_DIR_NAME,
      CHANGES_DIR_NAME,
      itemName
    );

    if (await FileSystemUtils.fileExists(changePath)) {
      await this.showChange(itemName, changePath);
      return;
    }

    // Try to find as spec
    const specPath = this.findSpecPath(itemName);
    if (specPath && (await FileSystemUtils.fileExists(specPath))) {
      await this.showSpec(specPath);
      return;
    }

    console.error(`Error: Change or spec "${itemName}" not found`);
    process.exitCode = 1;
  }

  private async showChange(changeName: string, changePath: string): Promise<void> {
    console.log(`\n📋 Change: ${changeName}\n`);
    console.log('═'.repeat(60));

    // Show proposal
    const proposalPath = path.join(changePath, HERASPEC_MARKERS.PROPOSAL_MD);
    if (await FileSystemUtils.fileExists(proposalPath)) {
      console.log('\n## Proposal\n');
      const proposal = await FileSystemUtils.readFile(proposalPath);
      console.log(proposal);
    }

    // Show tasks
    const tasksPath = path.join(changePath, HERASPEC_MARKERS.TASKS_MD);
    if (await FileSystemUtils.fileExists(tasksPath)) {
      console.log('\n## Tasks\n');
      const tasks = await FileSystemUtils.readFile(tasksPath);
      console.log(tasks);

      // Show skills used in tasks
      try {
        const parsedTasks = TaskParser.parseTasks(tasksPath);
        if (parsedTasks.skillsUsed.length > 0) {
          console.log('\n## Skills Used in This Change\n');
          for (const skillInfo of parsedTasks.skillsUsed) {
            if (skillInfo.skill) {
              const skillLabel = skillInfo.projectType 
                ? `${skillInfo.projectType}/${skillInfo.skill}`
                : skillInfo.skill;
              console.log(chalk.cyan(`  • ${skillLabel}`));
              console.log(chalk.gray(`    Location: heraspec/skills/${skillInfo.projectType ? skillInfo.projectType + '/' : ''}${skillInfo.skill}/`));
            }
          }
          console.log();
          console.log(chalk.yellow('💡 Tip: Read skill.md files to understand how to implement tasks.'));
          console.log();
        }
      } catch (error) {
        // Ignore parsing errors
      }
    }

    // Show design if exists
    const designPath = path.join(changePath, HERASPEC_MARKERS.DESIGN_MD);
    if (await FileSystemUtils.fileExists(designPath)) {
      console.log('\n## Design\n');
      const design = await FileSystemUtils.readFile(designPath);
      console.log(design);
    }

    // Show delta specs (now in heraspec/specs/<changeName>/ instead of heraspec/changes/<changeName>/specs/)
    const specsPath = path.join(
      '.',
      HERASPEC_DIR_NAME,
      SPECS_DIR_NAME,
      changeName
    );
    if (await FileSystemUtils.fileExists(specsPath)) {
      const deltaSpecs = await this.findDeltaSpecs(specsPath);
      if (deltaSpecs.length > 0) {
        console.log('\n## Delta Specs\n');
        for (const spec of deltaSpecs) {
          console.log(`\n### ${spec.name}\n`);
          const content = await FileSystemUtils.readFile(spec.path);
          console.log(content);
        }
      }
    }

    console.log('\n' + '═'.repeat(60) + '\n');
  }

  private async showSpec(specPath: string): Promise<void> {
    console.log('\n📄 Spec\n');
    console.log('═'.repeat(60));
    const content = await FileSystemUtils.readFile(specPath);
    console.log(content);
    console.log('═'.repeat(60) + '\n');
  }

  private findSpecPath(specName: string): string | null {
    // Try various path formats
    const basePath = path.join('.', HERASPEC_DIR_NAME, SPECS_DIR_NAME);
    const paths = [
      path.join(basePath, `${specName}.md`),
      path.join(basePath, specName, 'spec.md'),
      path.join(basePath, ...specName.split('/'), 'spec.md'),
    ];

    // Return first potential path (caller will check existence)
    return paths[0];
  }

  private async findDeltaSpecs(dir: string, prefix = ''): Promise<Array<{ name: string; path: string }>> {
    const specs: Array<{ name: string; path: string }> = [];
    const entries = await FileSystemUtils.readDirectory(dir);

    for (const entry of entries) {
      const entryPath = path.join(dir, entry);
      const stats = await FileSystemUtils.stat(entryPath);

      if (stats.isDirectory()) {
        const subSpecs = await this.findDeltaSpecs(
          entryPath,
          prefix ? `${prefix}/${entry}` : entry
        );
        specs.push(...subSpecs);
      } else if (entry === 'spec.md' || entry.endsWith('.md')) {
        specs.push({
          name: prefix || 'global',
          path: entryPath,
        });
      }
    }

    return specs;
  }
}

