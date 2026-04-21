/**
 * HeraSpec Context Config
 * Configuration for context generation with defaults
 */
import path from 'path';
import { HERASPEC_DIR_NAME, MEMORY_DIR_NAME } from '../config.js';
import type { ContextConfig } from './memory-types.js';

const CONFIG_FILENAME = 'config.json';

/**
 * Default context configuration
 */
export const DEFAULT_CONTEXT_CONFIG: ContextConfig = {
  totalObservationCount: 50,
  fullObservationCount: 5,
  sessionCount: 5,
  observationTypes: new Set(['decision', 'bugfix', 'feature', 'refactor', 'discovery', 'change']),
  observationConcepts: new Set(),  // Empty = all concepts
  maxTokens: 6000,
  showLastSummary: true,
};

/**
 * Load context configuration from file or return defaults
 */
export function loadContextConfig(projectPath: string = '.'): ContextConfig {
  const configPath = path.join(projectPath, HERASPEC_DIR_NAME, MEMORY_DIR_NAME, CONFIG_FILENAME);

  try {
    const fs = require('fs');
    if (!fs.existsSync(configPath)) {
      return { ...DEFAULT_CONTEXT_CONFIG };
    }

    const raw = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    return mergeConfig(raw);
  } catch {
    return { ...DEFAULT_CONTEXT_CONFIG };
  }
}

/**
 * Save context configuration to file
 */
export function saveContextConfig(config: ContextConfig, projectPath: string = '.'): void {
  const configDir = path.join(projectPath, HERASPEC_DIR_NAME, MEMORY_DIR_NAME);
  const configPath = path.join(configDir, CONFIG_FILENAME);

  const fs = require('fs');
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }

  const serializable = {
    totalObservationCount: config.totalObservationCount,
    fullObservationCount: config.fullObservationCount,
    sessionCount: config.sessionCount,
    observationTypes: Array.from(config.observationTypes),
    observationConcepts: Array.from(config.observationConcepts),
    maxTokens: config.maxTokens,
    showLastSummary: config.showLastSummary,
  };

  fs.writeFileSync(configPath, JSON.stringify(serializable, null, 2), 'utf-8');
}

/**
 * Merge user config with defaults
 */
function mergeConfig(raw: any): ContextConfig {
  const defaults = DEFAULT_CONTEXT_CONFIG;

  return {
    totalObservationCount: raw.totalObservationCount ?? defaults.totalObservationCount,
    fullObservationCount: raw.fullObservationCount ?? defaults.fullObservationCount,
    sessionCount: raw.sessionCount ?? defaults.sessionCount,
    observationTypes: raw.observationTypes
      ? new Set(raw.observationTypes)
      : new Set(defaults.observationTypes),
    observationConcepts: raw.observationConcepts
      ? new Set(raw.observationConcepts)
      : new Set(defaults.observationConcepts),
    maxTokens: raw.maxTokens ?? defaults.maxTokens,
    showLastSummary: raw.showLastSummary ?? defaults.showLastSummary,
  };
}
