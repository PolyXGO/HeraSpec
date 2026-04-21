/**
 * HeraSpec Memory Search
 * FTS5-based full-text search with progressive disclosure
 */
import type {
  MemorySearchResult,
  SummarySearchResult,
  SearchOptions,
  TimelineItem,
  ObservationType,
} from './memory-types.js';
import { OBSERVATION_TYPE_ICONS, estimateTokens } from './memory-types.js';
import { MemoryStore } from './memory-store.js';

export class MemorySearch {
  private store: MemoryStore;

  constructor(store: MemoryStore) {
    this.store = store;
  }

  /**
   * Search observations using FTS5 full-text search
   * Returns compact index results (Layer 1 of progressive disclosure)
   */
  searchObservations(options: SearchOptions): MemorySearchResult[] {
    const db = this.store.getDb();
    const params: any[] = [];
    let sql: string;

    if (options.query) {
      // FTS5 MATCH query with bm25 ranking
      sql = `
        SELECT o.*, bm25(observations_fts) as rank
        FROM observations o
        JOIN observations_fts fts ON o.id = fts.rowid
        WHERE observations_fts MATCH ?
      `;
      params.push(this.sanitizeFtsQuery(options.query));
    } else {
      sql = 'SELECT *, 0 as rank FROM observations WHERE 1=1';
    }

    // Apply filters
    if (options.project) {
      sql += ' AND o.project = ?';
      params.push(options.project);
    }

    if (options.type) {
      const types = Array.isArray(options.type) ? options.type : [options.type];
      const placeholders = types.map(() => '?').join(',');
      sql += ` AND o.type IN (${placeholders})`;
      params.push(...types);
    }

    if (options.concepts && options.concepts.length > 0) {
      // Search concepts JSON array for any matching concept
      const conceptConditions = options.concepts
        .map(() => `o.concepts LIKE ?`)
        .join(' OR ');
      sql += ` AND (${conceptConditions})`;
      params.push(...options.concepts.map(c => `%"${c}"%`));
    }

    if (options.files && options.files.length > 0) {
      const fileConditions = options.files
        .map(() => `(o.files_modified LIKE ? OR o.files_read LIKE ?)`)
        .join(' OR ');
      sql += ` AND (${fileConditions})`;
      for (const f of options.files) {
        params.push(`%${f}%`, `%${f}%`);
      }
    }

    if (options.dateStart) {
      const epoch = this.parseDate(options.dateStart);
      if (epoch) {
        sql += ' AND o.created_at_epoch >= ?';
        params.push(epoch);
      }
    }

    if (options.dateEnd) {
      const epoch = this.parseDate(options.dateEnd);
      if (epoch) {
        sql += ' AND o.created_at_epoch <= ?';
        params.push(epoch);
      }
    }

    // Order
    if (options.query) {
      sql += ' ORDER BY rank';  // FTS5 bm25 - lower is better
    } else if (options.orderBy === 'date_asc') {
      sql += ' ORDER BY o.created_at_epoch ASC';
    } else {
      sql += ' ORDER BY o.created_at_epoch DESC';
    }

    // Limit & offset
    sql += ' LIMIT ?';
    params.push(options.limit || 20);

    if (options.offset) {
      sql += ' OFFSET ?';
      params.push(options.offset);
    }

    const rows = db.prepare(sql).all(...params);

    return rows.map((row: any) => ({
      id: row.id,
      type: row.type as ObservationType,
      title: row.title,
      narrative: row.narrative || '',
      concepts: this.parseJsonSafe(row.concepts),
      filesModified: this.parseJsonSafe(row.files_modified),
      createdAt: row.created_at,
      createdAtEpoch: row.created_at_epoch,
      rank: row.rank,
      estimatedTokens: estimateTokens(row.narrative),
    }));
  }

  /**
   * Search session summaries using FTS5
   */
  searchSummaries(options: SearchOptions): SummarySearchResult[] {
    const db = this.store.getDb();
    const params: any[] = [];
    let sql: string;

    if (options.query) {
      sql = `
        SELECT s.*, bm25(summaries_fts) as rank
        FROM session_summaries s
        JOIN summaries_fts fts ON s.id = fts.rowid
        WHERE summaries_fts MATCH ?
      `;
      params.push(this.sanitizeFtsQuery(options.query));
    } else {
      sql = 'SELECT *, 0 as rank FROM session_summaries WHERE 1=1';
    }

    if (options.project) {
      sql += ' AND s.project = ?';
      params.push(options.project);
    }

    if (options.dateStart) {
      const epoch = this.parseDate(options.dateStart);
      if (epoch) {
        sql += ' AND s.created_at_epoch >= ?';
        params.push(epoch);
      }
    }

    if (options.dateEnd) {
      const epoch = this.parseDate(options.dateEnd);
      if (epoch) {
        sql += ' AND s.created_at_epoch <= ?';
        params.push(epoch);
      }
    }

    if (options.query) {
      sql += ' ORDER BY rank';
    } else {
      sql += ' ORDER BY s.created_at_epoch DESC';
    }

    sql += ' LIMIT ?';
    params.push(options.limit || 10);

    const rows = db.prepare(sql).all(...params);

    return rows.map((row: any) => ({
      id: row.id,
      sessionId: row.session_id,
      request: row.request || '',
      completed: row.completed || '',
      learned: row.learned || '',
      createdAt: row.created_at,
      createdAtEpoch: row.created_at_epoch,
      rank: row.rank,
      estimatedTokens: estimateTokens(row.request) + estimateTokens(row.completed) + estimateTokens(row.learned),
    }));
  }

  /**
   * Get timeline of observations around a specific point
   */
  getTimeline(options: {
    anchorId?: number;
    anchorEpoch?: number;
    depthBefore?: number;
    depthAfter?: number;
    project?: string;
  }): TimelineItem[] {
    const db = this.store.getDb();
    const depthBefore = options.depthBefore ?? 5;
    const depthAfter = options.depthAfter ?? 5;
    const items: TimelineItem[] = [];
    const params: any[] = [];

    let anchorEpoch = options.anchorEpoch;

    // If anchorId provided, find its epoch
    if (options.anchorId && !anchorEpoch) {
      const obs = db.prepare('SELECT created_at_epoch FROM observations WHERE id = ?').get(options.anchorId);
      if (obs) anchorEpoch = obs.created_at_epoch;
    }

    if (!anchorEpoch) {
      // Default: latest
      anchorEpoch = Date.now();
    }

    // Get observations before anchor
    let sqlBefore = `SELECT * FROM observations WHERE created_at_epoch <= ?`;
    params.length = 0;
    params.push(anchorEpoch);

    if (options.project) {
      sqlBefore += ' AND project = ?';
      params.push(options.project);
    }

    sqlBefore += ` ORDER BY created_at_epoch DESC LIMIT ?`;
    params.push(depthBefore + 1);

    const beforeRows = db.prepare(sqlBefore).all(...params);

    // Get observations after anchor
    params.length = 0;
    let sqlAfter = `SELECT * FROM observations WHERE created_at_epoch > ?`;
    params.push(anchorEpoch);

    if (options.project) {
      sqlAfter += ' AND project = ?';
      params.push(options.project);
    }

    sqlAfter += ` ORDER BY created_at_epoch ASC LIMIT ?`;
    params.push(depthAfter);

    const afterRows = db.prepare(sqlAfter).all(...params);

    // Combine
    const allRows = [...beforeRows.reverse(), ...afterRows];

    for (const row of allRows) {
      items.push({
        type: 'observation',
        id: row.id,
        title: row.title,
        timestamp: row.created_at,
        epoch: row.created_at_epoch,
        icon: OBSERVATION_TYPE_ICONS[row.type as ObservationType] || '📌',
        estimatedTokens: estimateTokens(row.narrative),
      });
    }

    // Also get summaries in the time range
    if (allRows.length > 0) {
      const minEpoch = allRows[0].created_at_epoch;
      const maxEpoch = allRows[allRows.length - 1].created_at_epoch;

      params.length = 0;
      let sqlSum = `SELECT * FROM session_summaries WHERE created_at_epoch >= ? AND created_at_epoch <= ?`;
      params.push(minEpoch, maxEpoch);

      if (options.project) {
        sqlSum += ' AND project = ?';
        params.push(options.project);
      }

      const sumRows = db.prepare(sqlSum).all(...params);

      for (const row of sumRows) {
        items.push({
          type: 'summary',
          id: row.id,
          title: `Session: ${row.request || 'Untitled'}`,
          timestamp: row.created_at,
          epoch: row.created_at_epoch,
          icon: '🎯',
          estimatedTokens: estimateTokens(row.request) + estimateTokens(row.completed),
        });
      }
    }

    // Sort chronologically
    items.sort((a, b) => a.epoch - b.epoch);

    return items;
  }

  /**
   * Format search results as markdown (compact index view)
   */
  formatResultsAsIndex(results: MemorySearchResult[], query?: string): string {
    if (results.length === 0) {
      return query ? `No results found matching "${query}"` : 'No observations found.';
    }

    const lines: string[] = [];
    lines.push(`Found ${results.length} observation(s)${query ? ` matching "${query}"` : ''}:\n`);
    lines.push('| ID | Time | Type | Title | Tokens |');
    lines.push('|----|------|------|-------|--------|');

    for (const r of results) {
      const time = this.formatTime(r.createdAtEpoch);
      const icon = OBSERVATION_TYPE_ICONS[r.type] || '📌';
      lines.push(`| #${r.id} | ${time} | ${icon} | ${r.title} | ~${r.estimatedTokens} |`);
    }

    lines.push('');
    lines.push('Use `heraspec memory search --id <ID>` to see full details.');

    return lines.join('\n');
  }

  /**
   * Format timeline as markdown
   */
  formatTimeline(items: TimelineItem[]): string {
    if (items.length === 0) return 'No timeline data found.';

    const lines: string[] = [];
    lines.push(`# Timeline (${items.length} items)\n`);

    // Group by day
    const byDay = new Map<string, TimelineItem[]>();
    for (const item of items) {
      const day = new Date(item.epoch).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
      });
      if (!byDay.has(day)) byDay.set(day, []);
      byDay.get(day)!.push(item);
    }

    for (const [day, dayItems] of byDay) {
      lines.push(`### ${day}\n`);
      lines.push('| ID | Time | Type | Title | Tokens |');
      lines.push('|----|------|------|-------|--------|');

      for (const item of dayItems) {
        const time = this.formatTime(item.epoch);
        lines.push(`| #${item.id} | ${time} | ${item.icon} | ${item.title} | ~${item.estimatedTokens} |`);
      }
      lines.push('');
    }

    return lines.join('\n');
  }

  // ============ Helpers ============

  /**
   * Sanitize FTS5 query - escape special characters
   */
  private sanitizeFtsQuery(query: string): string {
    // Remove FTS5 special operators that could cause syntax errors
    // Keep simple words for matching
    return query
      .replace(/[*"(){}[\]^~:]/g, ' ')
      .replace(/\b(AND|OR|NOT|NEAR)\b/gi, '')
      .trim()
      .split(/\s+/)
      .filter(w => w.length > 0)
      .map(w => `"${w}"`)
      .join(' OR ');
  }

  private parseJsonSafe(json: string | null): string[] {
    if (!json) return [];
    try {
      const parsed = JSON.parse(json);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private parseDate(input: string): number | null {
    // Try epoch
    const num = Number(input);
    if (!isNaN(num) && num > 1e12) return num;  // Already epoch ms
    if (!isNaN(num) && num > 1e9) return num * 1000;  // Epoch seconds

    // Try ISO date
    const d = new Date(input);
    return isNaN(d.getTime()) ? null : d.getTime();
  }

  private formatTime(epoch: number): string {
    return new Date(epoch).toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit', hour12: true,
    });
  }
}
