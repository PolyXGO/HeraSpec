/**
 * HeraSpec Skill Command
 * Shows skill information, lists available skills, repairs, and adds skills
 */
import path from 'path';
import { readFileSync } from 'fs';
import chalk from 'chalk';
import ora from 'ora';
import { FileSystemUtils } from '../utils/file-system.js';
import { SkillManager, SkillParser } from '../core/skills/index.js';
import { HERASPEC_DIR_NAME, SKILLS_DIR_NAME, PROJECT_TYPES } from '../core/config.js';
import { getSkillTemplateInfo, getAllSkillTemplates } from '../core/templates/skills-template-map.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get HeraSpec core templates directory
// Try multiple paths to handle both source and built versions, and installed packages
async function getCoreTemplatesDir(): Promise<string | null> {
  const possiblePaths: string[] = [];
  
  // Strategy 1: Resolve package.json from current file location (works when bundled)
  // When running from bin/heraspec.js, this resolves to the package root
  try {
    const packageJsonPath = require.resolve('../package.json');
    const packageDir = path.dirname(packageJsonPath);
    
    possiblePaths.push(
      join(packageDir, 'src', 'core', 'templates', 'skills'), // Source (when linked, this is the actual source)
      join(packageDir, 'dist', 'core', 'templates', 'skills'), // Built (templates copied during build)
    );
  } catch {
    // Could not resolve, continue
  }
  
  // Strategy 2: Try require.resolve('heraspec/package.json') for npm installed packages
  try {
    const packageJsonPath = require.resolve('heraspec/package.json');
    const packageDir = path.dirname(packageJsonPath);
    
    possiblePaths.push(
      join(packageDir, 'dist', 'core', 'templates', 'skills'), // Built
      join(packageDir, 'src', 'core', 'templates', 'skills'), // Source (if available)
    );
  } catch {
    // Package not found, continue
  }
  
  // Strategy 3: Relative paths from current file location (when running from source)
  possiblePaths.push(
    // Source version (for development) - when running from source: src/commands/skill.ts
    join(__dirname, '..', '..', 'src', 'core', 'templates', 'skills'),
    // Built version - when running from built: dist/commands/skill.js
    join(__dirname, '..', 'core', 'templates', 'skills'),
    // Alternative: from project root (when running from HeraSpec source)
    join(process.cwd(), 'src', 'core', 'templates', 'skills'),
  );

  for (const possiblePath of possiblePaths) {
    if (await FileSystemUtils.fileExists(possiblePath)) {
      return possiblePath;
    }
  }

  return null;
}

export class SkillCommand {
  async list(projectPath: string = '.'): Promise<void> {
    const skills = await SkillManager.listSkills(projectPath);

    if (skills.length === 0) {
      console.log('No skills found. Skills will be created as needed.');
      console.log('See docs/SKILLS_STRUCTURE_PROPOSAL.md for skill structure.');
      return;
    }

    console.log('\nAvailable Skills:\n');
    console.log('═'.repeat(60));

    // Group by project type
    const byProjectType: Record<string, Array<{ skillName: string; path: string }>> = {};
    const crossCutting: Array<{ skillName: string; path: string }> = [];

    for (const skill of skills) {
      if (skill.projectType) {
        if (!byProjectType[skill.projectType]) {
          byProjectType[skill.projectType] = [];
        }
        byProjectType[skill.projectType].push({
          skillName: skill.skillName,
          path: skill.path,
        });
      } else {
        crossCutting.push({
          skillName: skill.skillName,
          path: skill.path,
        });
      }
    }

    // Display project-specific skills
    for (const [projectType, projectSkills] of Object.entries(byProjectType)) {
      console.log(`\n📦 ${projectType}:`);
      for (const skill of projectSkills) {
        console.log(`   • ${skill.skillName}`);
      }
    }

    // Display cross-cutting skills
    if (crossCutting.length > 0) {
      console.log(`\n🔧 Cross-cutting skills:`);
      for (const skill of crossCutting) {
        console.log(`   • ${skill.skillName}`);
      }
    }

    console.log('\n' + '═'.repeat(60) + '\n');
  }

  async show(skillName: string, projectType?: string, projectPath: string = '.'): Promise<void> {
    if (!skillName) {
      console.error('Error: Please specify a skill name');
      console.log('Usage: heraspec skill show <skill-name> [--project-type <type>]');
      process.exitCode = 1;
      return;
    }

    // Try to find skill
    let skillInfo = null;
    
    if (projectType) {
      skillInfo = await SkillManager.loadSkill(projectType, skillName, projectPath);
    } else {
      // Try to find in any project type
      const skills = await SkillManager.listSkills(projectPath);
      const found = skills.find(s => s.skillName === skillName);
      
      if (found) {
        try {
          skillInfo = SkillParser.parseSkill(found.path, skillName);
        } catch (error) {
          console.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
          process.exitCode = 1;
          return;
        }
      }
    }

    if (!skillInfo) {
      console.error(`Error: Skill "${skillName}" not found`);
      if (projectType) {
        console.log(`Searched in: heraspec/skills/${projectType}/${skillName}/`);
      } else {
        console.log('Searched in: heraspec/skills/');
      }
      process.exitCode = 1;
      return;
    }

    // Display skill information
    console.log(`\n📚 Skill: ${skillInfo.name}\n`);
    console.log('═'.repeat(60));

    console.log(`\n📍 Path: ${skillInfo.skillPath}\n`);

    if (skillInfo.purpose) {
      console.log('## Purpose');
      console.log(skillInfo.purpose);
      console.log();
    }

    if (skillInfo.whenToUse.length > 0) {
      console.log('## When to Use');
      skillInfo.whenToUse.forEach(item => {
        console.log(`- ${item}`);
      });
      console.log();
    }

    if (skillInfo.steps.length > 0) {
      console.log('## Steps');
      skillInfo.steps.forEach((step, index) => {
        console.log(`${index + 1}. ${step}`);
      });
      console.log();
    }

    if (skillInfo.inputs.length > 0) {
      console.log('## Inputs');
      skillInfo.inputs.forEach(input => {
        console.log(`- ${input}`);
      });
      console.log();
    }

    if (skillInfo.outputs.length > 0) {
      console.log('## Outputs');
      skillInfo.outputs.forEach(output => {
        console.log(`- ${output}`);
      });
      console.log();
    }

    if (skillInfo.templates.length > 0) {
      console.log('## Available Templates');
      skillInfo.templates.forEach(template => {
        console.log(`- ${template}`);
      });
      console.log();
    }

    if (skillInfo.scripts.length > 0) {
      console.log('## Available Scripts');
      skillInfo.scripts.forEach(script => {
        console.log(`- ${script}`);
      });
      console.log();
    }

    if (skillInfo.toneAndRules.limitations && skillInfo.toneAndRules.limitations.length > 0) {
      console.log('## Limitations');
      skillInfo.toneAndRules.limitations.forEach(limitation => {
        console.log(`- ${limitation}`);
      });
      console.log();
    }

    // Show full skill.md content
    const skillMdPath = path.join(skillInfo.skillPath, 'skill.md');
    if (await FileSystemUtils.fileExists(skillMdPath)) {
      console.log('═'.repeat(60));
      console.log('\n## Full skill.md Content\n');
      const content = await FileSystemUtils.readFile(skillMdPath);
      console.log(content);
    }

    console.log('\n' + '═'.repeat(60) + '\n');
  }

  async repair(projectPath: string = '.'): Promise<void> {
    const spinner = ora('Repairing skills structure...').start();

    try {
      const skillsDir = path.join(projectPath, HERASPEC_DIR_NAME, SKILLS_DIR_NAME);
      
      if (!(await FileSystemUtils.fileExists(skillsDir))) {
        spinner.fail('Skills directory does not exist. Run "heraspec init" first.');
        process.exitCode = 1;
        return;
      }

      const skills = await SkillManager.listSkills(projectPath);
      let fixed = 0;
      let errors = 0;

      for (const skill of skills) {
        const skillPath = skill.path;
        const skillMdPath = path.join(skillPath, 'skill.md');

        // Ensure skill.md exists
        if (!(await FileSystemUtils.fileExists(skillMdPath))) {
          spinner.warn(`Missing skill.md in ${skillPath}`);
          errors++;
          continue;
        }

        // Ensure standard directories exist
        const standardDirs = ['templates', 'scripts', 'examples'];
        for (const dir of standardDirs) {
          const dirPath = path.join(skillPath, dir);
          if (!(await FileSystemUtils.fileExists(dirPath))) {
            await FileSystemUtils.createDirectory(dirPath);
            fixed++;
          }
        }

        // Validate skill.md structure (basic check)
        try {
          const content = await FileSystemUtils.readFile(skillMdPath);
          if (!content.includes('## Purpose') && !content.includes('# Skill:')) {
            spinner.warn(`Invalid skill.md structure in ${skillPath}`);
          }
        } catch (error) {
          spinner.warn(`Cannot read skill.md in ${skillPath}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          errors++;
        }
      }

      if (errors === 0 && fixed === 0) {
        spinner.succeed('All skills are properly structured');
      } else {
        spinner.succeed(`Repaired ${fixed} issues, found ${errors} errors`);
      }
    } catch (error) {
      spinner.fail(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      process.exitCode = 1;
    }
  }

  async add(skillName: string, projectType?: string, projectPath: string = '.'): Promise<void> {
    if (!skillName) {
      console.error('Error: Please specify a skill name');
      console.log('Usage: heraspec skills add <skill-name> [--project-type <type>]');
      process.exitCode = 1;
      return;
    }

    const spinner = ora(`Adding skill "${skillName}"...`).start();

    try {
      // Get template info
      const templateInfo = getSkillTemplateInfo(skillName, projectType);
      
      if (!templateInfo) {
        spinner.fail(`Skill template "${skillName}" not found`);
        console.log('\nAvailable skills:');
        const allTemplates = getAllSkillTemplates();
        for (const { skillName: name, projectType: pt } of allTemplates) {
          if (pt) {
            console.log(`  - ${name} (projectType: ${pt})`);
          } else {
            console.log(`  - ${name} (cross-cutting)`);
          }
        }
        process.exitCode = 1;
        return;
      }

      // Determine destination path
      const skillsDir = path.join(projectPath, HERASPEC_DIR_NAME, SKILLS_DIR_NAME);
      
      let destPath: string;
      if (templateInfo.isCrossCutting) {
        destPath = path.join(skillsDir, skillName);
      } else {
        if (!templateInfo.projectType) {
          spinner.fail('Project type is required for this skill');
          process.exitCode = 1;
          return;
        }
        destPath = path.join(skillsDir, templateInfo.projectType, skillName);
      }

      // Check if already exists - remove old skill before adding new one
      const isUpdate = await FileSystemUtils.fileExists(destPath);
      if (isUpdate) {
        spinner.info(`Skill "${skillName}" already exists at ${destPath}`);
        spinner.start(`Removing old version to update with latest...`);
        try {
          await FileSystemUtils.removeDirectory(destPath, true);
          spinner.succeed(`Removed old skill "${skillName}"`);
        } catch (error) {
          spinner.fail(`Failed to remove old skill: ${error instanceof Error ? error.message : 'Unknown error'}`);
          process.exitCode = 1;
          return;
        }
        spinner.start(`Adding updated skill "${skillName}"...`);
      }

      // Ensure directories exist
      await FileSystemUtils.createDirectory(destPath);

      // Get core templates directory
      const coreTemplatesDir = await getCoreTemplatesDir();
      if (!coreTemplatesDir) {
        spinner.fail('Cannot find HeraSpec templates directory. Make sure you are running from HeraSpec project or have templates installed.');
        process.exitCode = 1;
        return;
      }

      const templateFile = path.join(coreTemplatesDir, templateInfo.templateFileName);

      // Check if template file exists
      if (!(await FileSystemUtils.fileExists(templateFile))) {
        spinner.fail(`Template file not found: ${templateFile}`);
        process.exitCode = 1;
        return;
      }

      await FileSystemUtils.copyFile(templateFile, path.join(destPath, 'skill.md'));

      // Copy resource directories if specified
      if (templateInfo.resourceDirs) {
        for (const resourceDir of templateInfo.resourceDirs) {
          const srcResourceDir = path.join(coreTemplatesDir, resourceDir);
          const destResourceDir = path.join(destPath, resourceDir);
          
          if (await FileSystemUtils.fileExists(srcResourceDir)) {
            await FileSystemUtils.copyDirectory(srcResourceDir, destResourceDir);
          }
        }
      }

      // Create standard directories
      await FileSystemUtils.createDirectory(path.join(destPath, 'templates'));
      await FileSystemUtils.createDirectory(path.join(destPath, 'scripts'));
      await FileSystemUtils.createDirectory(path.join(destPath, 'examples'));

      const successMessage = isUpdate 
        ? `Skill "${skillName}" updated successfully`
        : `Skill "${skillName}" added successfully`;
      
      spinner.succeed(successMessage);
      console.log(`\n📍 Location: ${destPath}`);
      if (isUpdate) {
        console.log(`\n✨ Skill has been updated with latest features and improvements.`);
      }
      console.log(`\n💡 Run "heraspec skill show ${skillName}${projectType ? ` --project-type ${projectType}` : ''}" to view details\n`);
    } catch (error) {
      spinner.fail(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      process.exitCode = 1;
    }
  }

  async update(skillName: string, projectType?: string, projectPath: string = '.'): Promise<void> {
    // The internal logic of add already handles updating existing skills by removing the old version first
    return this.add(skillName, projectType, projectPath);
  }
}
