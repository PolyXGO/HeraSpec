/**
 * HeraSpec Explore Command
 * CLI commands for smart code exploration
 */
import chalk from 'chalk';
import ora from 'ora';
import path from 'path';
import { CodeParser } from '../core/parsers/code-parser.js';
import { FileSystemUtils } from '../utils/file-system.js';

export class ExploreCommand {
  /**
   * heraspec explore outline <file> - Show structural skeleton
   */
  async outline(filePath: string): Promise<void> {
    const spinner = ora(`Analyzing ${filePath}...`).start();

    try {
      const absPath = path.resolve(filePath);

      if (!(await FileSystemUtils.fileExists(absPath))) {
        spinner.fail(`File not found: ${filePath}`);
        process.exitCode = 1;
        return;
      }

      const outline = await CodeParser.outline(absPath);
      spinner.stop();

      console.log('\n' + CodeParser.formatOutline(outline));
      console.log(`\n${chalk.gray(`Total: ${outline.symbols.length} symbols | ~${outline.estimatedTokens} tokens (full file) | Outline: ~${outline.symbols.length * 15} tokens`)}\n`);
    } catch (error) {
      spinner.fail(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      process.exitCode = 1;
    }
  }

  /**
   * heraspec explore search <query> [path] - Search symbols across codebase
   */
  async search(query: string, searchPath: string = '.', options: { limit?: number } = {}): Promise<void> {
    const spinner = ora(`Searching for "${query}" in ${searchPath}...`).start();

    try {
      const absPath = path.resolve(searchPath);
      const results = await CodeParser.search(query, absPath, options.limit || 20);

      spinner.stop();

      if (results.length === 0) {
        console.log(chalk.yellow(`\nNo symbols found matching "${query}" in ${searchPath}\n`));
        return;
      }

      console.log(`\n## Symbol Search: "${query}" (${results.length} results)\n`);
      console.log('| Rel | Type | Name | File | Lines |');
      console.log('|-----|------|------|------|-------|');

      for (const { symbol, relevance } of results) {
        const relPath = path.relative(process.cwd(), symbol.filePath);
        const typeIcons: Record<string, string> = {
          class: '🏛️', interface: '🔷', type: '🔹', enum: '📋',
          function: '⚡', method: '↳', variable: '📌', export: '📤',
        };
        const icon = typeIcons[symbol.type] || '•';
        console.log(`| ${relevance}% | ${icon} ${symbol.type} | ${symbol.name} | ${relPath} | L${symbol.startLine}-${symbol.endLine} |`);
      }

      console.log(`\n${chalk.gray('Use `heraspec explore unfold <file> <symbol>` to see full source.')}\n`);
    } catch (error) {
      spinner.fail(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      process.exitCode = 1;
    }
  }

  /**
   * heraspec explore unfold <file> <symbol> - Show full implementation of a symbol
   */
  async unfold(filePath: string, symbolName: string): Promise<void> {
    const spinner = ora(`Extracting ${symbolName} from ${filePath}...`).start();

    try {
      const absPath = path.resolve(filePath);

      if (!(await FileSystemUtils.fileExists(absPath))) {
        spinner.fail(`File not found: ${filePath}`);
        process.exitCode = 1;
        return;
      }

      const result = await CodeParser.unfold(absPath, symbolName);
      spinner.stop();

      if (!result.symbol) {
        console.log(chalk.yellow(`\nSymbol "${symbolName}" not found in ${filePath}`));
        console.log(chalk.gray('Available symbols:'));

        const outline = await CodeParser.outline(absPath);
        for (const sym of outline.symbols) {
          console.log(`  ${sym.type}: ${sym.name} (L${sym.startLine}-${sym.endLine})`);
        }
        console.log('');
        process.exitCode = 1;
        return;
      }

      const relPath = path.relative(process.cwd(), absPath);
      const outline = await CodeParser.outline(absPath);

      console.log(`\n## ${result.symbol.type}: ${result.symbol.name}`);
      console.log(`*${relPath}:L${result.symbol.startLine}-${result.symbol.endLine} | ~${result.estimatedTokens} tokens (vs ~${outline.estimatedTokens} full file)*\n`);
      console.log('```' + (outline.language || ''));
      console.log(result.source);
      console.log('```\n');
    } catch (error) {
      spinner.fail(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      process.exitCode = 1;
    }
  }
}
