/**
 * HeraSpec Memory Types
 * Interfaces and types for the project memory system
 */

// ============ Observation Types ============

export const OBSERVATION_TYPES = [
  'decision',
  'bugfix',
  'feature',
  'refactor',
  'discovery',
  'change',
] as const;

export type ObservationType = (typeof OBSERVATION_TYPES)[number];

export interface Observation {
  id: number;
  sessionId: string;
  project: string;
  type: ObservationType;
  title: string;
  narrative: string;
  concepts: string[];       // Tags for categorization
  filesRead: string[];      // Files read during this observation
  filesModified: string[];  // Files modified during this observation
  discoveryTokens: number;
  embedding?: number[]; // Vector embedding  // Estimated tokens spent discovering this
  createdAt: string;        // ISO 8601 timestamp
  createdAtEpoch: number;   // Unix timestamp in milliseconds
}

export interface ObservationInput {
  sessionId?: string;
  project?: string;
  type: ObservationType;
  title: string;
  narrative?: string;
  concepts?: string[];
  filesRead?: string[];
  filesModified?: string[];
  discoveryTokens?: number;
  embedding?: number[];
}

// ============ Session Summary Types ============

export interface SessionSummary {
  id: number;
  sessionId: string;
  project: string;
  request: string;          // What the user asked for
  investigated: string;     // What was investigated/researched
  learned: string;          // What was learned
  completed: string;        // What was completed
  nextSteps: string;        // What remains to be done
  filesRead: string[];
  filesEdited: string[];
  createdAt: string;
  createdAtEpoch: number;
}

export interface SessionSummaryInput {
  sessionId?: string;
  project?: string;
  request: string;
  investigated?: string;
  learned?: string;
  completed?: string;
  nextSteps?: string;
  filesRead?: string[];
  filesEdited?: string[];
}

// ============ Session Types ============

export interface Session {
  id: number;
  sessionId: string;
  project: string;
  startedAt: string;
  startedAtEpoch: number;
  completedAt: string | null;
  completedAtEpoch: number | null;
  status: 'active' | 'completed';
}

// ============ Search Types ============

export interface MemorySearchResult {
  id: number;
  type: ObservationType;
  title: string;
  narrative: string;
  concepts: string[];
  filesModified: string[];
  createdAt: string;
  createdAtEpoch: number;
  rank?: number;            // FTS5 relevance score
  estimatedTokens: number;  // Estimated tokens for this result
}

export interface SummarySearchResult {
  id: number;
  sessionId: string;
  request: string;
  completed: string;
  learned: string;
  createdAt: string;
  createdAtEpoch: number;
  rank?: number;
  estimatedTokens: number;
}

export interface SearchOptions {
  query?: string;
  type?: ObservationType | ObservationType[];
  concepts?: string[];
  files?: string[];
  dateStart?: string;       // ISO date or epoch
  dateEnd?: string;
  project?: string;
  limit?: number;
  offset?: number;
  orderBy?: 'relevance' | 'date_desc' | 'date_asc';
}

export interface TimelineItem {
  type: 'observation' | 'summary';
  id: number;
  title: string;
  timestamp: string;
  epoch: number;
  icon: string;
  estimatedTokens: number;
}

// ============ Context Types ============

export interface ContextConfig {
  totalObservationCount: number;  // Total observations to include in context
  fullObservationCount: number;   // How many show full narrative
  sessionCount: number;           // How many session summaries to include
  observationTypes: Set<string>;  // Filter by types
  observationConcepts: Set<string>; // Filter by concepts
  maxTokens: number;              // Token budget
  showLastSummary: boolean;
}

export interface MemoryStatus {
  observationCount: number;
  summaryCount: number;
  sessionCount: number;
  oldestObservation: string | null;
  newestObservation: string | null;
  topConcepts: Array<{ concept: string; count: number }>;
  topFiles: Array<{ file: string; count: number }>;
  estimatedTotalTokens: number;
  dbSizeBytes: number;
}

// ============ Analytics Types ============

export interface DbHistoryRecord {
  id: number;
  project: string;
  dbSizeBytes: number;
  createdAt: string;
  createdAtEpoch: number;
}

export interface ProjectAnalytics {
  project: string;
  totalOps: number;
  tokensWithMemory: number;
  tokensWithoutMemory: number;
  savingsTokens: number;
  savingsPercent: number;
  dbSizeBytes: number;
  history?: DbHistoryRecord[];
}

// ============ Utility Constants ============

export const OBSERVATION_TYPE_ICONS: Record<ObservationType, string> = {
  decision: '⚖️',
  bugfix: '🔴',
  feature: '🟢',
  refactor: '🔄',
  discovery: '🔵',
  change: '✅',
};

export const CHARS_PER_TOKEN_ESTIMATE = 4;

export function estimateTokens(text: string | null | undefined): number {
  if (!text) return 0;
  return Math.ceil(text.length / CHARS_PER_TOKEN_ESTIMATE);
}
