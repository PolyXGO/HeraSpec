/**
 * HeraSpec Memory Store
 * SQLite-based CRUD operations for observations and session summaries
 */
import path from 'path';
import { HERASPEC_DIR_NAME, MEMORY_DIR_NAME } from '../config.js';
import { initializeSchema, needsMigration, runMigrations } from './memory-schema.js';
import type {
  Observation,
  ObservationInput,
  SessionSummary,
  SessionSummaryInput,
  Session,
  MemoryStatus,
  ObservationType,
  ProjectAnalytics,
} from './memory-types.js';
import { estimateTokens } from './memory-types.js';

const DB_FILENAME = 'heraspec-memory.db';

export class MemoryStore {
  private db: any;
  private dbPath: string;
  private hasChanges = false;

  constructor(projectPath: string = '.') {
    this.dbPath = path.join(projectPath, HERASPEC_DIR_NAME, MEMORY_DIR_NAME, DB_FILENAME);
    this.db = null;
  }

  /**
   * Open database connection, init schema if needed
   */
  open(): void {
    if (this.db) return;

    // Dynamic import better-sqlite3 (native module)
    let Database: any;
    try {
      Database = require('better-sqlite3');
    } catch {
      throw new Error(
        'better-sqlite3 is required for HeraSpec memory. Install it with: npm install better-sqlite3'
      );
    }

    // Ensure directory exists
    const dir = path.dirname(this.dbPath);
    const fs = require('fs');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    this.db = new Database(this.dbPath);

    // Initialize or migrate schema
    if (needsMigration(this.db)) {
      runMigrations(this.db);
    }
  }

  /**
   * Close database connection
   */
  close(): void {
    if (this.db) {
      if (this.hasChanges) {
        this.logDbSizeChange();
        this.hasChanges = false;
      }
      this.db.close();
      this.db = null;
    }
  }

  private logDbSizeChange(): void {
    try {
      const project = this.detectProjectName();
      const fs = require('fs');
      if (fs.existsSync(this.dbPath)) {
        // Also account for WAL file if it exists, since it contains unflushed data
        let totalSize = fs.statSync(this.dbPath).size;
        const walPath = this.dbPath + '-wal';
        if (fs.existsSync(walPath)) {
          totalSize += fs.statSync(walPath).size;
        }

        const now = new Date();
        this.db.prepare(`
          INSERT INTO db_history (project, db_size_bytes, created_at, created_at_epoch)
          VALUES (?, ?, ?, ?)
        `).run(project, totalSize, now.toISOString(), now.getTime());
      }
    } catch (e) {
      // fail silently
    }
  }

  /**
   * Get the raw database reference (for advanced queries)
   */
  getDb(): any {
    this.ensureOpen();
    return this.db;
  }

  private ensureOpen(): void {
    if (!this.db) {
      this.open();
    }
  }

  // ============ Observations ============

  /**
   * Add a new observation
   */
  addObservation(input: ObservationInput): Observation {
    this.ensureOpen();

    const now = new Date();
    const sessionId = input.sessionId || this.generateSessionId();
    const project = input.project || this.detectProjectName();

    const stmt = this.db.prepare(`
      INSERT INTO observations (session_id, project, type, title, narrative, concepts, files_read, files_modified, discovery_tokens, embedding, created_at, created_at_epoch)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      sessionId,
      project,
      input.type,
      input.title,
      input.narrative || '',
      JSON.stringify(input.concepts || []),
      JSON.stringify(input.filesRead || []),
      JSON.stringify(input.filesModified || []),
      input.discoveryTokens || 0,
      input.embedding ? JSON.stringify(input.embedding) : null,
      now.toISOString(),
      now.getTime()
    );

    this.hasChanges = true;

    return this.getObservationById(result.lastInsertRowid as number)!;
  }

  /**
   * Get observation by ID
   */
  getObservationById(id: number): Observation | null {
    this.ensureOpen();

    const row = this.db.prepare('SELECT * FROM observations WHERE id = ?').get(id);
    return row ? this.rowToObservation(row) : null;
  }

  /**
   * Get observations by IDs (batch)
   */
  getObservationsByIds(ids: number[]): Observation[] {
    this.ensureOpen();
    if (ids.length === 0) return [];

    const placeholders = ids.map(() => '?').join(',');
    const rows = this.db
      .prepare(`SELECT * FROM observations WHERE id IN (${placeholders}) ORDER BY created_at_epoch DESC`)
      .all(...ids);

    return rows.map((row: any) => this.rowToObservation(row));
  }

  /**
   * Get recent observations for a project
   */
  getRecentObservations(project?: string, limit: number = 50): Observation[] {
    this.ensureOpen();

    let sql = 'SELECT * FROM observations';
    const params: any[] = [];

    if (project) {
      sql += ' WHERE project = ?';
      params.push(project);
    }

    sql += ' ORDER BY created_at_epoch DESC LIMIT ?';
    params.push(limit);

    const rows = this.db.prepare(sql).all(...params);
    return rows.map((row: any) => this.rowToObservation(row));
  }

  /**
   * Delete observations older than N days
   */
  pruneObservations(daysOld: number, project?: string): number {
    this.ensureOpen();

    const cutoffEpoch = Date.now() - daysOld * 24 * 60 * 60 * 1000;
    let sql = 'DELETE FROM observations WHERE created_at_epoch < ?';
    const params: any[] = [cutoffEpoch];

    if (project) {
      sql += ' AND project = ?';
      params.push(project);
    }

    const result = this.db.prepare(sql).run(...params);
    if (result.changes > 0) this.hasChanges = true;
    return result.changes;
  }

  // ============ Session Summaries ============

  /**
   * Add a new session summary
   */
  addSummary(input: SessionSummaryInput): SessionSummary {
    this.ensureOpen();

    const now = new Date();
    const sessionId = input.sessionId || this.generateSessionId();
    const project = input.project || this.detectProjectName();

    const stmt = this.db.prepare(`
      INSERT INTO session_summaries (session_id, project, request, investigated, learned, completed, next_steps, files_read, files_edited, created_at, created_at_epoch)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      sessionId,
      project,
      input.request,
      input.investigated || '',
      input.learned || '',
      input.completed || '',
      input.nextSteps || '',
      JSON.stringify(input.filesRead || []),
      JSON.stringify(input.filesEdited || []),
      now.toISOString(),
      now.getTime()
    );

    this.hasChanges = true;

    return this.getSummaryById(result.lastInsertRowid as number)!;
  }

  /**
   * Get summary by ID
   */
  getSummaryById(id: number): SessionSummary | null {
    this.ensureOpen();

    const row = this.db.prepare('SELECT * FROM session_summaries WHERE id = ?').get(id);
    return row ? this.rowToSummary(row) : null;
  }

  /**
   * Get recent summaries for a project
   */
  getRecentSummaries(project?: string, limit: number = 20): SessionSummary[] {
    this.ensureOpen();

    let sql = 'SELECT * FROM session_summaries';
    const params: any[] = [];

    if (project) {
      sql += ' WHERE project = ?';
      params.push(project);
    }

    sql += ' ORDER BY created_at_epoch DESC LIMIT ?';
    params.push(limit);

    const rows = this.db.prepare(sql).all(...params);
    return rows.map((row: any) => this.rowToSummary(row));
  }

  // ============ Status ============

  /**
   * Get memory status statistics
   */
  getStatus(project?: string): MemoryStatus {
    this.ensureOpen();

    const projectFilter = project ? ' WHERE project = ?' : '';
    const params = project ? [project] : [];

    const obsCount = this.db
      .prepare(`SELECT COUNT(*) as count FROM observations${projectFilter}`)
      .get(...params)?.count || 0;

    const sumCount = this.db
      .prepare(`SELECT COUNT(*) as count FROM session_summaries${projectFilter}`)
      .get(...params)?.count || 0;

    const sessCount = this.db
      .prepare(`SELECT COUNT(*) as count FROM sessions${projectFilter}`)
      .get(...params)?.count || 0;

    const oldest = this.db
      .prepare(`SELECT created_at FROM observations${projectFilter} ORDER BY created_at_epoch ASC LIMIT 1`)
      .get(...params);

    const newest = this.db
      .prepare(`SELECT created_at FROM observations${projectFilter} ORDER BY created_at_epoch DESC LIMIT 1`)
      .get(...params);

    // Top concepts
    const allObs = this.db
      .prepare(`SELECT concepts FROM observations${projectFilter}`)
      .all(...params);

    const conceptCounts: Record<string, number> = {};
    for (const row of allObs) {
      try {
        const concepts = JSON.parse(row.concepts || '[]');
        for (const c of concepts) {
          conceptCounts[c] = (conceptCounts[c] || 0) + 1;
        }
      } catch { /* skip malformed */ }
    }

    const topConcepts = Object.entries(conceptCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([concept, count]) => ({ concept, count }));

    // Top files
    const fileCounts: Record<string, number> = {};
    for (const row of allObs) {
      try {
        const files = JSON.parse(row.files_modified || '[]');
        for (const f of files) {
          fileCounts[f] = (fileCounts[f] || 0) + 1;
        }
      } catch { /* skip malformed */ }
    }

    const topFiles = Object.entries(fileCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([file, count]) => ({ file, count }));

    // Estimate total tokens
    const allNarratives = this.db
      .prepare(`SELECT narrative FROM observations${projectFilter}`)
      .all(...params);
    let totalTokens = 0;
    for (const row of allNarratives) {
      totalTokens += estimateTokens(row.narrative);
    }

    // DB file size
    let dbSizeBytes = 0;
    try {
      const fs = require('fs');
      const stats = fs.statSync(this.dbPath);
      dbSizeBytes = stats.size;
    } catch { /* file might not exist yet */ }

    return {
      observationCount: obsCount,
      summaryCount: sumCount,
      sessionCount: sessCount,
      oldestObservation: oldest?.created_at || null,
      newestObservation: newest?.created_at || null,
      topConcepts,
      topFiles,
      estimatedTotalTokens: totalTokens,
      dbSizeBytes,
    };
  }

  // ============ Analytics ============

  /**
   * Get token saving statistics for all known projects in memory
   */
  getAnalytics(): ProjectAnalytics[] {
    this.ensureOpen();
    
    // Default factor: Cost applied per context read if memory wasn't used ~ 50,000 tokens
    const TOKENS_WITHOUT_MEMORY_PER_OP = 50000;
    // Default factor: Cost of context generation if memory IS used ~ 3,000 tokens
    const CONTEXT_GENERATION_OVERHEAD = 3000; 

    const obsQuery = this.db.prepare(`
      SELECT 
        project, 
        COUNT(*) as obs_count, 
        SUM(discovery_tokens) as total_discovery,
        SUM(length(narrative)) as total_chars
      FROM observations 
      GROUP BY project
    `).all();

    const sumQuery = this.db.prepare(`
      SELECT 
        project, 
        COUNT(*) as sum_count,
        SUM(length(learned) + length(completed)) as total_chars
      FROM session_summaries 
      GROUP BY project
    `).all();

    const projectData = new Map<string, any>();

    for (const row of obsQuery) {
      if (!row.project) continue;
      projectData.set(row.project, {
        ops: row.obs_count,
        discovery: row.total_discovery || 0,
        textChars: row.total_chars || 0
      });
    }

    for (const row of sumQuery) {
      if (!row.project) continue;
      const data = projectData.get(row.project) || { ops: 0, discovery: 0, textChars: 0 };
      data.ops += row.sum_count;
      data.textChars += (row.total_chars || 0);
      projectData.set(row.project, data);
    }

    const results: ProjectAnalytics[] = [];

    for (const [project, data] of projectData.entries()) {
      // Tokens with memory: Actual discovery tokens used + narrative estimate if discovery=0 + context generation overhead
      const contentTokens = data.discovery > 0 ? data.discovery : Math.ceil(data.textChars / 4);
      let tokensWithMemory = contentTokens + (data.ops * CONTEXT_GENERATION_OVERHEAD);

      // Tokens without memory: Imagine re-reading codebase blindly (50k context per session/action)
      let tokensWithoutMemory = data.ops * TOKENS_WITHOUT_MEMORY_PER_OP;

      // Ensure it's not negative or weird
      if (tokensWithoutMemory < tokensWithMemory) {
        tokensWithoutMemory = tokensWithMemory; // Failsafe
      }

      let savingsTokens = tokensWithoutMemory - tokensWithMemory;
      let savingsPercent = tokensWithoutMemory > 0 ? (savingsTokens / tokensWithoutMemory) * 100 : 0;

      let dbSizeBytes = 0;
      try {
        const fs = require('fs');
        if (fs.existsSync(this.dbPath)) {
          dbSizeBytes = fs.statSync(this.dbPath).size;
          const walPath = this.dbPath + '-wal';
          if (fs.existsSync(walPath)) {
            dbSizeBytes += fs.statSync(walPath).size;
          }
        }
      } catch { /* ignore */ }

      results.push({
        project,
        totalOps: data.ops,
        tokensWithMemory,
        tokensWithoutMemory,
        savingsTokens,
        savingsPercent,
        dbSizeBytes
      });
    }

    // Sort by savings highest to lowest
    return results.sort((a, b) => b.savingsTokens - a.savingsTokens);
  }

  /**
   * Get database size history updates
   */
  getDbHistory(project: string, limit: number = 13): DbHistoryRecord[] {
    this.ensureOpen();
    const rows = this.db.prepare(`
      SELECT * FROM db_history 
      WHERE project = ? 
      ORDER BY created_at_epoch DESC 
      LIMIT ?
    `).all(project, limit);

    return rows.map((row: any) => ({
      id: row.id,
      project: row.project,
      dbSizeBytes: row.db_size_bytes,
      createdAt: row.created_at,
      createdAtEpoch: row.created_at_epoch
    }));
  }

  // ============ Helpers ============

  private rowToObservation(row: any): Observation {
    return {
      id: row.id,
      sessionId: row.session_id,
      project: row.project,
      type: row.type as ObservationType,
      title: row.title,
      narrative: row.narrative || '',
      concepts: this.parseJsonArray(row.concepts),
      filesRead: this.parseJsonArray(row.files_read),
      filesModified: this.parseJsonArray(row.files_modified),
      discoveryTokens: row.discovery_tokens || 0,
      embedding: row.embedding ? JSON.parse(row.embedding) : undefined,
      createdAt: row.created_at,
      createdAtEpoch: row.created_at_epoch,
    };
  }

  private rowToSummary(row: any): SessionSummary {
    return {
      id: row.id,
      sessionId: row.session_id,
      project: row.project,
      request: row.request || '',
      investigated: row.investigated || '',
      learned: row.learned || '',
      completed: row.completed || '',
      nextSteps: row.next_steps || '',
      filesRead: this.parseJsonArray(row.files_read),
      filesEdited: this.parseJsonArray(row.files_edited),
      createdAt: row.created_at,
      createdAtEpoch: row.created_at_epoch,
    };
  }

  private parseJsonArray(json: string | null): string[] {
    if (!json) return [];
    try {
      const parsed = JSON.parse(json);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private generateSessionId(): string {
    const now = new Date();
    const random = Math.random().toString(36).substring(2, 8);
    return `${now.toISOString().replace(/[:.]/g, '-')}-${random}`;
  }

  private detectProjectName(): string {
    try {
      const fs = require('fs');
      const pkgPath = path.join(process.cwd(), 'package.json');
      if (fs.existsSync(pkgPath)) {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
        return pkg.name || path.basename(process.cwd());
      }
    } catch { /* ignore */ }
    return path.basename(process.cwd());
  }
}
