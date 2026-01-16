/**
 * Skills Template Mapping
 * Maps skill names to their template files and resources
 */
export interface SkillTemplateInfo {
  templateFileName: string; // Just the filename, path resolved at runtime
  isCrossCutting: boolean;
  projectType?: string;
  resourceDirs?: string[]; // Additional directories to copy (e.g., scripts, templates, data)
}

/**
 * Mapping of skill names to their template information
 * Key format: "projectType:skillName" for project-specific, or "skillName" for cross-cutting
 */
export const SKILL_TEMPLATE_MAP: Record<string, SkillTemplateInfo> = {
  // Cross-cutting skills
  'ui-ux': {
    templateFileName: 'ui-ux-skill.md',
    isCrossCutting: true,
    resourceDirs: ['scripts', 'templates', 'data'],
  },
  'documents': {
    templateFileName: 'documents-skill.md',
    isCrossCutting: true,
  },
  'content-optimization': {
    templateFileName: 'content-optimization-skill.md',
    isCrossCutting: true,
  },
  'unit-test': {
    templateFileName: 'unit-test-skill.md',
    isCrossCutting: true,
  },
  'integration-test': {
    templateFileName: 'integration-test-skill.md',
    isCrossCutting: true,
  },
  'e2e-test': {
    templateFileName: 'e2e-test-skill.md',
    isCrossCutting: true,
  },
  'suggestion': {
    templateFileName: 'suggestion-skill.md',
    isCrossCutting: true,
  },
  
  // Perfex module skills
  'perfex-module:module-codebase': {
    templateFileName: 'module-codebase-skill.md',
    isCrossCutting: false,
    projectType: 'perfex-module',
  },
  'wordpress:ux-element': {
    templateFileName: 'ux-element-skill.md',
    isCrossCutting: false,
    projectType: 'wordpress',
    resourceDirs: ['ux-element/templates'],
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

