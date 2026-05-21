/**
 * HeraSpec Hotfix Command
 * Fast-track shortcut to log a bugfix without full spec workflow
 */
import chalk from 'chalk';
import ora from 'ora';
import { MemoryCommand } from './memory.js';

export class HotfixCommand {
  /**
   * Execute the hotfix command
   */
  async execute(title: string, options: { narrative?: string }, projectPath: string = '.'): Promise<void> {
    if (!title) {
      console.error(chalk.red('Error: A title is required for a hotfix.'));
      console.error(chalk.gray('Example: heraspec hotfix "Fixed login typo" -n "Changed usr to user in auth.ts"'));
      process.exitCode = 1;
      return;
    }

    let narrative = options.narrative;

    // Interactive prompt for narrative if not provided
    if (!narrative) {
      try {
        const { input } = await import('@inquirer/prompts');
        narrative = await input({
          message: 'Describe the fix (narrative):',
          validate: (value) => value.trim().length > 0 || 'Narrative cannot be empty',
        });
      } catch (error) {
        console.log(chalk.gray('Aborted.'));
        process.exitCode = 1;
        return;
      }
    }

    console.log(chalk.cyan(`\n🚑 Applying Hotfix...`));
    
    // We delegate directly to memory log
    const memory = new MemoryCommand();
    await memory.log({
      type: 'bugfix',
      title,
      narrative,
      concepts: 'hotfix', // add a hotfix tag
    }, projectPath);
    
    console.log(chalk.green('\n✅ Hotfix logged to project memory successfully.'));
  }
}
