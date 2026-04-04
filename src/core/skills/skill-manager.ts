/**
 * Skill Manager
 * Manages and discovers skills in a project
 */
import path from 'path';
import { FileSystemUtils } from '../../utils/file-system.js';
import { SkillParser, SkillInfo } from './skill-parser.js';
import { HERASPEC_DIR_NAME, SKILLS_DIR_NAME, PROJECT_TYPES, SKILLS } from '../config.js';

export class SkillManager {
  /**
   * Find skill path for a given project type and skill name
   */
  static async findSkillPath(
    projectType: string,
    skillName: string,
    projectPath: string = '.'
  ): Promise<string | null> {
    // Try project-specific skill first
    const projectSkillPath = path.join(
      projectPath,
      HERASPEC_DIR_NAME,
      SKILLS_DIR_NAME,
      projectType,
      skillName
    );

    if (await FileSystemUtils.fileExists(path.join(projectSkillPath, 'skill.md'))) {
      return projectSkillPath;
    }

    // Try cross-cutting skill
    const crossCuttingPath = path.join(
      projectPath,
      HERASPEC_DIR_NAME,
      SKILLS_DIR_NAME,
      skillName
    );

    if (await FileSystemUtils.fileExists(path.join(crossCuttingPath, 'skill.md'))) {
      return crossCuttingPath;
    }

    return null;
  }

  /**
   * Load skill information
   */
  static async loadSkill(
    projectType: string,
    skillName: string,
    projectPath: string = '.'
  ): Promise<SkillInfo | null> {
    const skillPath = await this.findSkillPath(projectType, skillName, projectPath);
    
    if (!skillPath) {
      return null;
    }

    try {
      return SkillParser.parseSkill(skillPath, skillName);
    } catch (error) {
      console.error(`Failed to load skill "${skillName}": ${error instanceof Error ? error.message : 'Unknown error'}`);
      return null;
    }
  }

  /**
   * List all available skills
   */
  static async listSkills(projectPath: string = '.'): Promise<Array<{ projectType?: string; skillName: string; path: string }>> {
    const skillsDir = path.join(projectPath, HERASPEC_DIR_NAME, SKILLS_DIR_NAME);
    
    if (!(await FileSystemUtils.fileExists(skillsDir))) {
      return [];
    }

    const skills: Array<{ projectType?: string; skillName: string; path: string }> = [];
    const entries = await FileSystemUtils.readDirectory(skillsDir);

    for (const entry of entries) {
      const entryPath = path.join(skillsDir, entry);
      const stats = await FileSystemUtils.stat(entryPath);

      if (stats.isDirectory()) {
        // Check if it's a project type folder or cross-cutting skill
        const isProjectType = PROJECT_TYPES.includes(entry as any);
        
        if (isProjectType) {
          // It's a project type folder, list skills inside
          const projectSkills = await this.listSkillsInDirectory(entryPath, entry);
          skills.push(...projectSkills);
        } else {
          // It's a cross-cutting skill
          const skillMdPath = path.join(entryPath, 'skill.md');
          if (await FileSystemUtils.fileExists(skillMdPath)) {
            skills.push({
              skillName: entry,
              path: entryPath,
            });
          }
        }
      }
    }

    return skills;
  }

  /**
   * Extract skill from task line
   */
  static extractSkillFromTask(taskLine: string): { projectType?: string; skill?: string } | null {
    // Match: (projectType: xxx, skill: yyy)
    const match = taskLine.match(/\(projectType:\s*([^,)]+)(?:,\s*skill:\s*([^)]+))?\)/i);
    
    if (match) {
      return {
        projectType: match[1]?.trim(),
        skill: match[2]?.trim(),
      };
    }

    // Match: (skill: yyy)
    const skillOnlyMatch = taskLine.match(/\(skill:\s*([^)]+)\)/i);
    if (skillOnlyMatch) {
      return {
        skill: skillOnlyMatch[1]?.trim(),
      };
    }

    return null;
  }

  private static async listSkillsInDirectory(
    dir: string,
    projectType: string
  ): Promise<Array<{ projectType: string; skillName: string; path: string }>> {
    const skills: Array<{ projectType: string; skillName: string; path: string }> = [];
    const entries = await FileSystemUtils.readDirectory(dir);

    for (const entry of entries) {
      const entryPath = path.join(dir, entry);
      const stats = await FileSystemUtils.stat(entryPath);

      if (stats.isDirectory()) {
        const skillMdPath = path.join(entryPath, 'skill.md');
        if (await FileSystemUtils.fileExists(skillMdPath)) {
          skills.push({
            projectType,
            skillName: entry,
            path: entryPath,
          });
        }
      }
    }

    return skills;
  }
}

