/**
 * Skills Template Mapping
 * Maps skill names to their template files and resources
 */
export interface SkillTemplateInfo {
  templateFileName: string; // Just the filename, path resolved at runtime
  isCrossCutting: boolean;
  projectType?: string;
  resourceDirs?: string[]; // Additional directories to copy (e.g., scripts, templates, data)
  viFileName?: string; // Vietnamese translation file (e.g., skill.vi.md)
}

/**
 * Mapping of skill names to their template information
 * Key format: "projectType:skillName" for project-specific, or "skillName" for cross-cutting
 */
export const SKILL_TEMPLATE_MAP: Record<string, SkillTemplateInfo> = {
  // Cross-cutting skills
  'ui-ux': {
    templateFileName: 'ui-ux/skill.md',
    isCrossCutting: true,
    resourceDirs: ['ui-ux/scripts', 'ui-ux/templates', 'ui-ux/data'],
  },
  'design-system': {
    templateFileName: 'design-system/skill.md',
    isCrossCutting: true,
    resourceDirs: ['ui-ux/scripts', 'ui-ux/data', 'design-system/knowledge/design-systems'],
  },
  'documents': {
    templateFileName: 'documents/skill.md',
    isCrossCutting: true,
    resourceDirs: ['documents/templates'],
  },
  'content-optimization': {
    templateFileName: 'content-optimization/skill.md',
    isCrossCutting: true,
  },
  'unit-test': {
    templateFileName: 'unit-test/skill.md',
    isCrossCutting: true,
  },
  'integration-test': {
    templateFileName: 'integration-test/skill.md',
    isCrossCutting: true,
  },
  'e2e-test': {
    templateFileName: 'e2e-test/skill.md',
    isCrossCutting: true,
  },
  'suggestion': {
    templateFileName: 'suggestion/skill.md',
    isCrossCutting: true,
  },
  'sourcecode-analyzer': {
    templateFileName: 'sourcecode-analyzer/skill.md',
    isCrossCutting: true,
    viFileName: 'sourcecode-analyzer/skill.vi.md',
  },
  'project-memory': {
    templateFileName: 'project-memory/skill.md',
    viFileName: 'project-memory/skill.vi.md',
    isCrossCutting: true,
  },
  'smart-explore': {
    templateFileName: 'smart-explore/skill.md',
    isCrossCutting: true,
  },
  'deploy-documentation': {
    templateFileName: 'deploy-documentation/skill.md',
    isCrossCutting: true,
    resourceDirs: ['ui-ux/templates'],
  },
  'code-review': {
    templateFileName: 'code-review/skill.md',
    viFileName: 'code-review/skill.vi.md',
    isCrossCutting: true,
  },
  'debug': {
    templateFileName: 'debug/skill.md',
    viFileName: 'debug/skill.vi.md',
    isCrossCutting: true,
  },
  'system-design': {
    templateFileName: 'system-design/skill.md',
    viFileName: 'system-design/skill.vi.md',
    isCrossCutting: true,
  },
  'tech-debt': {
    templateFileName: 'tech-debt/skill.md',
    viFileName: 'tech-debt/skill.vi.md',
    isCrossCutting: true,
  },
  'spec-writer': {
    templateFileName: 'spec-writer/skill.md',
    viFileName: 'spec-writer/skill.vi.md',
    isCrossCutting: true,
  },
  'seo-audit': {
    templateFileName: 'seo-audit/skill.md',
    viFileName: 'seo-audit/skill.vi.md',
    isCrossCutting: true,
  },
  'campaign-plan': {
    templateFileName: 'campaign-plan/skill.md',
    viFileName: 'campaign-plan/skill.vi.md',
    isCrossCutting: true,
  },
  'content-creation': {
    templateFileName: 'content-creation/skill.md',
    viFileName: 'content-creation/skill.vi.md',
    isCrossCutting: true,
  },
  'email-sequence': {
    templateFileName: 'email-sequence/skill.md',
    viFileName: 'email-sequence/skill.vi.md',
    isCrossCutting: true,
  },
  'sql-queries': {
    templateFileName: 'sql-queries/skill.md',
    viFileName: 'sql-queries/skill.vi.md',
    isCrossCutting: true,
  },
  
  // Perfex module skills
  'perfex-module:module-codebase': {
    templateFileName: 'perfex-module/module-codebase/skill.md',
    isCrossCutting: false,
    projectType: 'perfex-module',
  },
  'wordpress:ux-element': {
    templateFileName: 'wordpress/ux-element/skill.md',
    isCrossCutting: false,
    projectType: 'wordpress',
    resourceDirs: ['wordpress/ux-element/templates'],
  },
  'wordpress:plugin-standard': {
    templateFileName: 'wordpress/plugin-standard/skill.md',
    isCrossCutting: false,
    projectType: 'wordpress',
    resourceDirs: ['wordpress/plugin-standard/templates'],
  },
  'wordpress:plugin-check': {
    templateFileName: 'wordpress/plugin-check/skill.md',
    isCrossCutting: false,
    projectType: 'wordpress',
  },
  'wordpress:plugin-directory': {
    templateFileName: 'wordpress/plugin-directory/skill.md',
    isCrossCutting: false,
    projectType: 'wordpress',
  },
  // WordPress Plugin specific (matches PROJECT_TYPES)
  'wordpress-plugin:plugin-check': {
    templateFileName: 'wordpress/plugin-check/skill.md',
    isCrossCutting: false,
    projectType: 'wordpress-plugin',
  },
  'wordpress-plugin:plugin-directory': {
    templateFileName: 'wordpress/plugin-directory/skill.md',
    isCrossCutting: false,
    projectType: 'wordpress-plugin',
  },
};

/**
 * Get template info for a skill
 */
export function getSkillTemplateInfo(skillName: string, projectType?: string): SkillTemplateInfo | null {
  // Try project-specific first
  if (projectType) {
    const key = `${projectType}:${skillName}`;
    if (SKILL_TEMPLATE_MAP[key]) {
      return SKILL_TEMPLATE_MAP[key];
    }
  }
  
  // Try cross-cutting
  if (SKILL_TEMPLATE_MAP[skillName]) {
    return SKILL_TEMPLATE_MAP[skillName];
  }
  
  // If we haven't found it and no projectType was specified, assume inferred lookup
  if (!projectType) {
    for (const key of Object.keys(SKILL_TEMPLATE_MAP)) {
      // Check if key is "projectType:skillName"
      const parts = key.split(':');
      if (parts.length === 2 && parts[1] === skillName) {
        return SKILL_TEMPLATE_MAP[key];
      }
    }
  }
  
  return null;
}

/**
 * Get all available skill templates
 */
export function getAllSkillTemplates(): Array<{ skillName: string; projectType?: string; info: SkillTemplateInfo }> {
  const result: Array<{ skillName: string; projectType?: string; info: SkillTemplateInfo }> = [];
  
  for (const [key, info] of Object.entries(SKILL_TEMPLATE_MAP)) {
    if (info.isCrossCutting) {
      result.push({ skillName: key, info });
    } else {
      const [projectType, skillName] = key.split(':');
      result.push({ skillName, projectType, info });
    }
  }
  
  return result;
}

