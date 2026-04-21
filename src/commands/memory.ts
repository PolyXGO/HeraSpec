/**
 * HeraSpec Memory Command
 * CLI commands for project memory management
 */
import chalk from 'chalk';
import ora from 'ora';
import { MemoryStore } from '../core/memory/memory-store.js';
import { MemorySearch } from '../core/memory/memory-search.js';
import { ContextGenerator } from '../core/memory/context-generator.js';
import { OBSERVATION_TYPES, OBSERVATION_TYPE_ICONS, estimateTokens } from '../core/memory/memory-types.js';
import type { ObservationType } from '../core/memory/memory-types.js';
import { analyzeAndRecommend, buildOptimizedConfig } from '../core/memory/config-advisor.js';
import { saveContextConfig } from '../core/memory/context-config.js';
import { FileSystemUtils } from '../utils/file-system.js';
import path from 'path';
import { SPECS_DIR_NAME, CHANGES_DIR_NAME, ARCHIVES_DIR_NAME, HERASPEC_DIR_NAME } from '../core/config.js';

export class MemoryCommand {
  /**
   * heraspec memory log - Record an observation
   */
  async log(options: {
    type: string;
    title: string;
    narrative?: string;
    concepts?: string;
    filesModified?: string;
    filesRead?: string;
    sessionId?: string;
    project?: string;
  }, projectPath: string = '.'): Promise<void> {
    const spinner = ora('Recording observation...').start();

    try {
      // Validate type
      if (!OBSERVATION_TYPES.includes(options.type as ObservationType)) {
        spinner.fail(`Invalid type "${options.type}". Valid types: ${OBSERVATION_TYPES.join(', ')}`);
        process.exitCode = 1;
        return;
      }

      const store = new MemoryStore(projectPath);
      store.open();

      try {
        const obs = store.addObservation({
          type: options.type as ObservationType,
          title: options.title,
          narrative: options.narrative || '',
          concepts: options.concepts ? options.concepts.split(',').map(c => c.trim()) : [],
          filesModified: options.filesModified ? options.filesModified.split(',').map(f => f.trim()) : [],
          filesRead: options.filesRead ? options.filesRead.split(',').map(f => f.trim()) : [],
          sessionId: options.sessionId,
          project: options.project,
        });

        const icon = OBSERVATION_TYPE_ICONS[obs.type] || '📌';
        spinner.succeed(`${icon} Observation #${obs.id} recorded: ${obs.title}`);

        if (obs.concepts.length > 0) {
          console.log(`   Concepts: ${chalk.cyan(obs.concepts.join(', '))}`);
        }
        if (obs.filesModified.length > 0) {
          console.log(`   Files: ${chalk.yellow(obs.filesModified.join(', '))}`);
        }
      } finally {
        store.close();
      }
    } catch (error) {
      spinner.fail(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      process.exitCode = 1;
    }
  }

  /**
   * heraspec memory search - Search observations
   */
  async search(query: string, options: {
    type?: string;
    concepts?: string;
    files?: string;
    limit?: number;
    id?: number;
    project?: string;
  } = {}, projectPath: string = '.'): Promise<void> {
    try {
      const store = new MemoryStore(projectPath);
      store.open();

      try {
        // If --id specified, show full details of that observation
        if (options.id) {
          const obs = store.getObservationById(options.id);
          if (!obs) {
            console.log(chalk.red(`Observation #${options.id} not found.`));
            process.exitCode = 1;
            return;
          }

          const icon = OBSERVATION_TYPE_ICONS[obs.type] || '📌';
          console.log(`\n${icon} Observation #${obs.id} — ${obs.title}`);
          console.log(`${chalk.gray('Type:')} ${obs.type}`);
          console.log(`${chalk.gray('Date:')} ${obs.createdAt}`);
          console.log(`${chalk.gray('Concepts:')} ${obs.concepts.join(', ') || 'none'}`);
          console.log(`${chalk.gray('Session:')} ${obs.sessionId}`);
          if (obs.filesRead.length > 0) {
            console.log(`${chalk.gray('Files read:')} ${obs.filesRead.join(', ')}`);
          }
          if (obs.filesModified.length > 0) {
            console.log(`${chalk.gray('Files modified:')} ${obs.filesModified.join(', ')}`);
          }
          console.log(`${chalk.gray('Tokens:')} ~${estimateTokens(obs.narrative)}`);
          console.log(`\n${obs.narrative || '(no narrative)'}\n`);
          return;
        }

        const search = new MemorySearch(store);
        const results = search.searchObservations({
          query: query || undefined,
          type: options.type as ObservationType | undefined,
          concepts: options.concepts ? options.concepts.split(',').map(c => c.trim()) : undefined,
          files: options.files ? options.files.split(',').map(f => f.trim()) : undefined,
          limit: options.limit || 20,
          project: options.project,
        });

        console.log('\n' + search.formatResultsAsIndex(results, query || undefined));
      } finally {
        store.close();
      }
    } catch (error) {
      console.error(chalk.red(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`));
      process.exitCode = 1;
    }
  }

  /**
   * heraspec memory context - Generate context for AI agent
   */
  async context(options: {
    output?: string;
    maxTokens?: number;
  } = {}, projectPath: string = '.'): Promise<void> {
    const spinner = ora('Generating context...').start();

    try {
      const generator = new ContextGenerator(projectPath);

      if (options.output === 'file') {
        const contextPath = generator.writeContextFile(projectPath);
        spinner.succeed(`Context written to: ${contextPath}`);
      } else {
        spinner.stop();
        const context = generator.generateContext(projectPath);
        console.log(context);
      }
    } catch (error) {
      spinner.fail(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      process.exitCode = 1;
    }
  }

  /**
   * heraspec memory summarize - Create a session summary
   */
  async summarize(options: {
    request: string;
    investigated?: string;
    learned?: string;
    completed?: string;
    nextSteps?: string;
    filesRead?: string;
    filesEdited?: string;
    sessionId?: string;
    project?: string;
  }, projectPath: string = '.'): Promise<void> {
    const spinner = ora('Creating session summary...').start();

    try {
      const store = new MemoryStore(projectPath);
      store.open();

      try {
        const summary = store.addSummary({
          request: options.request,
          investigated: options.investigated || '',
          learned: options.learned || '',
          completed: options.completed || '',
          nextSteps: options.nextSteps || '',
          filesRead: options.filesRead ? options.filesRead.split(',').map(f => f.trim()) : [],
          filesEdited: options.filesEdited ? options.filesEdited.split(',').map(f => f.trim()) : [],
          sessionId: options.sessionId,
          project: options.project,
        });

        spinner.succeed(`🎯 Session summary #${summary.id} created`);
        console.log(`   Request: ${chalk.white(summary.request)}`);
        if (summary.completed) console.log(`   Completed: ${chalk.green(summary.completed)}`);
        if (summary.nextSteps) console.log(`   Next steps: ${chalk.yellow(summary.nextSteps)}`);
      } finally {
        store.close();
      }
    } catch (error) {
      spinner.fail(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      process.exitCode = 1;
    }
  }

  /**
   * heraspec memory status - Show memory statistics
   */
  async status(projectPath: string = '.'): Promise<void> {
    try {
      const store = new MemoryStore(projectPath);
      store.open();

      try {
        const status = store.getStatus();

        console.log('\n📊 HeraSpec Memory Status\n');
        console.log('═'.repeat(50));
        console.log(`  Observations:  ${chalk.cyan(String(status.observationCount))}`);
        console.log(`  Summaries:     ${chalk.cyan(String(status.summaryCount))}`);
        console.log(`  Sessions:      ${chalk.cyan(String(status.sessionCount))}`);
        console.log(`  DB Size:       ${chalk.cyan(this.formatBytes(status.dbSizeBytes))}`);
        console.log(`  Total Tokens:  ${chalk.cyan('~' + status.estimatedTotalTokens)}`);

        if (status.oldestObservation) {
          console.log(`  Oldest:        ${chalk.gray(status.oldestObservation)}`);
          console.log(`  Newest:        ${chalk.gray(status.newestObservation || '')}`);
        }

        if (status.topConcepts.length > 0) {
          console.log('\n  Top Concepts:');
          for (const { concept, count } of status.topConcepts.slice(0, 5)) {
            console.log(`    ${chalk.cyan(concept)} (${count})`);
          }
        }

        if (status.topFiles.length > 0) {
          console.log('\n  Top Files:');
          for (const { file, count } of status.topFiles.slice(0, 5)) {
            console.log(`    ${chalk.yellow(file)} (${count})`);
          }
        }

        console.log('\n' + '═'.repeat(50));

        // Auto-detect and show config recommendations
        const advice = analyzeAndRecommend(status, projectPath);

        const scaleIcons: Record<string, string> = {
          small: '📦', medium: '📊', large: '🏢', enterprise: '🏗️',
        };
        console.log(`\n  Scale:  ${scaleIcons[advice.projectScale] || '📊'} ${advice.projectScale}`);

        if (advice.recommendations.length > 0) {
          console.log(`\n  ${chalk.yellow('⚠️  Config recommendations detected:')}`);          for (const rec of advice.recommendations) {
            if (rec.setting === 'prune') {
              console.log(`    🗑️  ${chalk.gray(rec.reason)}`);
              console.log(`       → ${chalk.cyan(rec.impact)}`);
            } else {
              console.log(`    ${chalk.white(rec.setting)}: ${chalk.red(String(rec.currentValue))} → ${chalk.green(String(rec.recommendedValue))}`);
              console.log(`       ${chalk.gray(rec.reason)}`);
            }
          }
          if (advice.hasChanges) {
            console.log(`\n  💡 Run ${chalk.cyan('heraspec memory optimize')} to apply recommendations.`);
          }
        } else {
          console.log(`\n  ${chalk.green('✅ Config is optimal for current project scale.')}`);
        }

        console.log('\n');
      } finally {
        store.close();
      }
    } catch (error) {
      console.error(chalk.red(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`));
      process.exitCode = 1;
    }
  }

  /**
   * heraspec memory timeline - Show observation timeline
   */
  async timeline(options: {
    limit?: number;
    project?: string;
  } = {}, projectPath: string = '.'): Promise<void> {
    try {
      const store = new MemoryStore(projectPath);
      store.open();

      try {
        const search = new MemorySearch(store);
        const items = search.getTimeline({
          depthBefore: options.limit || 20,
          depthAfter: 0,
          project: options.project,
        });

        console.log('\n' + search.formatTimeline(items));
      } finally {
        store.close();
      }
    } catch (error) {
      console.error(chalk.red(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`));
      process.exitCode = 1;
    }
  }

  /**
   * heraspec memory prune - Delete old observations
   */
  async prune(days: number, options: { project?: string } = {}, projectPath: string = '.'): Promise<void> {
    const spinner = ora(`Pruning observations older than ${days} days...`).start();

    try {
      const store = new MemoryStore(projectPath);
      store.open();

      try {
        const deleted = store.pruneObservations(days, options.project);
        spinner.succeed(`Pruned ${deleted} observation(s) older than ${days} days.`);
      } finally {
        store.close();
      }
    } catch (error) {
      spinner.fail(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      process.exitCode = 1;
    }
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
  }

  /**
   * heraspec memory optimize - Auto-detect and apply optimal config
   */
  async optimize(options: { yes?: boolean } = {}, projectPath: string = '.'): Promise<void> {
    try {
      const store = new MemoryStore(projectPath);
      store.open();

      try {
        const status = store.getStatus();
        const { config: newConfig, advice } = buildOptimizedConfig(status, projectPath);

        const scaleLabels: Record<string, string> = {
          small: '📦 Small (< 50 observations)',
          medium: '📊 Medium (50-500 observations)',
          large: '🏢 Large (500-2000 observations)',
          enterprise: '🏗️ Enterprise (2000+ observations)',
        };

        console.log(`\n🔍 HeraSpec Memory Config Optimizer\n`);
        console.log(`Project scale: ${scaleLabels[advice.projectScale]}`);
        console.log(`Observations: ${status.observationCount} | Summaries: ${status.summaryCount}\n`);

        if (!advice.hasChanges) {
          console.log(chalk.green('✅ Current config is already optimal for your project scale.\n'));
          return;
        }

        console.log('Proposed changes:\n');
        console.log('  ┌─────────────────────────┬──────────┬─────────────┐');
        console.log('  │ Setting                 │ Current  │ Recommended │');
        console.log('  ├─────────────────────────┼──────────┼─────────────┤');

        for (const rec of advice.recommendations) {
          if (rec.setting === 'prune') continue;
          const name = rec.setting.padEnd(23);
          const current = String(rec.currentValue).padEnd(8);
          const recommended = String(rec.recommendedValue).padEnd(11);
          console.log(`  │ ${name} │ ${chalk.red(current)} │ ${chalk.green(recommended)} │`);
        }

        console.log('  └─────────────────────────┴──────────┴─────────────┘\n');

        // Show reasons
        for (const rec of advice.recommendations) {
          if (rec.setting === 'prune') {
            console.log(`  🗑️  ${rec.reason}`);
            console.log(`     → ${chalk.cyan(rec.impact)}\n`);
          } else {
            console.log(`  ${chalk.white(rec.setting)}: ${rec.reason}`);
          }
        }

        // Confirm
        if (options.yes) {
          saveContextConfig(newConfig, projectPath);
          console.log(chalk.green('\n✅ Config updated successfully!'));
          console.log(chalk.gray('   Location: heraspec/memory/config.json\n'));
          return;
        }

        // Interactive confirmation
        const { confirm } = await import('@inquirer/prompts');
        const answer = await confirm({
          message: 'Apply these config changes?',
          default: true,
        });

        if (answer) {
          saveContextConfig(newConfig, projectPath);
          console.log(chalk.green('\n✅ Config updated successfully!'));
          console.log(chalk.gray('   Location: heraspec/memory/config.json\n'));
        } else {
          console.log(chalk.gray('\nNo changes made.\n'));
        }
      } finally {
        store.close();
      }
    } catch (error) {
      console.error(chalk.red(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`));
      process.exitCode = 1;
    }
  }

  /**
   * heraspec memory bootstrap - Import historical specs and archives into memory
   */
  async bootstrap(options: { yes?: boolean } = {}, projectPath: string = '.'): Promise<void> {
    console.log(chalk.cyan('\n🚀 Bootstrapping Project Memory from Historical Specs...\n'));

    const heraspecPath = path.join(projectPath, HERASPEC_DIR_NAME);
    const specsDir = path.join(heraspecPath, SPECS_DIR_NAME);
    const archivesDir = path.join(heraspecPath, ARCHIVES_DIR_NAME);
    const changesDir = path.join(heraspecPath, CHANGES_DIR_NAME);

    // Collect all md files
    const mdFiles: string[] = [];

    const scanDir = async (dirPath: string) => {
      if (!(await FileSystemUtils.fileExists(dirPath))) return;
      const entries = await FileSystemUtils.readDirectory(dirPath);
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry);
        const stat = await FileSystemUtils.stat(fullPath);
        if (stat.isDirectory()) {
          // Inside a change/archive folder, look for specific md files like the spec itself
          const subEntries = await FileSystemUtils.readDirectory(fullPath);
          for (const sub of subEntries) {
            if (sub.endsWith('.md') && sub !== 'tasks.md' && sub !== 'project.md') {
              mdFiles.push(path.join(fullPath, sub));
            }
          }
        } else if (entry.endsWith('.md')) {
          mdFiles.push(fullPath);
        }
      }
    };

    await scanDir(specsDir);
    await scanDir(archivesDir);
    // changesDir usually has the same structure as archives
    await scanDir(changesDir);

    if (mdFiles.length === 0) {
      console.log(chalk.yellow('No historical specs found.'));
      return;
    }

    if (!options.yes) {
      const { confirm } = await import('@inquirer/prompts');
      const answer = await confirm({
        message: `Found ${mdFiles.length} potential spec files. Proceed to extract and inject into memory?`,
        default: true,
      });
      if (!answer) {
        console.log(chalk.gray('Aborted.'));
        return;
      }
    }

    const spinner = ora('Parsing and migrating specs...').start();
    const store = new MemoryStore(projectPath);
    let parsedCount = 0;
    let skippedCount = 0;

    try {
      store.open();
      // To deduplicate we keep track of titles imported in this run or check DB
      const existingTitles = new Set(
        store.getRecentObservations(undefined, 1000).map(o => o.title.toLowerCase())
      );

      for (const filePath of mdFiles) {
        const content = await FileSystemUtils.readFile(filePath);
        const fileName = path.basename(filePath, '.md');

        // Extract Title: First H1 or fallback to filename
        const titleMatch = content.match(/^#\s+(.+)$/m);
        const title = titleMatch ? titleMatch[1].trim() : fileName.replace(/-/g, ' ');

        if (existingTitles.has(title.toLowerCase())) {
          skippedCount++;
          continue;
        }

        // Extract Narrative: Text between ## Goal / ## Context and next ##
        let narrative = '';
        const narrativeMatch = content.match(/##\s+(?:Goal|Context)\s*\n([\s\S]*?)(?=\n##\s|$)/i);
        if (narrativeMatch) {
          narrative = narrativeMatch[1].trim();
        } else {
          // Fallback, use the first paragraph
          const firstParagraph = content.replace(/^#.*\n/, '').trim().split('\n\n')[0];
          narrative = firstParagraph || 'Bootstrapped historical spec.';
        }
        
        if (narrative.length > 500) narrative = narrative.substring(0, 500) + '...';

        // Extract Modified Files: paths matching #### [MODIFY] or [NEW] etc
        const filesModified: string[] = [];
        const fileRegex = /####\s+\[(?:MODIFY|NEW|DELETE)\]\s+(?:\[(.*?)\]|\S+)\s*\((.*?)\)/gi;
        let fmMatch;
        while ((fmMatch = fileRegex.exec(content)) !== null) {
          const fsPath = fmMatch[2]; // url/path part
          // Strip file:/// prefix
          const cleanPath = fsPath.replace(/^file:\/\/\/?/, '');
          filesModified.push(cleanPath);
        }
        
        // Add minimal concept tags
        const concepts = ['legacy', 'bootstrapped'];
        if (filesModified.length > 0) concepts.push('files-modified');

        store.addObservation({
          type: 'feature',
          title: title,
          narrative: narrative,
          concepts: concepts,
          filesModified: filesModified.slice(0, 5), // Keep top 5 to not bloat limit
        });
        
        existingTitles.add(title.toLowerCase());
        parsedCount++;
      }

      spinner.succeed(`Migration complete: ${parsedCount} specs imported, ${skippedCount} skipped (already exist).`);
      console.log(chalk.gray(`\nYou can verify by running: ${chalk.cyan('heraspec memory status')}`));

    } catch (error) {
      spinner.fail(`Metadata extraction failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      process.exitCode = 1;
    } finally {
      store.close();
    }
  }

  /**
   * heraspec memory analytics - Show token usage and economic savings metrics
   */
  async analytics(options: { history?: boolean } = {}, projectPath: string = '.'): Promise<void> {
    try {
      const store = new MemoryStore(projectPath);
      store.open();

      try {
        const stats = store.getAnalytics();

        if (stats.length === 0) {
           console.log(chalk.yellow('\n📊 No memory analytics data found yet.\n'));
           return;
        }

        console.log(chalk.cyan('\n📊 HeraSpec Memory Token Economics\n'));
        console.log(chalk.gray('Comparing estimated token usage: With Memory vs Without Memory.\n'));

        // Output table
        console.log('═'.repeat(105));
        console.log(
          chalk.bold('Project'.padEnd(25)) + 
          chalk.bold('Ops'.padEnd(6)) + 
          chalk.bold('Tokens (With Memory)'.padEnd(22)) + 
          chalk.bold('Tokens (Without)'.padEnd(20)) +
          chalk.bold('Savings'.padEnd(10)) +
          chalk.bold('DB Size'.padEnd(12))
        );
        console.log('─'.repeat(105));

        let overallWith = 0;
        let overallWithout = 0;

        for (const s of stats) {
           overallWith += s.tokensWithMemory;
           overallWithout += s.tokensWithoutMemory;

           const pName = s.project.length > 22 ? s.project.substring(0, 20) + '..' : s.project.padEnd(25);
           const ops = String(s.totalOps).padEnd(6);
           
           // Format numbers
           const withMem = '~' + this.formatNumber(s.tokensWithMemory);
           const withoutMem = '~' + this.formatNumber(s.tokensWithoutMemory);
           const savings = chalk.green('+' + s.savingsPercent.toFixed(0) + '%');
           const dbSize = this.formatBytes(s.dbSizeBytes || 0);

           console.log(`${pName}${ops}${withMem.padEnd(22)}${withoutMem.padEnd(20)}${savings.padEnd(10)}${dbSize}`);
        }
        
        console.log('─'.repeat(105));
        const totalSavingsPct = overallWithout > 0 ? ((overallWithout - overallWith) / overallWithout) * 100 : 0;
        console.log(
          chalk.bold('TOTAL'.padEnd(31)) + 
          chalk.bold(`~${this.formatNumber(overallWith)}`.padEnd(22)) + 
          chalk.bold(`~${this.formatNumber(overallWithout)}`.padEnd(20)) +
          chalk.bold(chalk.green(`+${totalSavingsPct.toFixed(0)}%`.padEnd(10)))
        );
        console.log('═'.repeat(105) + '\n');
        
        // Draw ASCII Chart for top 3
        console.log(chalk.cyan('📈 Top Savings Chart (Tokens Avoided)\n'));
        const MAX_BAR_LEN = 40;
        
        // Scale factor
        const maxSavings = Math.max(...stats.map(s => s.savingsTokens));
        
        for (const s of stats.slice(0, 5)) {
           if (s.savingsTokens <= 0) continue;
           const barLen = Math.ceil((s.savingsTokens / maxSavings) * MAX_BAR_LEN);
           const bar = '█'.repeat(barLen);
           
           console.log(` ${s.project.substring(0, 15).padEnd(16)} | ${chalk.green(bar)} ${chalk.green('+' + this.formatNumber(s.savingsTokens))} tokens`);
        }

        console.log('\n' + chalk.gray('💡 Note: "Tokens Without" assume reading 50k tokens (average codebase context) per operation if memory was absent.') + '\n');

        // History Table if requested
        if (options.history) {
          for (const s of stats) {
            const historyRows = store.getDbHistory(s.project, 13);
            if (historyRows.length === 0) continue;

            console.log(chalk.cyan(`\n🕒 Database Size History: [${s.project}] (Latest 13)`));
            console.log('═'.repeat(60));
            console.log(
              chalk.bold('Date'.padEnd(25)) + 
              chalk.bold('Size'.padEnd(15)) +
              chalk.bold('Delta')
            );
            console.log('─'.repeat(60));

            for (let i = 0; i < historyRows.length; i++) {
              const row = historyRows[i];
              let deltaStr = '-';
              if (i < historyRows.length - 1) {
                const prev = historyRows[i + 1];
                const diff = row.dbSizeBytes - prev.dbSizeBytes;
                if (diff > 0) {
                     deltaStr = chalk.green(`+${this.formatBytes(diff)}`);
                } else if (diff < 0) {
                     deltaStr = chalk.yellow(`-${this.formatBytes(Math.abs(diff))}`);
                }
              }
              const dStr = new Date(row.createdAtEpoch).toLocaleString();
              console.log(`${dStr.padEnd(25)}${this.formatBytes(row.dbSizeBytes).padEnd(15)}${deltaStr}`);
            }
            console.log('═'.repeat(60) + '\n');
          }
        }

      } finally {
        store.close();
      }
    } catch (error) {
      console.error(chalk.red(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`));
      process.exitCode = 1;
    }
  }

  private formatNumber(num: number): string {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return String(Math.floor(num));
  }
}
