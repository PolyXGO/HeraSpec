/**
 * HeraSpec Restore Command
 * Restores an archived change back to active changes
 */
import path from 'path';
import ora from 'ora';
import chalk from 'chalk';
import { FileSystemUtils } from '../utils/file-system.js';
import {
  HERASPEC_DIR_NAME,
  CHANGES_DIR_NAME,
  ARCHIVES_DIR_NAME,
} from './config.js';

export class RestoreCommand {
  async execute(archiveName?: string, options?: { yes?: boolean }): Promise<void> {
    const archivesDir = path.join(
      '.',
      HERASPEC_DIR_NAME,
      CHANGES_DIR_NAME,
      ARCHIVES_DIR_NAME
    );

    // Check if archives directory exists
    if (!(await FileSystemUtils.fileExists(archivesDir))) {
      console.error('Error: No archives directory found. No archives to restore.');
      process.exitCode = 1;
      return;
    }

    // List available archives if name not provided
    if (!archiveName) {
      const archives = await this.listArchives(archivesDir);
      if (archives.length === 0) {
        console.log('No archived changes found.');
        return;
      }

      console.log('\nAvailable archives:');
      console.log('─'.repeat(60));
      archives.forEach((archive, index) => {
        console.log(`${index + 1}. ${archive}`);
      });
      console.log();
      console.error('Error: Please specify archive name to restore');
      console.log(`Usage: heraspec restore <archive-name>`);
      console.log(`Example: heraspec restore 2025-01-15-add-two-factor-auth`);
      process.exitCode = 1;
      return;
    }

    const archivePath = path.join(archivesDir, archiveName);

    // Check if archive exists
    if (!(await FileSystemUtils.fileExists(archivePath))) {
      console.error(`Error: Archive "${archiveName}" not found`);
      console.log('\nAvailable archives:');
      const archives = await this.listArchives(archivesDir);
      archives.forEach((archive) => {
        console.log(`  - ${archive}`);
      });
      process.exitCode = 1;
      return;
    }

    // Extract change name (remove date prefix)
    const changeName = this.extractChangeName(archiveName);
    const changePath = path.join(
      '.',
      HERASPEC_DIR_NAME,
      CHANGES_DIR_NAME,
      changeName
    );

    // Check if change already exists
    if (await FileSystemUtils.fileExists(changePath)) {
      console.error(`Error: Change "${changeName}" already exists in active changes.`);
      console.log('Please remove or rename the existing change first.');
      process.exitCode = 1;
      return;
    }

    // Confirm if not --yes
    if (!options?.yes) {
      console.log(`\nThis will restore archive "${archiveName}" to active change "${changeName}".`);
      console.log('Note: This will not revert spec changes that were merged during archive.\n');
      console.error('Error: Please use --yes flag to confirm');
      process.exitCode = 1;
      return;
    }

    const spinner = ora({
      text: `Restoring archive "${archiveName}"...`,
      color: 'blue',
    }).start();

    try {
      // Ensure changes directory exists
      const changesDir = path.join(
        '.',
        HERASPEC_DIR_NAME,
        CHANGES_DIR_NAME
      );
      await FileSystemUtils.createDirectory(changesDir);
      
      // Create destination directory first
      await FileSystemUtils.createDirectory(changePath);
      
      // Move archive back to changes directory
      await this.moveArchiveToChanges(archivePath, changePath);

      // Remove archive directory
      await FileSystemUtils.removeDirectory(archivePath, true);

      spinner.succeed(
        chalk.green(`Archive "${archiveName}" restored successfully to "${changeName}"`)
      );
      console.log();
      console.log(chalk.cyan('Note:'));
      console.log(
        chalk.gray(
          'Spec changes that were merged during archive are still in source specs.'
        )
      );
      console.log(
        chalk.gray(
          'You may need to manually review and revert spec changes if needed.'
        )
      );
    } catch (error) {
      spinner.fail(chalk.red(`Error: ${(error as Error).message}`));
      throw error;
    }
  }

  private async listArchives(archivesDir: string): Promise<string[]> {
    const archives: string[] = [];
    const entries = await FileSystemUtils.readDirectory(archivesDir);

    for (const entry of entries) {
      const entryPath = path.join(archivesDir, entry);
      const stats = await FileSystemUtils.stat(entryPath);
      if (stats.isDirectory()) {
        archives.push(entry);
      }
    }

    return archives.sort();
  }

  private extractChangeName(archiveName: string): string {
    // Remove date prefix (YYYY-MM-DD-)
    // Example: "2025-01-15-add-two-factor-auth" -> "add-two-factor-auth"
    const datePattern = /^\d{4}-\d{2}-\d{2}-/;
    return archiveName.replace(datePattern, '');
  }

  private async moveArchiveToChanges(sourcePath: string, destPath: string): Promise<void> {
    const entries = await FileSystemUtils.readDirectory(sourcePath);

    for (const entry of entries) {
      const sourceEntry = path.join(sourcePath, entry);
      const destEntry = path.join(destPath, entry);
      const stats = await FileSystemUtils.stat(sourceEntry);

      if (stats.isDirectory()) {
        await FileSystemUtils.createDirectory(destEntry);
        await this.moveArchiveToChanges(sourceEntry, destEntry);
      } else {
        await FileSystemUtils.moveFile(sourceEntry, destEntry);
      }
    }
  }
}

