/**
 * Skill Parser
 * Parses skill.md files to extract skill information
 */
import { readFileSync } from 'fs';
import path from 'path';

export interface SkillInfo {
  name: string;
  purpose: string;
  whenToUse: string[];
  steps: string[];
  inputs: string[];
  outputs: string[];
  toneAndRules: {
    codeStyle?: string;
    namingConventions?: string;
    limitations?: string[];
  };
  templates: string[];
  scripts: string[];
  examples: string[];
  relatedSkills: string[];
  skillPath: string;
}

export class SkillParser {
  static parseSkill(skillPath: string, skillName: string): SkillInfo {
    const skillMdPath = path.join(skillPath, 'skill.md');
    
    try {
      const content = readFileSync(skillMdPath, 'utf-8');
      return this.parseSkillContent(content, skillName, skillPath);
    } catch (error) {
      throw new Error(`Failed to parse skill "${skillName}": ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private static parseSkillContent(content: string, skillName: string, skillPath: string): SkillInfo {
    const lines = content.split('\n');
    
    const skill: Partial<SkillInfo> = {
      name: skillName,
      skillPath,
      purpose: '',
      whenToUse: [],
      steps: [],
      inputs: [],
      outputs: [],
      toneAndRules: {},
      templates: [],
      scripts: [],
      examples: [],
      relatedSkills: [],
    };

    let currentSection = '';
    let currentList: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Detect section headers
      if (line.match(/^##+\s+/)) {
        // Save previous list
        this.saveList(currentSection, currentList, skill);
        currentList = [];
        
        const sectionName = line.replace(/^##+\s+/, '').toLowerCase();
        currentSection = sectionName;
        
        // Extract purpose
        if (sectionName.includes('mục đích') || sectionName.includes('purpose')) {
          // Purpose is usually the next line or paragraph
          if (i + 1 < lines.length && lines[i + 1].trim()) {
            skill.purpose = lines[i + 1].trim();
          }
        }
        continue;
      }

      // Collect list items
      if (line.startsWith('- ') || line.startsWith('* ')) {
        const item = line.replace(/^[-*]\s+/, '').trim();
        if (item) {
          currentList.push(item);
        }
        continue;
      }

      // Collect numbered steps
      if (line.match(/^\d+\.\s+/)) {
        const step = line.replace(/^\d+\.\s+/, '').trim();
        if (step) {
          skill.steps = skill.steps || [];
          skill.steps.push(step);
        }
        continue;
      }

      // Extract specific fields
      if (currentSection.includes('input')) {
        if (line.startsWith('- ')) {
          skill.inputs = skill.inputs || [];
          skill.inputs.push(line.replace(/^-\s+/, ''));
        }
      }

      if (currentSection.includes('output')) {
        if (line.startsWith('- ')) {
          skill.outputs = skill.outputs || [];
          skill.outputs.push(line.replace(/^-\s+/, ''));
        }
      }

      if (currentSection.includes('template')) {
        if (line.includes('.php') || line.includes('.md') || line.includes('.scss') || line.includes('.js') || line.includes('.sh')) {
          skill.templates = skill.templates || [];
          const templateName = line.match(/`([^`]+)`/) || line.match(/\*\*([^*]+)\*\*/);
          if (templateName) {
            skill.templates.push(templateName[1]);
          }
        }
      }

      if (currentSection.includes('script')) {
        if (line.includes('.sh') || line.includes('.py') || line.includes('.js')) {
          skill.scripts = skill.scripts || [];
          const scriptName = line.match(/`([^`]+)`/) || line.match(/\*\*([^*]+)\*\*/);
          if (scriptName) {
            skill.scripts.push(scriptName[1]);
          }
        }
      }
    }

    // Save final list
    this.saveList(currentSection, currentList, skill);

    // Ensure all arrays exist
    return {
      name: skill.name || skillName,
      skillPath: skill.skillPath || skillPath,
      purpose: skill.purpose || 'No description available',
      whenToUse: skill.whenToUse || [],
      steps: skill.steps || [],
      inputs: skill.inputs || [],
      outputs: skill.outputs || [],
      toneAndRules: skill.toneAndRules || {},
      templates: skill.templates || [],
      scripts: skill.scripts || [],
      examples: skill.examples || [],
      relatedSkills: skill.relatedSkills || [],
    };
  }

  private static saveList(section: string, list: string[], skill: Partial<SkillInfo>): void {
    if (list.length === 0) return;

    if (section.includes('khi nào') || section.includes('when')) {
      skill.whenToUse = list;
    } else if (section.includes('input')) {
      skill.inputs = list;
    } else if (section.includes('output')) {
      skill.outputs = list;
    } else if (section.includes('hạn chế') || section.includes('limitation')) {
      skill.toneAndRules = skill.toneAndRules || {};
      skill.toneAndRules.limitations = list;
    } else if (section.includes('liên kết') || section.includes('related')) {
      skill.relatedSkills = list;
    }
  }
}

