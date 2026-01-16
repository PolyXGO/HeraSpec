/**
 * HeraSpec Validate Command
 */
import path from 'path';
import chalk from 'chalk';
import { FileSystemUtils } from '../utils/file-system.js';
import { Validator } from '../core/validation/validator.js';
import { HERASPEC_DIR_NAME, CHANGES_DIR_NAME, SPECS_DIR_NAME } from '../core/config.js';

export class ValidateCommand {
  async execute(itemName?: string, options?: { strict?: boolean }): Promise<void> {
    const validator = new Validator(options?.strict || false);

    if (!itemName) {
      console.error('Error: Please specify a change or spec name');
      console.log('Usage: heraspec validate <change-name>');
      process.exitCode = 1;
      return;
    }

    // Try change first
    const changePath = path.join('.', HERASPEC_DIR_NAME, CHANGES_DIR_NAME, itemName);
    if (await FileSystemUtils.fileExists(changePath)) {
      const report = await validator.validateChange(changePath);
      this.printReport(itemName, report);
      if (!report.valid) {
        process.exitCode = 1;
      }
      return;
    }

    // Try spec
    const specPath = this.findSpecPath(itemName);
    if (specPath && (await FileSystemUtils.fileExists(specPath))) {
      const report = await validator.validateSpec(specPath);
      this.printReport(itemName, report);
      if (!report.valid) {
        process.exitCode = 1;
      }
      return;
    }

    console.error(`Error: Change or spec "${itemName}" not found`);
    process.exitCode = 1;
  }

  private findSpecPath(specName: string): string | null {
    const basePath = path.join('.', HERASPEC_DIR_NAME, SPECS_DIR_NAME);
    return path.join(basePath, `${specName}.md`);
  }

  private printReport(itemName: string, report: any): void {
    console.log(`\nValidation Report: ${itemName}\n`);
    console.log('─'.repeat(60));

    if (report.valid) {
      console.log(chalk.green('✓ Valid'));
    } else {
      console.log(chalk.red('✗ Invalid'));
    }

    if (report.errors && report.errors.length > 0) {
      console.log(chalk.red('\nErrors:'));
      report.errors.forEach((err: any) => {
        console.log(chalk.red(`  • ${err.message || err}`));
        if (err.suggestion) {
          console.log(chalk.gray(`    💡 Suggestion: ${err.suggestion}`));
        }
        if (err.path) {
          console.log(chalk.gray(`    📍 Path: ${err.path}`));
        }
      });
    }

    if (report.warnings && report.warnings.length > 0) {
      console.log(chalk.yellow('\nWarnings:'));
      report.warnings.forEach((warn: any) => {
        console.log(chalk.yellow(`  • ${warn.message || warn}`));
        if (warn.suggestion) {
          console.log(chalk.gray(`    💡 Suggestion: ${warn.suggestion}`));
        }
        if (warn.path) {
          console.log(chalk.gray(`    📍 Path: ${warn.path}`));
        }
      });
    }

    if (report.suggestions && report.suggestions.length > 0) {
      console.log(chalk.cyan('\n💡 Quick Fixes:'));
      report.suggestions.forEach((suggestion: string) => {
        console.log(chalk.cyan(`  • ${suggestion}`));
      });
    }

    // Provide next steps if invalid
    if (!report.valid && report.errors && report.errors.length > 0) {
      console.log(chalk.gray('\n📝 Next Steps:'));
      console.log(chalk.gray('  1. Review errors above'));
      console.log(chalk.gray('  2. Apply suggested fixes'));
      console.log(chalk.gray('  3. Run validation again: heraspec validate ' + itemName));
    }

    console.log('\n' + '─'.repeat(60) + '\n');
  }
}

