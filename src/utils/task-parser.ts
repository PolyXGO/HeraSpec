/**
 * Task Parser
 * Parses tasks.md to extract skill information
 */
import { readFileSync } from 'fs';
import { SkillManager } from '../core/skills/index.js';

export interface TaskGroup {
  title: string;
  projectType?: string;
  skill?: string;
  tasks: Array<{
    id: string;
    description: string;
    completed: boolean;
  }>;
}

export interface ParsedTasks {
  groups: TaskGroup[];
  skillsUsed: Array<{ projectType?: string; skill: string }>;
}

export class TaskParser {
  static parseTasks(filePath: string): ParsedTasks {
    const content = readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    const groups: TaskGroup[] = [];
    const skillsUsed = new Set<string>();
    let currentGroup: TaskGroup | null = null;

    for (const line of lines) {
      // Match task group header: ## 1. Title (projectType: xxx, skill: yyy)
      const groupMatch = line.match(/^##+\s+\d+\.\s+(.+?)\s*\((.+)\)/);
      
      if (groupMatch) {
        // Save previous group
        if (currentGroup) {
          groups.push(currentGroup);
        }

        const title = groupMatch[1].trim();
        const params = groupMatch[2];
        
        // Extract projectType and skill
        const skillInfo = SkillManager.extractSkillFromTask(`(${params})`);
        
        currentGroup = {
          title,
          projectType: skillInfo?.projectType,
          skill: skillInfo?.skill,
          tasks: [],
        };

        if (skillInfo?.skill) {
          const skillKey = skillInfo.projectType 
            ? `${skillInfo.projectType}:${skillInfo.skill}`
            : skillInfo.skill;
          skillsUsed.add(skillKey);
        }
        continue;
      }

      // Match task: - [ ] or - [x]
      const taskMatch = line.match(/^-\s+\[([ x])\]\s+(.+)/);
      if (taskMatch && currentGroup) {
        const completed = taskMatch[1] === 'x';
        const description = taskMatch[2].trim();
        
        // Extract task ID if present (e.g., "1.1 Task description")
        const idMatch = description.match(/^(\d+\.\d+)\s+/);
        const id = idMatch ? idMatch[1] : `${currentGroup.tasks.length + 1}`;
        const taskDesc = idMatch ? description.replace(/^\d+\.\d+\s+/, '') : description;

        currentGroup.tasks.push({
          id,
          description: taskDesc,
          completed,
        });
      }
    }

    // Save last group
    if (currentGroup) {
      groups.push(currentGroup);
    }

    // Convert skillsUsed set to array
    const skillsArray = Array.from(skillsUsed).map(skillKey => {
      const [projectType, skill] = skillKey.includes(':') 
        ? skillKey.split(':')
        : [undefined, skillKey];
      return { projectType, skill };
    });

    return {
      groups,
      skillsUsed: skillsArray,
    };
  }

  static async getSkillsForTasks(filePath: string): Promise<Array<{ projectType?: string; skill: string; path: string }>> {
    const parsed = this.parseTasks(filePath);
    const skills: Array<{ projectType?: string; skill: string; path: string }> = [];

    for (const skillInfo of parsed.skillsUsed) {
      if (skillInfo.skill) {
        const skillPath = await SkillManager.findSkillPath(
          skillInfo.projectType || '',
          skillInfo.skill,
          '.'
        );
        
        if (skillPath) {
          skills.push({
            projectType: skillInfo.projectType,
            skill: skillInfo.skill,
            path: skillPath,
          });
        }
      }
    }

    return skills;
  }
}

