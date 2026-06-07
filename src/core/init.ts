/**
 * HeraSpec Init Command
 * Initializes HeraSpec in a project
 */
import ora from 'ora';
import chalk from 'chalk';
import path from 'path';
import { FileSystemUtils } from '../utils/file-system.js';
import { TemplateManager } from './templates/index.js';
import {
  HERASPEC_DIR_NAME,
  SPECS_DIR_NAME,
  CHANGES_DIR_NAME,
  ARCHIVES_DIR_NAME,
  SKILLS_DIR_NAME,
  KNOWLEDGE_DIR_NAME,
  HERASPEC_MARKERS,
} from './config.js';
import { getSkillTemplateInfo, getAllSkillTemplates } from './templates/skills-template-map.js';
import { MemoryCommand } from '../commands/memory.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class InitCommand {
  async execute(targetPath: string = '.'): Promise<void> {
    const resolvedPath = path.resolve(targetPath);
    const heraspecPath = path.join(resolvedPath, HERASPEC_DIR_NAME);

    // Check if already initialized
    const alreadyInitialized = await FileSystemUtils.fileExists(
      path.join(heraspecPath, HERASPEC_MARKERS.PROJECT_MD)
    );

    const spinner = ora({
      text: alreadyInitialized ? 'Updating HeraSpec...' : 'Initializing HeraSpec...',
      color: 'blue',
    }).start();

    try {
      // Create directory structure
      await FileSystemUtils.createDirectory(heraspecPath);
      await FileSystemUtils.createDirectory(path.join(heraspecPath, SPECS_DIR_NAME));
      await FileSystemUtils.createDirectory(path.join(heraspecPath, CHANGES_DIR_NAME));
      await FileSystemUtils.createDirectory(path.join(heraspecPath, ARCHIVES_DIR_NAME));
      await FileSystemUtils.createDirectory(path.join(heraspecPath, SKILLS_DIR_NAME));
      await FileSystemUtils.createDirectory(path.join(heraspecPath, KNOWLEDGE_DIR_NAME));

      // Create skills README
      const skillsReadmePath = path.join(heraspecPath, SKILLS_DIR_NAME, 'README.md');
      if (!(await FileSystemUtils.fileExists(skillsReadmePath))) {
        const skillsReadme = await this.getSkillsReadmeTemplate();
        await FileSystemUtils.writeFile(skillsReadmePath, skillsReadme);
      }

      // Create UI/UX skill quick reference guide
      const uiuxGuidePath = path.join(heraspecPath, SKILLS_DIR_NAME, 'UI_UX_SKILL_QUICK_REFERENCE.md');
      if (!(await FileSystemUtils.fileExists(uiuxGuidePath))) {
        const uiuxGuide = await this.getUIUXQuickReference();
        await FileSystemUtils.writeFile(uiuxGuidePath, uiuxGuide);
      }

      // Deploy/update knowledge base (built-in only, preserves custom/)
      await this.deployKnowledge(heraspecPath);

      // Create template files
      await this.createTemplateFiles(heraspecPath, alreadyInitialized);

      // Migration: Check for AGENTS.md and rename it to AGENTS.heraspec.md
      const legacyAgentsPath = path.join(resolvedPath, 'AGENTS.md');
      const newAgentsPath = path.join(resolvedPath, HERASPEC_MARKERS.AGENTS_MD);
      
      if (await FileSystemUtils.fileExists(legacyAgentsPath) && !(await FileSystemUtils.fileExists(newAgentsPath))) {
          await FileSystemUtils.moveFile(legacyAgentsPath, newAgentsPath);
      }

      // Create or update root AGENTS.md (merge Skills section if exists)
      await this.updateAgentsFile(newAgentsPath, alreadyInitialized);

      // Update installed built-in skills (only on re-init, skip custom project skills)
      if (alreadyInitialized) {
        await this.updateInstalledSkills(heraspecPath);
      }

      // For all projects (new or existing), ensure project-memory is installed and check for history
      await this.checkAndBootstrapMemory(heraspecPath, resolvedPath, spinner);

      // Update related markdown files (README.md, etc.)
      await this.updateRelatedMarkdownFiles(resolvedPath);

      spinner.stop();

      // Automate Memory Indexing and Context Generation
      try {
        const memoryCommand = new MemoryCommand();
        await memoryCommand.index({ depth: "3", yes: true }, resolvedPath);
        await memoryCommand.context({ output: 'file' }, resolvedPath);
      } catch (err) {
        // Silently continue if something goes wrong
      }

      console.log();
      console.log(
        chalk.green(
          alreadyInitialized
            ? '✔ HeraSpec updated successfully'
            : '✔ HeraSpec initialized successfully'
        )
      );

      console.log();
      console.log(chalk.cyan('Next steps:'));
      console.log(
        chalk.gray('1. Review and update heraspec/project.md with your project details')
      );
      console.log(
        chalk.gray('2. Create your first change: "Create a HeraSpec change to..."')
      );
      console.log(
        chalk.gray('3. List changes: heraspec list')
      );
    } catch (error) {
      spinner.fail(chalk.red(`Error: ${(error as Error).message}`));
      throw error;
    }
  }

  private async createTemplateFiles(
    heraspecPath: string,
    skipExisting: boolean
  ): Promise<void> {
    const projectMdPath = path.join(heraspecPath, HERASPEC_MARKERS.PROJECT_MD);
    const configYamlPath = path.join(heraspecPath, HERASPEC_MARKERS.CONFIG_YAML);
    const newProjectTemplate = TemplateManager.getProjectTemplate();

    // Handle project.md with smart merge
    const projectExists = await FileSystemUtils.fileExists(projectMdPath);

    if (!projectExists) {
      // New project — write fresh template
      await FileSystemUtils.writeFile(projectMdPath, newProjectTemplate);
    } else if (skipExisting) {
      // Re-init: check if template has new content that existing file doesn't have
      const existingContent = await FileSystemUtils.readFile(projectMdPath);
      const hasChanges = this.detectTemplateChanges(existingContent, newProjectTemplate);

      if (hasChanges) {
        // Create numbered backup
        const backupPath = await this.createNumberedBackup(projectMdPath, heraspecPath);
        const backupName = path.basename(backupPath);

        // Write merged content: new template sections + merge reference
        const mergedContent = this.buildMergedProjectMd(existingContent, newProjectTemplate, backupName);
        await FileSystemUtils.writeFile(projectMdPath, mergedContent);
      }
      // else: no template changes, keep existing file as-is
    } else {
      // First init but file somehow exists (edge case) — overwrite
      await FileSystemUtils.writeFile(projectMdPath, newProjectTemplate);
    }

    // Create config.yaml (only if not exists)
    if (!(await FileSystemUtils.fileExists(configYamlPath))) {
      if (projectExists) {
        await this.migrateLegacyProjectMd(projectMdPath, configYamlPath);
      } else {
        await FileSystemUtils.writeFile(
          configYamlPath,
          TemplateManager.getConfigTemplate()
        );
      }
    }
  }

  /**
   * Migrate legacy project.md (extract technical configs to config.yaml)
   */
  private async migrateLegacyProjectMd(projectMdPath: string, configYamlPath: string): Promise<void> {
    const content = await FileSystemUtils.readFile(projectMdPath);
    let newYaml = `projectType: generic-webapp\nprojectName: "HeraSpec Project"\ndescription: "A new project using HeraSpec"\nskills: []\n`;
    
    // Attempt to extract project type
    const projectTypeMatch = content.match(/## Project Types\\s*\\n\\s*-\\s*([a-zA-Z0-9-]+)/);
    if (projectTypeMatch && projectTypeMatch[1]) {
       newYaml = newYaml.replace(/projectType:.*/, `projectType: ${projectTypeMatch[1]}`);
    }

    // Try to extract tech stack
    const stackMatch = content.match(/## Tech Stack\\s*\\n([^#]+)/);
    if (stackMatch && stackMatch[1]) {
       const stackItems = stackMatch[1].split('\\n')
         .filter(line => line.trim().startsWith('-'))
         .map(line => line.replace('-', '').trim());
       if (stackItems.length > 0) {
         newYaml += `techStack:\n` + stackItems.map(item => `  - "${item}"`).join('\n') + '\n';
       }
    }

    await FileSystemUtils.writeFile(configYamlPath, newYaml);
    
    // Optionally clean up project.md by removing Project Types and Tech Stack
    let updatedMd = content;
    updatedMd = updatedMd.replace(/## Project Types[\\s\\S]*?(?=##|$)/, '');
    updatedMd = updatedMd.replace(/## Tech Stack[\\s\\S]*?(?=##|$)/, '');
    
    // Also add a migration note at top if not present
    if (!updatedMd.includes('<!-- HeraSpec Update: Migrated config to config.yaml -->')) {
        updatedMd = `<!-- HeraSpec Update: Migrated config to config.yaml -->\n` + updatedMd.trimStart();
    }
    await FileSystemUtils.writeFile(projectMdPath, updatedMd);
  }

  /**
   * Detect if the new template has sections that the existing file lacks
   */
  private detectTemplateChanges(existingContent: string, newTemplate: string): boolean {
    // Extract ## section headers from both
    const sectionRegex = /^## .+$/gm;
    const existingSections = new Set(
      (existingContent.match(sectionRegex) || []).map(s => s.trim().toLowerCase())
    );
    const newSections = (newTemplate.match(sectionRegex) || []).map(s => s.trim().toLowerCase());

    // Check if any new section is missing from existing
    for (const section of newSections) {
      if (!existingSections.has(section)) {
        return true; // New section found
      }
    }

    return false;
  }

  /**
   * Create numbered backup: project.back1.md, project.back2.md, etc.
   */
  private async createNumberedBackup(filePath: string, dirPath: string): Promise<string> {
    const ext = path.extname(filePath);
    const base = path.basename(filePath, ext);
    let backupNumber = 1;

    while (true) {
      const backupPath = path.join(dirPath, `${base}.back${backupNumber}${ext}`);
      if (!(await FileSystemUtils.fileExists(backupPath))) {
        // Copy existing file to backup
        await FileSystemUtils.copyFile(filePath, backupPath);
        return backupPath;
      }
      backupNumber++;
      if (backupNumber > 99) break; // Safety limit
    }

    // Fallback: overwrite last backup
    const fallbackPath = path.join(dirPath, `${base}.back99${ext}`);
    await FileSystemUtils.copyFile(filePath, fallbackPath);
    return fallbackPath;
  }

  /**
   * Build merged project.md:
   * - Keeps all existing user content (descriptions, tech stack, conventions)
   * - Adds any NEW sections from the template that don't exist yet
   * - Adds a merge note at the top referencing the backup
   */
  private buildMergedProjectMd(
    existingContent: string,
    newTemplate: string,
    backupFileName: string
  ): string {
    // Parse sections from both files
    const existingSections = this.parseSections(existingContent);
    const templateSections = this.parseSections(newTemplate);

    // Build merged content: existing sections take priority, new sections are appended
    const mergedParts: string[] = [];
    const existingSectionHeaders = new Set(
      existingSections.map(s => s.header.trim().toLowerCase())
    );

    // 1. Add merge notice at top
    const mergeNote = `<!-- HeraSpec Update: Template updated. Previous version backed up to "${backupFileName}". New sections (if any) have been appended below. -->\n`;
    mergedParts.push(mergeNote);

    // 2. Keep all existing content intact
    mergedParts.push(existingContent.trimEnd());

    // 3. Append any NEW sections from template that don't exist in current file
    const newSections: { header: string; content: string }[] = [];
    for (const section of templateSections) {
      if (!existingSectionHeaders.has(section.header.trim().toLowerCase())) {
        newSections.push(section);
      }
    }

    if (newSections.length > 0) {
      mergedParts.push('\n\n<!-- New sections added by HeraSpec update -->');
      for (const section of newSections) {
        mergedParts.push(`\n${section.header}\n${section.content.trimEnd()}`);
      }
    }

    return mergedParts.join('\n').trimEnd() + '\n';
  }

  /**
   * Parse markdown sections (## headers) from content
   */
  private parseSections(content: string): { header: string; content: string }[] {
    const sections: { header: string; content: string }[] = [];
    const lines = content.split('\n');
    let currentHeader = '';
    let currentContent: string[] = [];

    for (const line of lines) {
      if (line.match(/^## /)) {
        // Save previous section
        if (currentHeader) {
          sections.push({ header: currentHeader, content: currentContent.join('\n') });
        }
        currentHeader = line;
        currentContent = [];
      } else if (currentHeader) {
        currentContent.push(line);
      }
    }

    // Save last section
    if (currentHeader) {
      sections.push({ header: currentHeader, content: currentContent.join('\n') });
    }

    return sections;
  }

  private async updateAgentsFile(agentsPath: string, alreadyInitialized: boolean): Promise<void> {
    const skillsSectionMarker = '## Skills System';

    if (!alreadyInitialized) {
      // New project: create full template
      await FileSystemUtils.writeFile(
        agentsPath,
        TemplateManager.getAgentsTemplate()
      );
      return;
    }

    // Existing project: merge or overwrite Skills section to ensure latest rules are applied
    let existingContent = '';
    if (await FileSystemUtils.fileExists(agentsPath)) {
      existingContent = await FileSystemUtils.readFile(agentsPath);
    } else {
      // Root AGENTS.md missing but project initialized? Create it.
      await FileSystemUtils.writeFile(
        agentsPath,
        TemplateManager.getAgentsTemplate()
      );
      return;
    }

    // Get the latest Skills section template
    const latestSkillsSection = await this.getSkillsSection();
    
    // Guarantee Universal Safety Rules are up to date
    const safetyMarker = '## Universal Safety Rules';
    const fullTemplate = TemplateManager.getAgentsTemplate();
    const safetyEndIndex = fullTemplate.indexOf('## Core Workflow');
    const safetySection = fullTemplate.substring(fullTemplate.indexOf(safetyMarker), safetyEndIndex).trim();

    if (existingContent.includes(safetyMarker)) {
        existingContent = this.replaceSafetyRules(existingContent, safetySection);
    } else {
        // Insert at the beginning or after header
        if (existingContent.startsWith('# ')) {
            const firstLineEnd = existingContent.indexOf('\n') + 1;
            existingContent = existingContent.substring(0, firstLineEnd) + '\n' + safetySection + '\n\n' + existingContent.substring(firstLineEnd);
        } else {
            existingContent = safetySection + '\n\n' + existingContent;
        }
    }

    // Update Core Workflow section (includes backup ignore rule, memory workflow, etc.)
    const coreWorkflowMarker = '## Core Workflow';
    const coreWorkflowEndMarker = '## Skills System';
    const coreWorkflowEndIndex = fullTemplate.indexOf(coreWorkflowEndMarker);
    const coreWorkflowStartIndex = fullTemplate.indexOf(coreWorkflowMarker);

    if (coreWorkflowStartIndex !== -1 && coreWorkflowEndIndex !== -1) {
      const coreWorkflowSection = fullTemplate.substring(coreWorkflowStartIndex, coreWorkflowEndIndex).trim();
      
      if (existingContent.includes(coreWorkflowMarker)) {
        existingContent = this.replaceSection(existingContent, coreWorkflowMarker, coreWorkflowSection);
      } else {
        // Append after Safety Rules
        const safetyEndPos = existingContent.indexOf('\n## ', existingContent.indexOf(safetyMarker) + safetyMarker.length);
        if (safetyEndPos !== -1) {
          const before = existingContent.substring(0, safetyEndPos).trimEnd();
          const after = existingContent.substring(safetyEndPos);
          existingContent = before + '\n\n' + coreWorkflowSection + '\n\n' + after;
        }
      }
    }

    // Update Skills section
    let updatedContent = existingContent;
    if (existingContent.includes(skillsSectionMarker) || existingContent.includes('## Skills system')) {
      updatedContent = this.replaceSkillsSection(existingContent, latestSkillsSection);
    } else {
      updatedContent = this.appendSkillsSection(existingContent, latestSkillsSection);
    }

    // Update Memory section
    const oldMemoryMarker = '## Memory-Aware Development';
    const newMemoryMarker = '## Proactive Memory-Aware Development';
    
    // Extract new memory section from fullTemplate
    const memoryStartIndex = fullTemplate.indexOf(newMemoryMarker);
    if (memoryStartIndex !== -1) {
      let memoryEndIndex = fullTemplate.indexOf('\n## ', memoryStartIndex + newMemoryMarker.length);
      if (memoryEndIndex === -1) memoryEndIndex = fullTemplate.length;
      
      const memorySection = fullTemplate.substring(memoryStartIndex, memoryEndIndex).trim();

      if (updatedContent.includes(oldMemoryMarker)) {
        updatedContent = this.replaceSection(updatedContent, oldMemoryMarker, memorySection);
      } else if (updatedContent.includes(newMemoryMarker)) {
        updatedContent = this.replaceSection(updatedContent, newMemoryMarker, memorySection);
      } else {
        // Append at the end
        updatedContent = updatedContent.trimEnd() + '\n\n' + memorySection;
      }
    }
    
    if (updatedContent !== existingContent) {
        await FileSystemUtils.writeFile(agentsPath, updatedContent);
    }
  }

  /**
   * Find the index of the next top-level H2 section in the markdown content.
   * Tracks fenced code blocks to ignore H2 headers inside code blocks.
   */
  private findSectionEndIndex(content: string, startIndex: number): number {
    const lines = content.substring(startIndex).split(/\r?\n/);
    let offset = startIndex;
    let inCodeBlock = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineLengthWithNewline = line.length + (content.charAt(offset + line.length) === '\r' ? 2 : 1);

      if (i === 0) {
        offset += lineLengthWithNewline;
        continue;
      }

      if (line.trim().startsWith('```')) {
        inCodeBlock = !inCodeBlock;
      }

      if (!inCodeBlock && line.startsWith('## ')) {
        return offset;
      }

      offset += lineLengthWithNewline;
    }

    return content.length;
  }

  /**
   * Finds the start index of the next standard section in the sequence.
   * This is used to replace the entire section cleanly, even if there are internal H2s or duplicates.
   */
  private findNextSectionIndex(content: string, startIndex: number, currentHeader: string): number {
    const sectionsOrder = [
      ['## Universal Safety Rules'],
      ['## Core Workflow'],
      ['## Skills System', '## Skills system', '### Skills System', '### skills system'],
      ['## Proactive Memory-Aware Development', '## Memory-Aware Development']
    ];

    // Find the group index of the current header
    let currentGroupIndex = -1;
    for (let i = 0; i < sectionsOrder.length; i++) {
      if (sectionsOrder[i].some(h => currentHeader.toLowerCase().trim() === h.toLowerCase().trim())) {
        currentGroupIndex = i;
        break;
      }
    }

    if (currentGroupIndex === -1) {
      // Fallback to finding the next generic H2 header
      return this.findSectionEndIndex(content, startIndex);
    }

    // Look for any variation of subsequent section headers in the content after startIndex
    let nextSectionIndex = -1;

    for (let i = currentGroupIndex + 1; i < sectionsOrder.length; i++) {
      const variations = sectionsOrder[i];
      for (const variation of variations) {
        const idx = content.indexOf(variation, startIndex + currentHeader.length);
        if (idx !== -1) {
          if (nextSectionIndex === -1 || idx < nextSectionIndex) {
            nextSectionIndex = idx;
          }
        }
      }
    }

    if (nextSectionIndex !== -1) {
      return nextSectionIndex;
    }

    // If no subsequent standard sections are found, fall back to next generic H2 or end of file
    return this.findSectionEndIndex(content, startIndex);
  }

  /**
   * Generic section replacer: replace content from marker to next H2 header or endMarker
   */
  private replaceSection(content: string, sectionMarker: string, newSection: string, endMarker?: string): string {
    const startIndex = content.indexOf(sectionMarker);
    if (startIndex === -1) return content;

    let endIndex = -1;
    if (endMarker) {
      endIndex = content.indexOf(endMarker, startIndex + sectionMarker.length);
    }

    if (endIndex === -1) {
      endIndex = this.findNextSectionIndex(content, startIndex, sectionMarker);
    }

    const before = content.substring(0, startIndex).trimEnd();
    const after = content.substring(endIndex);
    return before + '\n\n' + newSection + (after.trimStart().startsWith('\n') ? '' : '\n\n') + after;
  }

  private replaceSkillsSection(existingContent: string, newSkillsSection: string, endMarker?: string): string {
    const startMarkers = ['## Skills System', '## Skills system', '### Skills System', '### Skills system'];
    
    let startIndex = -1;
    let foundMarker = '';
    
    for (const marker of startMarkers) {
        startIndex = existingContent.indexOf(marker);
        if (startIndex !== -1) {
            foundMarker = marker;
            break;
        }
    }

    if (startIndex === -1) {
      return this.appendSkillsSection(existingContent, newSkillsSection);
    }

    let endIndex = -1;
    if (endMarker) {
      endIndex = existingContent.indexOf(endMarker, startIndex + foundMarker.length);
    }

    if (endIndex === -1) {
      endIndex = this.findNextSectionIndex(existingContent, startIndex, foundMarker);
    }

    const before = existingContent.substring(0, startIndex).trimEnd();
    const after = existingContent.substring(endIndex);
    return before + '\n\n' + newSkillsSection + (after.trimStart().startsWith('\n') ? '' : '\n\n') + after;
  }

  private replaceSafetyRules(existingContent: string, newSafetySection: string): string {
    return this.replaceSection(existingContent, '## Universal Safety Rules', newSafetySection, '## Core Workflow');
  }

  private appendSkillsSection(existingContent: string, skillsSection: string): string {
    // Try to insert before "## Rules" section
    const rulesMarker = '\n## Rules\n';
    const rulesIndex = existingContent.indexOf(rulesMarker);
    
    if (rulesIndex !== -1) {
      const before = existingContent.substring(0, rulesIndex).trimEnd();
      const after = existingContent.substring(rulesIndex);
      return before + '\n\n' + skillsSection + '\n\n' + after;
    }

    // If no Rules section, try before any "## Rules" (without newline)
    const rulesMarker2 = '## Rules';
    const rulesIndex2 = existingContent.indexOf(rulesMarker2);
    if (rulesIndex2 !== -1 && rulesIndex2 > 0) {
      const before = existingContent.substring(0, rulesIndex2).trimEnd();
      const after = existingContent.substring(rulesIndex2);
      return before + '\n\n' + skillsSection + '\n\n' + after;
    }

    // If no Rules section, append at the end
    return existingContent.trimEnd() + '\n\n' + skillsSection;
  }


  private async getSkillsSection(): Promise<string> {
    return TemplateManager.getSkillsSection();
  }

  /**
   * Resolve core templates directory (same logic as skill.ts)
   */
  private async getCoreTemplatesDir(): Promise<string | null> {
    const possiblePaths: string[] = [];

    try {
      const packageJsonPath = require.resolve('../package.json');
      const packageDir = path.dirname(packageJsonPath);
      possiblePaths.push(
        join(packageDir, 'src', 'core', 'templates', 'skills'),
        join(packageDir, 'dist', 'core', 'templates', 'skills'),
      );
    } catch { /* continue */ }

    try {
      const packageJsonPath = require.resolve('heraspec/package.json');
      const packageDir = path.dirname(packageJsonPath);
      possiblePaths.push(
        join(packageDir, 'dist', 'core', 'templates', 'skills'),
        join(packageDir, 'src', 'core', 'templates', 'skills'),
      );
    } catch { /* continue */ }

    possiblePaths.push(
      join(__dirname, '..', '..', 'src', 'core', 'templates', 'skills'),
      join(__dirname, '..', 'core', 'templates', 'skills'),
      join(process.cwd(), 'src', 'core', 'templates', 'skills'),
    );

    for (const p of possiblePaths) {
      if (await FileSystemUtils.fileExists(p)) return p;
    }
    return null;
  }

  /**
   * Update installed built-in skills on re-init.
   *
   * Rules:
   * - Only update skills that exist in SKILL_TEMPLATE_MAP (built-in / known skills)
   * - Skip skills NOT in the template map (custom skills added by the project)
   * - For each matching skill: update skill.md + re-copy resourceDirs from template
   *   but PRESERVE templates/, scripts/, examples/ sub-folders added by user
   */
  private async updateInstalledSkills(heraspecPath: string): Promise<void> {
    const skillsDir = path.join(heraspecPath, SKILLS_DIR_NAME);
    if (!(await FileSystemUtils.fileExists(skillsDir))) return;

    const coreTemplatesDir = await this.getCoreTemplatesDir();
    if (!coreTemplatesDir) return;

    const allTemplates = getAllSkillTemplates();
    let updatedCount = 0;
    let skippedCount = 0;

    // Build a set of known skill keys (skillName only, or "projectType/skillName")
    // for fast lookup when walking the installed skills directory
    const installedSkillPaths = await this.collectInstalledSkillPaths(skillsDir);

    for (const { skillPath, skillName, projectType } of installedSkillPaths) {
      // Check if this skill is a known built-in skill
      const templateInfo = getSkillTemplateInfo(skillName, projectType);

      if (!templateInfo) {
        // Not a built-in skill — custom project skill, leave it alone
        skippedCount++;
        continue;
      }

      const templateFile = path.join(coreTemplatesDir, templateInfo.templateFileName);
      if (!(await FileSystemUtils.fileExists(templateFile))) {
        skippedCount++;
        continue;
      }

      // Update skill.md with latest from template
      await FileSystemUtils.copyFile(templateFile, path.join(skillPath, 'skill.md'));

      // Update Vietnamese translation if it exists in template
      if (templateInfo.viFileName) {
        const viFile = path.join(coreTemplatesDir, templateInfo.viFileName);
        if (await FileSystemUtils.fileExists(viFile)) {
          await FileSystemUtils.copyFile(viFile, path.join(skillPath, 'skill.vi.md'));
        }
      }

      // Re-copy resourceDirs from template (overwrite built-in resources)
      // These are owned by the skill template, not by the user
      if (templateInfo.resourceDirs) {
        for (const resourceDir of templateInfo.resourceDirs) {
          const srcResourceDir = path.join(coreTemplatesDir, resourceDir);
          const destResourceDir = path.join(skillPath, path.basename(resourceDir));

          if (await FileSystemUtils.fileExists(srcResourceDir)) {
            // Remove old and replace — these are template-owned directories
            if (await FileSystemUtils.fileExists(destResourceDir)) {
              await FileSystemUtils.removeDirectory(destResourceDir, true);
            }
            await FileSystemUtils.copyDirectory(srcResourceDir, destResourceDir);
          }
        }
      }

      // Ensure standard dirs exist (never removed, just ensured)
      for (const dir of ['templates', 'scripts', 'examples']) {
        await FileSystemUtils.createDirectory(path.join(skillPath, dir));
      }

      updatedCount++;
    }

    if (updatedCount > 0) {
      console.log(chalk.gray(`  ✓ Updated ${updatedCount} built-in skill(s)${skippedCount > 0 ? `, skipped ${skippedCount} custom skill(s)` : ''}`));
    }
  }

  /**
   * Walk heraspec/skills/ and return all installed skill paths with metadata
   */
  private async collectInstalledSkillPaths(
    skillsDir: string
  ): Promise<Array<{ skillPath: string; skillName: string; projectType?: string }>> {
    const result: Array<{ skillPath: string; skillName: string; projectType?: string }> = [];
    const entries = await FileSystemUtils.readDirectory(skillsDir);

    // Known project-type folder names (they contain sub-skill folders)
    const knownProjectTypes = [
      'wordpress', 'wordpress-plugin', 'wordpress-theme',
      'perfex-module', 'laravel-package', 'node-service',
      'generic-webapp', 'backend-api', 'frontend-app', 'multi-stack',
    ];

    for (const entry of entries) {
      const entryPath = path.join(skillsDir, entry);
      const stats = await FileSystemUtils.stat(entryPath);
      if (!stats.isDirectory()) continue;

      if (knownProjectTypes.includes(entry)) {
        // It's a project-type folder — walk its children
        const subEntries = await FileSystemUtils.readDirectory(entryPath);
        for (const sub of subEntries) {
          const subPath = path.join(entryPath, sub);
          const subStats = await FileSystemUtils.stat(subPath);
          if (subStats.isDirectory() && await FileSystemUtils.fileExists(path.join(subPath, 'skill.md'))) {
            result.push({ skillPath: subPath, skillName: sub, projectType: entry });
          }
        }
      } else {
        // Cross-cutting skill
        if (await FileSystemUtils.fileExists(path.join(entryPath, 'skill.md'))) {
          result.push({ skillPath: entryPath, skillName: entry });
        }
      }
    }

    return result;
  }

  /**
   * Prompt user to bootstrap memory if historical specs are found
   */
  private async checkAndBootstrapMemory(heraspecPath: string, projectPath: string, spinner: ora.Ora): Promise<void> {
    const memorySkillDir = path.join(heraspecPath, SKILLS_DIR_NAME, 'project-memory');
    if (!(await FileSystemUtils.fileExists(memorySkillDir))) {
      // Automatically install project-memory skill
      spinner.stop();
      try {
        const { SkillCommand } = await import('../commands/skill.js');
        const skillCommand = new SkillCommand();
        console.log(chalk.cyan('\n📦 Auto-installing recommended skill: "project-memory"'));
        await skillCommand.add('project-memory', undefined, projectPath);
        console.log(); // Spacing
      } catch (err) {
        spinner.start();
        return; // failed to install, silently skip memory bootstrap
      }
      spinner.start();
    }

    // Checking if there are markdown files in specs or archives
    const specsDir = path.join(heraspecPath, SPECS_DIR_NAME);
    const archivesDir = path.join(heraspecPath, ARCHIVES_DIR_NAME);
    let hasHistoricalData = false;

    for (const dir of [specsDir, archivesDir]) {
      if (await FileSystemUtils.fileExists(dir)) {
        const entries = await FileSystemUtils.readDirectory(dir);
        if (entries.some(e => e.endsWith('.md'))) {
          hasHistoricalData = true;
          break;
        }
        // Sub-directories (e.g., changes/archives are folders with md in them)
        if (!hasHistoricalData) {
           for (const e of entries) {
              const fullPath = path.join(dir, e);
              const st = await FileSystemUtils.stat(fullPath);
              if (st.isDirectory()) {
                const subEntries = await FileSystemUtils.readDirectory(fullPath);
                if (subEntries.some(sub => sub.endsWith('.md'))) {
                  hasHistoricalData = true;
                  break;
                }
              }
           }
        }
      }
    }

    if (!hasHistoricalData) return;

    // Check if memory store already has significant data (>0 ops) to avoid bugging them every time
    const memoryDbPath = path.join(heraspecPath, 'memory', 'heraspec-memory.db');
    if (await FileSystemUtils.fileExists(memoryDbPath)) {
        // We'll skip forcing a prompt if the DB exists. The user can run heraspec memory bootstrap manually.
        // Or we could check the size, but skipping is safer to avoid annoyance.
        return;
    }

    // Stop the spinner before launching an interactive prompt to avoid stdout conflicts
    spinner.stop();
    
    console.log(chalk.cyan('\n💡 Tip: Your project has historical specs.'));
    const { confirm } = await import('@inquirer/prompts');
    const answer = await confirm({
      message: 'Would you like to bootstrap the "project-memory" system from these existing specs?',
      default: true,
    });

    if (answer) {
      try {
        const memoryCommand = new MemoryCommand();
        await memoryCommand.bootstrap({ yes: true }, projectPath);
      } catch (error) {
        console.log(chalk.red(`Bootstrap failed: ${error instanceof Error ? error.message : 'Unknown'}`));
      }
    }
    
    // Restart spinner for the rest of the flow
    spinner.start();
  }


  /**
   * Get the knowledge source directory from CLI package
   */
  private async getKnowledgeSourceDir(): Promise<string | null> {
    const possiblePaths: string[] = [];

    // Strategy 1: Resolve from package.json location
    try {
      const packageJsonPath = require.resolve('../package.json');
      const packageDir = path.dirname(packageJsonPath);

      possiblePaths.push(
        join(packageDir, 'src', 'core', 'templates', 'skills', 'knowledge'),
        join(packageDir, 'dist', 'core', 'templates', 'skills', 'knowledge'),
      );
    } catch {
      // Could not resolve, continue
    }

    // Strategy 2: npm installed package
    try {
      const packageJsonPath = require.resolve('heraspec/package.json');
      const packageDir = path.dirname(packageJsonPath);

      possiblePaths.push(
        join(packageDir, 'dist', 'core', 'templates', 'skills', 'knowledge'),
        join(packageDir, 'src', 'core', 'templates', 'skills', 'knowledge'),
      );
    } catch {
      // Package not found, continue
    }

    // Strategy 3: Relative paths from current file
    possiblePaths.push(
      join(__dirname, '..', '..', 'src', 'core', 'templates', 'skills', 'knowledge'),
      join(__dirname, '..', 'core', 'templates', 'skills', 'knowledge'),
      join(process.cwd(), 'src', 'core', 'templates', 'skills', 'knowledge'),
    );

    for (const possiblePath of possiblePaths) {
      if (await FileSystemUtils.fileExists(possiblePath)) {
        return possiblePath;
      }
    }

    return null;
  }

  /**
   * Deploy/update built-in knowledge base, preserving custom/ directory
   */
  private async deployKnowledge(heraspecPath: string): Promise<void> {
    const knowledgeDir = path.join(heraspecPath, KNOWLEDGE_DIR_NAME);
    const sourceDir = await this.getKnowledgeSourceDir();

    if (!sourceDir) {
      // No knowledge source available — skip silently
      return;
    }

    // Copy built-in files: index.json, README.md
    const builtinFiles = ['index.json', 'README.md'];
    for (const file of builtinFiles) {
      const srcFile = path.join(sourceDir, file);
      if (await FileSystemUtils.fileExists(srcFile)) {
        await FileSystemUtils.copyFile(srcFile, path.join(knowledgeDir, file));
      }
    }

    // Copy built-in category directories (frameworks, apis, platforms)
    // SKIP 'custom' — never touch user's custom knowledge
    const builtinCategories = ['frameworks', 'apis', 'platforms'];
    for (const category of builtinCategories) {
      const srcCategory = path.join(sourceDir, category);
      if (await FileSystemUtils.fileExists(srcCategory)) {
        const destCategory = path.join(knowledgeDir, category);
        // Remove old built-in category and replace with latest
        if (await FileSystemUtils.fileExists(destCategory)) {
          await FileSystemUtils.removeDirectory(destCategory, true);
        }
        await FileSystemUtils.copyDirectory(srcCategory, destCategory);
      }
    }

    // Create custom/ scaffold if it doesn't exist
    const customDir = path.join(knowledgeDir, 'custom');
    if (!(await FileSystemUtils.fileExists(customDir))) {
      await FileSystemUtils.createDirectory(customDir);
      await FileSystemUtils.writeFile(
        path.join(customDir, 'index.json'),
        JSON.stringify({
          version: '1.0',
          description: 'Custom knowledge entries — managed by user, never overwritten by CLI',
          entries: [],
        }, null, 2)
      );
    }
  }

  private async getSkillsReadmeTemplate(): Promise<string> {
    return `# Skills Directory

This directory contains reusable skills for HeraSpec projects.

## What Are Skills?

Skills are reusable patterns and workflows that help AI agents implement tasks consistently. Each skill contains:

- **skill.md**: Complete guide on how to use the skill
- **templates/**: Reusable templates
- **scripts/**: Automation scripts
- **examples/**: Good and bad examples

## How Agents Use Skills

When a task has a skill tag:
\`\`\`markdown
## 1. Feature (projectType: perfex-module, skill: module-codebase)
- [ ] Task 1.1
\`\`\`

The agent will:
1. Find skill folder: \`heraspec/skills/perfex-module/module-codebase/\`
2. Read \`skill.md\` to understand process
3. Use templates and scripts from skill folder
4. Follow guidelines in skill.md

## Available Skills

Run \`heraspec skill list\` to see all available skills.

## UI/UX Skill - Creating Full Theme Packages

The **UI/UX skill** is particularly useful for creating complete website themes with multiple pages.

### Quick Start

When you need to create a full website package, use prompts like:

\`\`\`
Tạo gói website đầy đủ cho [PRODUCT_TYPE] với style [STYLE_KEYWORDS].
Sử dụng skill ui-ux với hybrid mode để search design intelligence.
Tạo các trang: home, about, [other pages].
Stack: [html-tailwind/react/nextjs].
Đảm bảo responsive, accessible, consistent design system.
\`\`\`

### Prompt Templates

For detailed prompt examples and templates, see:
- **Example Prompts**: \`heraspec/skills/ui-ux/templates/example-prompt-full-theme.md\`
- **Prompt Templates**: \`heraspec/skills/ui-ux/templates/prompt-template-full-theme.md\`

These templates include:
- Ready-to-use prompts for different website types (E-commerce, SaaS, Service, Blog, Portfolio)
- Step-by-step instructions
- Search command examples
- Best practices

### Search Modes

UI/UX skill supports 3 search modes:
- **BM25 (default)**: Fast keyword-based search, zero dependencies
- **Vector**: Semantic search, ~15-20% better results (requires: \`pip install sentence-transformers scikit-learn\`)
- **Hybrid**: Best of both, ~25% better results (requires: \`pip install sentence-transformers scikit-learn\`)

**Usage:**
\`\`\`bash
# BM25 (default)
python3 heraspec/skills/ui-ux/scripts/search.py "minimalism" --domain style

# Vector (semantic)
python3 heraspec/skills/ui-ux/scripts/search.py "elegant dark theme" --domain style --mode vector

# Hybrid (best)
python3 heraspec/skills/ui-ux/scripts/search.py "modern minimal design" --domain style --mode hybrid
\`\`\`

### Multi-Page Support

Default page set includes:
1. Home
2. About
3. Post Details
4. Category
5. Pricing
6. FAQ
7. Contact
8. Product Category (e-commerce)
9. Product Details (e-commerce)

Search page types:
\`\`\`bash
python3 heraspec/skills/ui-ux/scripts/search.py "home homepage" --domain pages
python3 heraspec/skills/ui-ux/scripts/search.py "pricing plans" --domain pages
\`\`\`

### Adding UI/UX Skill to Your Project

1. Copy skill from HeraSpec core:
   \`\`\`bash
   # Copy UI/UX skill
   cp -r /path/to/HeraSpec/src/core/templates/skills/ui-ux heraspec/skills/
   \`\`\`

2. Or use \`heraspec skill add ui-ux\` (if available)

3. Read \`heraspec/skills/ui-ux/skill.md\` for complete documentation

### Flatsome UX Element Skill

Use the **ux-element** skill when developing elements for UX Builder in Flatsome themes.

**Usage:**
\`\`\`bash
heraspec skill add ux-element --project-type wordpress
\`\`\`

Read \`heraspec/skills/wordpress/ux-element/skill.md\` for the **Wrapping Rule** and template usage.

## Creating New Skills

1. Create skill folder structure
2. Write \`skill.md\` following the template
3. Add templates, scripts, examples as needed

See \`docs/SKILLS_STRUCTURE_PROPOSAL.md\` for detailed structure.
`;
  }

  private async getUIUXQuickReference(): Promise<string> {
    return `# UI/UX Skill - Quick Reference Guide

Quick guide for creating prompts to build full theme packages with multiple pages using the ui-ux skill.

## 📋 Basic Prompt Template

\`\`\`
Create a complete website package for [PRODUCT_TYPE] with the following requirements:

**Project Information:**
- Product type: [SaaS / E-commerce / Service / Portfolio / etc.]
- Style: [minimal / elegant / modern / bold / etc.]
- Industry: [Healthcare / Fintech / Beauty / etc.]
- Stack: [html-tailwind / react / nextjs / etc.]
- Pages to create: home, about, [add other pages if needed]

**Process:**
1. Use skill ui-ux to search design intelligence with hybrid mode
2. Create shared components first (Header, Footer, Button, Card)
3. Implement pages in order
4. Ensure consistency in colors, typography, spacing
5. Verify with pre-delivery checklist

**Quality Requirements:**
- ✅ Consistent design system
- ✅ Responsive (320px, 768px, 1024px, 1440px)
- ✅ Accessible (WCAG AA minimum)
- ✅ Performance optimized
\`\`\`

## 🎯 Specific Prompt Examples

### E-Commerce
\`\`\`
Create a complete website package for an online fashion store.

Product type: E-commerce Luxury
Style: elegant, premium, sophisticated
Stack: Next.js with Tailwind CSS
Pages: home, about, product category, product details, cart, checkout, thank you, faq, contact

Use skill ui-ux with hybrid mode. Focus on conversion optimization.
\`\`\`

### SaaS
\`\`\`
Create a complete website package for a project management SaaS platform.

Product type: SaaS (General)
Style: modern, clean, professional
Stack: React with Tailwind CSS
Pages: home, about, pricing, features, faq, contact, login, register, dashboard

Use skill ui-ux with hybrid mode. Ensure professional and trustworthy.
\`\`\`

### Service Business
\`\`\`
Create a complete website package for a healthcare service.

Product type: Beauty & Wellness Service
Style: elegant, minimal, soft, professional
Stack: html-tailwind
Pages: home, about, services, blog listing, post details, category, pricing, faq, contact

Use skill ui-ux with hybrid mode. Focus on trust and credibility.
\`\`\`

## 🔍 Search Modes

### BM25 (Default)
\`\`\`bash
python3 heraspec/skills/ui-ux/scripts/search.py "minimalism" --domain style
\`\`\`
- ✅ Fast, zero dependencies
- ✅ Best for exact keyword matches

### Vector (Semantic)
\`\`\`bash
python3 heraspec/skills/ui-ux/scripts/search.py "elegant dark theme" --domain style --mode vector
\`\`\`
- ✅ Understands meaning and synonyms
- ✅ ~15-20% better results
- ⚠️ Requires: \`pip install sentence-transformers scikit-learn\`

### Hybrid (Best)
\`\`\`bash
python3 heraspec/skills/ui-ux/scripts/search.py "modern minimal design" --domain style --mode hybrid
\`\`\`
- ✅ Combines BM25 + Vector
- ✅ ~25% better results
- ⚠️ Requires: \`pip install sentence-transformers scikit-learn\`

## 📄 Default Page Set

When creating a "complete website package", the default set includes 9 pages:

1. **Home** - Main homepage
2. **About** - Company/story page
3. **Post Details** - Blog/article detail
4. **Category** - Blog/category listing
5. **Pricing** - Pricing plans
6. **FAQ** - Frequently asked questions
7. **Contact** - Contact form
8. **Product Category** - E-commerce category (if applicable)
9. **Product Details** - E-commerce product detail (if applicable)

## 🔧 Search Page Types

\`\`\`bash
# Home page
python3 heraspec/skills/ui-ux/scripts/search.py "home homepage" --domain pages

# About page
python3 heraspec/skills/ui-ux/scripts/search.py "about company story" --domain pages

# Pricing page
python3 heraspec/skills/ui-ux/scripts/search.py "pricing plans tiers" --domain pages

# E-commerce pages
python3 heraspec/skills/ui-ux/scripts/search.py "product-category shop catalog" --domain pages
python3 heraspec/skills/ui-ux/scripts/search.py "product-detail single-product" --domain pages
\`\`\`

## 📚 Detailed Documentation

After copying UI/UX skill to your project, see:
- \`heraspec/skills/ui-ux/skill.md\` - Complete skill documentation
- \`heraspec/skills/ui-ux/templates/example-prompt-full-theme.md\` - Detailed prompt examples
- \`heraspec/skills/ui-ux/templates/prompt-template-full-theme.md\` - Copy-paste templates

## 💡 Tips

1. **Always mention "skill ui-ux"** - Agent will know to use this skill
2. **Encourage using hybrid mode** - Best results
3. **List all pages clearly** - Agent knows exact scope
4. **Require consistency** - Ensures unified design system
5. **Mention pre-delivery checklist** - Agent will verify before delivering

## 🚀 Quick Start

1. Copy UI/UX skill to project:
   \`\`\`bash
   cp -r /path/to/HeraSpec/src/core/templates/skills/ui-ux heraspec/skills/
   \`\`\`

2. Use prompt template from above

3. Agent will automatically:
   - Search design intelligence with skill ui-ux
   - Create shared components
   - Implement each page
   - Verify with checklist
`;
  }

  /**
   * Update related markdown files in the project (README.md, etc.)
   */
  private async updateRelatedMarkdownFiles(projectPath: string): Promise<void> {
    // Update README.md if exists
    const readmePath = path.join(projectPath, 'README.md');
    if (await FileSystemUtils.fileExists(readmePath)) {
      await this.updateReadmeFile(readmePath);
    }
  }

  /**
   * Update README.md with HeraSpec information
   */
  private async updateReadmeFile(readmePath: string): Promise<void> {
    const existingContent = await FileSystemUtils.readFile(readmePath);
    const heraspecSection = this.getHeraSpecReadmeSection();

    let sectionStartIndex = -1;
    let sectionEndIndex = -1;

    const commentMarker = '<!-- HeraSpec Section -->';
    const commentIndex = existingContent.indexOf(commentMarker);
    if (commentIndex !== -1) {
      sectionStartIndex = commentIndex;
      // Find the first header after the comment marker to identify the current section's header
      const firstHeaderIndex = existingContent.indexOf('## ', commentIndex + commentMarker.length);
      if (firstHeaderIndex !== -1) {
        // The end of the section is the next top-level header after this one
        let nextHeaderIndex = existingContent.indexOf('\n## ', firstHeaderIndex + 3);
        if (nextHeaderIndex === -1) {
          nextHeaderIndex = existingContent.indexOf('\n### ', firstHeaderIndex + 3);
        }
        sectionEndIndex = nextHeaderIndex !== -1 ? nextHeaderIndex : existingContent.length;
      } else {
        sectionEndIndex = existingContent.length;
      }
    } else {
      const sectionMarkers = [
        '## HeraSpec Development',
        '## HeraSpec',
        '### HeraSpec Development',
        '### HeraSpec',
      ];
      for (const marker of sectionMarkers) {
        const index = existingContent.indexOf(marker);
        if (index !== -1) {
          sectionStartIndex = index;
          sectionEndIndex = existingContent.indexOf('\n## ', index + marker.length);
          if (sectionEndIndex === -1) {
            sectionEndIndex = existingContent.indexOf('\n### ', index + marker.length);
          }
          if (sectionEndIndex === -1) {
            sectionEndIndex = existingContent.length;
          }
          break;
        }
      }
    }

    if (sectionStartIndex !== -1) {
      // Update existing section
      const before = existingContent.substring(0, sectionStartIndex).trimEnd();
      const after = existingContent.substring(sectionEndIndex);
      const updatedContent = before + '\n\n' + heraspecSection + (after.trimStart().startsWith('\n') ? '' : '\n\n') + after;
      await FileSystemUtils.writeFile(readmePath, updatedContent);
    } else {
      // Add new section
      // Try to insert before common sections like "## Development", "## Setup", "## Contributing"
      const insertBeforeMarkers = [
        '\n## Development',
        '\n## Setup',
        '\n## Contributing',
        '\n## Installation',
        '\n## Getting Started',
      ];

      let inserted = false;
      for (const marker of insertBeforeMarkers) {
        const index = existingContent.indexOf(marker);
        if (index !== -1) {
          const before = existingContent.substring(0, index).trimEnd();
          const after = existingContent.substring(index);
          const updatedContent = before + '\n\n' + heraspecSection + '\n\n' + after;
          await FileSystemUtils.writeFile(readmePath, updatedContent);
          inserted = true;
          break;
        }
      }

      if (!inserted) {
        // Append at the end
        const updatedContent = existingContent.trimEnd() + '\n\n' + heraspecSection;
        await FileSystemUtils.writeFile(readmePath, updatedContent);
      }
    }
  }

  /**
   * Get HeraSpec section content for README.md
   */
  private getHeraSpecReadmeSection(): string {
    return `<!-- HeraSpec Section -->
## HeraSpec Development

This project uses [HeraSpec](https://github.com/your-org/heraspec) for spec-driven development.

### Quick Start

\`\`\`bash
# Initialize HeraSpec (if not already done)
heraspec init

# List active changes
heraspec list

# View a change
heraspec show <change-name>

# Validate changes
heraspec validate <change-name>
\`\`\`

### Project Structure

- \`heraspec/project.md\` - Project overview and configuration
- \`heraspec/specs/\` - Source of truth specifications
- \`heraspec/changes/\` - Active changes in progress
- \`heraspec/skills/\` - Reusable skills for AI agents
- \`AGENTS.heraspec.md\` - AI agent instructions

### Working with Changes

1. **Create a change**: Ask AI to create a HeraSpec change, or create manually
2. **Refine specs**: Review and update delta specs in \`heraspec/specs/<change-name>/\`
3. **Implement**: Follow tasks in \`heraspec/changes/<change-name>/tasks.md\`
4. **Archive**: Run \`heraspec archive <change-name> --yes\` when complete

### Skills

Add skills to your project:

\`\`\`bash
# List available skills
heraspec skill list

# Add a skill
heraspec skill add ui-ux
heraspec skill add unit-test

# View skill details
heraspec skill show ui-ux
\`\`\`

For more information, see the [HeraSpec documentation](https://github.com/your-org/heraspec/docs).

---

*This section is automatically updated by \`heraspec init\`. Last updated: ${new Date().toISOString().split('T')[0]}*`;
  }
}

