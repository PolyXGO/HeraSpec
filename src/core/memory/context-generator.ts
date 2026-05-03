/**
 * HeraSpec Context Generator
 * Generates context markdown for AI agent sessions (complementary approach)
 */
import { MemoryStore } from './memory-store.js';
import { MemorySearch } from './memory-search.js';
import { loadContextConfig } from './context-config.js';
import { OBSERVATION_TYPE_ICONS, estimateTokens } from './memory-types.js';
import type { Observation, SessionSummary, ContextConfig, ObservationType } from './memory-types.js';

export class ContextGenerator {
  private store: MemoryStore;
  private search: MemorySearch;

  constructor(projectPath: string = '.') {
    this.store = new MemoryStore(projectPath);
    this.search = new MemorySearch(this.store);
  }

  /**
   * Generate context markdown for AI agent consumption
   * Writes to heraspec/memory/context.md for on-demand reading
   */
  generateContext(projectPath: string = '.'): string {
    const config = loadContextConfig(projectPath);

    this.store.open();
    try {
      const observations = this.store.getRecentObservations(undefined, config.totalObservationCount);
      const summaries = this.store.getRecentSummaries(undefined, config.sessionCount);

      if (observations.length === 0 && summaries.length === 0) {
        return this.renderEmptyState();
      }

      let architectureObs: Observation | null = null;
      try {
        const db = (this.store as any).getDb();
        const row = db.prepare(`SELECT id FROM observations WHERE type = 'discovery' AND concepts LIKE '%"architecture"%' ORDER BY created_at_epoch DESC LIMIT 1`).get();
        if (row) {
          architectureObs = this.store.getObservationById(row.id);
        }
      } catch (e) { }

      // Filter out ALL architecture observations from recent activity to avoid clutter
      // if the user ran 'heraspec memory index' multiple times.
      const filteredObservations = observations.filter(o => 
        !(o.type === 'discovery' && o.concepts.includes('architecture'))
      );

      return this.buildContextOutput(filteredObservations, summaries, config, architectureObs);
    } finally {
      this.store.close();
    }
  }

  /**
   * Write context to file for agent to read on-demand
   */
  writeContextFile(projectPath: string = '.'): string {
    const context = this.generateContext(projectPath);
    const contextPath = require('path').join(projectPath, 'heraspec', 'memory', 'context.md');

    const fs = require('fs');
    const dir = require('path').dirname(contextPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(contextPath, context, 'utf-8');
    return contextPath;
  }

  // ============ Private ============

  private renderEmptyState(): string {
    return `# HeraSpec Memory Context

> No observations or session summaries recorded yet.
> Memory will build up as you work on this project.
>
> **How it works (complementary approach):**
> - Use \`heraspec memory log\` to record important observations
> - Use \`heraspec memory summarize\` at end of sessions
> - Use \`heraspec memory search\` to check history before implementing features
> - This file updates when you run \`heraspec memory context\`
`;
  }

  private buildContextOutput(
    observations: Observation[],
    summaries: SessionSummary[],
    config: ContextConfig,
    architectureObs: Observation | null = null
  ): string {
    const lines: string[] = [];
    let tokenBudget = config.maxTokens;

    // Header
    lines.push('# HeraSpec Memory Context');
    lines.push('');
    lines.push(`> ${observations.length} observations, ${summaries.length} session summaries`);
    lines.push(`> Generated: ${new Date().toISOString()}`);
    lines.push('');
    tokenBudget -= 30; // header tokens

    // Architecture Map (Pinned at the top if exists)
    if (architectureObs) {
      lines.push('## Project Architecture');
      lines.push('');
      const archBlock = this.renderFullObservation(architectureObs);
      const archTokens = estimateTokens(archBlock);
      
      if (tokenBudget >= archTokens) {
        lines.push(archBlock);
        tokenBudget -= archTokens;
      } else {
        lines.push(`> Architecture map is too large to include. Use \`heraspec memory search --id ${architectureObs.id}\` to view it.\n`);
      }
    }

    // Most recent session summary
    if (config.showLastSummary && summaries.length > 0) {
      const latest = summaries[0];
      const summaryBlock = this.renderSummary(latest);
      const summaryTokens = estimateTokens(summaryBlock);

      if (tokenBudget >= summaryTokens) {
        lines.push(summaryBlock);
        lines.push('');
        tokenBudget -= summaryTokens;
      }
    }

    // Recent observations - full details for most recent N
    const fullObs = observations.slice(0, config.fullObservationCount);
    if (fullObs.length > 0) {
      lines.push('## Recent Activity (Full Details)');
      lines.push('');

      for (const obs of fullObs) {
        const obsBlock = this.renderFullObservation(obs);
        const obsTokens = estimateTokens(obsBlock);

        if (tokenBudget >= obsTokens) {
          lines.push(obsBlock);
          tokenBudget -= obsTokens;
        } else {
          break;
        }
      }
    }

    // Remaining observations - index only (progressive disclosure)
    const indexObs = observations.slice(config.fullObservationCount);
    if (indexObs.length > 0) {
      lines.push('## Earlier Activity (Index)');
      lines.push('');
      lines.push('| ID | Date | Type | Title | Tokens |');
      lines.push('|----|------|------|-------|--------|');

      for (const obs of indexObs) {
        const date = new Date(obs.createdAtEpoch).toLocaleDateString('en-US', {
          month: 'short', day: 'numeric',
        });
        const icon = OBSERVATION_TYPE_ICONS[obs.type] || '📌';
        const tokens = estimateTokens(obs.narrative);
        const row = `| #${obs.id} | ${date} | ${icon} | ${obs.title} | ~${tokens} |`;
        const rowTokens = estimateTokens(row);

        if (tokenBudget >= rowTokens) {
          lines.push(row);
          tokenBudget -= rowTokens;
        } else {
          lines.push(`| ... | | | ${indexObs.length - indexObs.indexOf(obs)} more observations | |`);
          break;
        }
      }

      lines.push('');
      lines.push('> Use `heraspec memory search --id <ID>` to see full details of any observation.');
    }

    // Previous session summaries (compact)
    if (summaries.length > 1) {
      const olderSummaries = summaries.slice(1);
      lines.push('');
      lines.push('## Previous Sessions');
      lines.push('');

      for (const sum of olderSummaries) {
        const date = new Date(sum.createdAtEpoch).toLocaleDateString('en-US', {
          month: 'short', day: 'numeric',
        });
        const compact = `- **${date}**: ${sum.request || 'Untitled'} → ${sum.completed || 'No summary'}`;
        const compactTokens = estimateTokens(compact);

        if (tokenBudget >= compactTokens) {
          lines.push(compact);
          tokenBudget -= compactTokens;
        }
      }
    }

    return lines.join('\n');
  }

  private renderSummary(summary: SessionSummary): string {
    const lines: string[] = [];
    const date = new Date(summary.createdAtEpoch).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    });

    lines.push(`## Last Session (${date})`);
    lines.push('');

    if (summary.request) lines.push(`**Request:** ${summary.request}`);
    if (summary.investigated) lines.push(`**Investigated:** ${summary.investigated}`);
    if (summary.learned) lines.push(`**Learned:** ${summary.learned}`);
    if (summary.completed) lines.push(`**Completed:** ${summary.completed}`);
    if (summary.nextSteps) lines.push(`**Next Steps:** ${summary.nextSteps}`);

    if (summary.filesEdited.length > 0) {
      lines.push(`**Files edited:** ${summary.filesEdited.join(', ')}`);
    }

    return lines.join('\n');
  }

  private renderFullObservation(obs: Observation): string {
    const lines: string[] = [];
    const icon = OBSERVATION_TYPE_ICONS[obs.type] || '📌';
    const time = new Date(obs.createdAtEpoch).toLocaleString('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });

    lines.push(`### ${icon} #${obs.id} — ${obs.title}`);
    lines.push(`*${time} | ${obs.type} | Concepts: ${obs.concepts.join(', ') || 'none'}*`);
    lines.push('');

    if (obs.narrative) {
      lines.push(obs.narrative);
      lines.push('');
    }

    if (obs.filesModified.length > 0) {
      lines.push(`**Files modified:** ${obs.filesModified.join(', ')}`);
    }

    lines.push('---');
    lines.push('');

    return lines.join('\n');
  }
}
