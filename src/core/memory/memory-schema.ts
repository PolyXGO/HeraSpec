/**
 * HeraSpec Memory Schema
 * SQLite schema definitions, FTS5 indexes, and migration system
 */

export const SCHEMA_VERSION = 1;

/**
 * Core table definitions
 */
export const CREATE_TABLES = `
  -- Sessions tracking
  CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL UNIQUE,
    project TEXT NOT NULL,
    started_at TEXT NOT NULL DEFAULT (datetime('now')),
    started_at_epoch INTEGER NOT NULL DEFAULT (strftime('%s','now') * 1000),
    completed_at TEXT,
    completed_at_epoch INTEGER,
    status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'completed'))
  );

  -- Observation records
  CREATE TABLE IF NOT EXISTS observations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL DEFAULT '',
    project TEXT NOT NULL DEFAULT '',
    type TEXT NOT NULL DEFAULT 'change' CHECK(type IN ('decision', 'bugfix', 'feature', 'refactor', 'discovery', 'change')),
    title TEXT NOT NULL DEFAULT '',
    narrative TEXT DEFAULT '',
    concepts TEXT DEFAULT '[]',
    files_read TEXT DEFAULT '[]',
    files_modified TEXT DEFAULT '[]',
    discovery_tokens INTEGER DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    created_at_epoch INTEGER NOT NULL DEFAULT (strftime('%s','now') * 1000)
  );

  -- Session summaries
  CREATE TABLE IF NOT EXISTS session_summaries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL DEFAULT '',
    project TEXT NOT NULL DEFAULT '',
    request TEXT DEFAULT '',
    investigated TEXT DEFAULT '',
    learned TEXT DEFAULT '',
    completed TEXT DEFAULT '',
    next_steps TEXT DEFAULT '',
    files_read TEXT DEFAULT '[]',
    files_edited TEXT DEFAULT '[]',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    created_at_epoch INTEGER NOT NULL DEFAULT (strftime('%s','now') * 1000)
  );
`;

/**
 * Index definitions for query optimization
 */
export const CREATE_INDEXES = `
  CREATE INDEX IF NOT EXISTS idx_obs_project ON observations(project);
  CREATE INDEX IF NOT EXISTS idx_obs_type ON observations(type);
  CREATE INDEX IF NOT EXISTS idx_obs_created ON observations(created_at_epoch DESC);
  CREATE INDEX IF NOT EXISTS idx_obs_session ON observations(session_id);
  CREATE INDEX IF NOT EXISTS idx_sum_project ON session_summaries(project);
  CREATE INDEX IF NOT EXISTS idx_sum_created ON session_summaries(created_at_epoch DESC);
  CREATE INDEX IF NOT EXISTS idx_sessions_project ON sessions(project);
  CREATE INDEX IF NOT EXISTS idx_sessions_status ON sessions(status);
`;

/**
 * FTS5 virtual tables for full-text search
 */
export const CREATE_FTS5 = `
  CREATE VIRTUAL TABLE IF NOT EXISTS observations_fts USING fts5(
    title,
    narrative,
    concepts,
    content='observations',
    content_rowid='id',
    tokenize='porter unicode61'
  );

  CREATE VIRTUAL TABLE IF NOT EXISTS summaries_fts USING fts5(
    request,
    learned,
    completed,
    content='session_summaries',
    content_rowid='id',
    tokenize='porter unicode61'
  );
`;

/**
 * FTS5 sync triggers - keep FTS index in sync with main tables
 */
export const CREATE_FTS_TRIGGERS = `
  -- Observations FTS triggers
  CREATE TRIGGER IF NOT EXISTS observations_ai AFTER INSERT ON observations BEGIN
    INSERT INTO observations_fts(rowid, title, narrative, concepts)
    VALUES (new.id, new.title, new.narrative, new.concepts);
  END;

  CREATE TRIGGER IF NOT EXISTS observations_ad AFTER DELETE ON observations BEGIN
    INSERT INTO observations_fts(observations_fts, rowid, title, narrative, concepts)
    VALUES ('delete', old.id, old.title, old.narrative, old.concepts);
  END;

  CREATE TRIGGER IF NOT EXISTS observations_au AFTER UPDATE ON observations BEGIN
    INSERT INTO observations_fts(observations_fts, rowid, title, narrative, concepts)
    VALUES ('delete', old.id, old.title, old.narrative, old.concepts);
    INSERT INTO observations_fts(rowid, title, narrative, concepts)
    VALUES (new.id, new.title, new.narrative, new.concepts);
  END;

  -- Summaries FTS triggers
  CREATE TRIGGER IF NOT EXISTS summaries_ai AFTER INSERT ON session_summaries BEGIN
    INSERT INTO summaries_fts(rowid, request, learned, completed)
    VALUES (new.id, new.request, new.learned, new.completed);
  END;

  CREATE TRIGGER IF NOT EXISTS summaries_ad AFTER DELETE ON session_summaries BEGIN
    INSERT INTO summaries_fts(summaries_fts, rowid, request, learned, completed)
    VALUES ('delete', old.id, old.request, old.learned, old.completed);
  END;

  CREATE TRIGGER IF NOT EXISTS summaries_au AFTER UPDATE ON session_summaries BEGIN
    INSERT INTO summaries_fts(summaries_fts, rowid, request, learned, completed)
    VALUES ('delete', old.id, old.request, old.learned, old.completed);
    INSERT INTO summaries_fts(rowid, request, learned, completed)
    VALUES (new.id, new.request, new.learned, new.completed);
  END;
`;

/**
 * Initialize database with schema
 */
export function initializeSchema(db: any): void {
  // Enable WAL mode for better concurrent performance
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  // Create tables
  db.exec(CREATE_TABLES);

  // Create indexes
  db.exec(CREATE_INDEXES);

  // Create FTS5 tables
  db.exec(CREATE_FTS5);

  // Create FTS sync triggers
  db.exec(CREATE_FTS_TRIGGERS);

  // Set schema version
  db.pragma(`user_version = ${SCHEMA_VERSION}`);
}

/**
 * Check if migration is needed
 */
export function needsMigration(db: any): boolean {
  const currentVersion = db.pragma('user_version', { simple: true }) as number;
  return currentVersion < SCHEMA_VERSION;
}

/**
 * Run migrations from current version to latest
 */
export function runMigrations(db: any): void {
  const currentVersion = db.pragma('user_version', { simple: true }) as number;

  if (currentVersion === 0) {
    // Fresh database - initialize from scratch
    initializeSchema(db);
    return;
  }

  // Future migrations go here:
  // if (currentVersion < 2) { migrateTo2(db); }
  // if (currentVersion < 3) { migrateTo3(db); }

  db.pragma(`user_version = ${SCHEMA_VERSION}`);
}
