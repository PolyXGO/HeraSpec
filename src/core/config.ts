/**
 * HeraSpec Core Configuration
 */

export const HERASPEC_DIR_NAME = 'heraspec';
export const SPECS_DIR_NAME = 'specs';
export const CHANGES_DIR_NAME = 'changes';
export const ARCHIVES_DIR_NAME = 'archives';
export const SKILLS_DIR_NAME = 'skills';

export const PROJECT_TYPES = [
  'wordpress-plugin',
  'wordpress-theme',
  'perfex-module',
  'laravel-package',
  'node-service',
  'generic-webapp',
  'backend-api',
  'frontend-app',
  'multi-stack',
] as const;

export type ProjectType = (typeof PROJECT_TYPES)[number];

export const SKILLS: Record<ProjectType, string[]> = {
  'wordpress-plugin': [
    'admin-settings-page',
    'custom-post-type',
    'shortcode',
    'rest-endpoint',
    'ajax-handler',
    'activation-hook',
    'deactivation-hook',
    'admin-menu-item',
    'meta-box',
    'taxonomy',
  ],
  'wordpress-theme': [
    'theme-setup',
    'custom-post-type',
    'template-part',
    'widget-area',
    'customizer-setting',
    'theme-option',
  ],
  'perfex-module': [
    'module-codebase',
    'module-registration',
    'permission-group',
    'admin-menu-item',
    'login-hook',
    'database-table',
    'api-endpoint',
  ],
  'laravel-package': [
    'service-provider',
    'config-file',
    'artisan-command',
    'migration',
    'model',
    'controller',
    'middleware',
    'route',
  ],
  'node-service': [
    'express-route',
    'middleware',
    'database-model',
    'service-layer',
    'api-endpoint',
    'background-job',
  ],
  'generic-webapp': [
    'page',
    'component',
    'api-endpoint',
    'database-table',
    'authentication',
    'authorization',
  ],
  'backend-api': [
    'endpoint',
    'middleware',
    'authentication',
    'authorization',
    'database-model',
    'validation',
  ],
  'frontend-app': [
    'page',
    'component',
    'route',
    'store',
    'service',
    'hook',
  ],
  'multi-stack': [
    'cross-platform-feature',
    'api-contract',
    'shared-type',
    'integration-point',
  ],
} as const;

export type Skill = typeof SKILLS[ProjectType][number];

export interface HeraSpecConfig {
  projectType?: ProjectType | ProjectType[];
  domains?: string[];
  stack?: string[];
}

export interface SpecMeta {
  projectType?: ProjectType | ProjectType[];
  domain?: string;
  stack?: string | string[];
}

export const HERASPEC_MARKERS = {
  PROJECT_MD: 'project.md',
  AGENTS_MD: 'AGENTS.heraspec.md',
  CONFIG_YAML: 'config.yaml',
  PROPOSAL_MD: 'proposal.md',
  TASKS_MD: 'tasks.md',
  DESIGN_MD: 'design.md',
} as const;

