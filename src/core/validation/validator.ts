/**
 * HeraSpec Validator
 * Validates specs and changes
 */
import { readFileSync } from 'fs';
import path from 'path';
import { SpecSchema, ChangeSchema } from '../schemas/index.js';
import { MarkdownParser } from '../parsers/markdown-parser.js';
import { FileSystemUtils } from '../../utils/file-system.js';
import { HERASPEC_DIR_NAME, SPECS_DIR_NAME } from '../config.js';

export interface ValidationIssue {
  message: string;
  path?: string;
  line?: number;
  suggestion?: string;
  autoFixable?: boolean;
}

export interface ValidationReport {
  valid: boolean;
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
  suggestions?: string[];
}

export class Validator {
  private strictMode: boolean;

  constructor(strictMode: boolean = false) {
    this.strictMode = strictMode;
  }

  async validateSpec(filePath: string): Promise<ValidationReport> {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      const content = readFileSync(filePath, 'utf-8');
      const parser = new MarkdownParser(content);
      const specName = this.extractNameFromPath(filePath);
      const spec = parser.parseSpec(specName);

      // Validate against schema
      const result = SpecSchema.safeParse(spec);

      if (!result.success) {
        result.error.errors.forEach((err) => {
          errors.push(`${err.path.join('.')}: ${err.message}`);
        });
      }

      // Additional validation rules
      if (spec.requirements.length === 0) {
        errors.push('Spec must have at least one requirement');
      }

      for (const req of spec.requirements) {
        if (!req.description || req.description.trim().length === 0) {
          errors.push(`Requirement "${req.name}" must have a description`);
        }

        if (!req.scenarios || req.scenarios.length === 0) {
          warnings.push(`Requirement "${req.name}" has no scenarios`);
        }
      }

      return {
        valid: errors.length === 0,
        errors,
        warnings,
      };
    } catch (error) {
      return {
        valid: false,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        warnings: [],
      };
    }
  }

  async validateChange(changePath: string): Promise<ValidationReport> {
    const errors: ValidationIssue[] = [];
    const warnings: ValidationIssue[] = [];
    const suggestions: string[] = [];

    // Check for proposal.md
    const proposalPath = path.join(changePath, 'proposal.md');
    if (!(await FileSystemUtils.fileExists(proposalPath))) {
      errors.push({
        message: 'Change must have a proposal.md file',
        path: proposalPath,
        suggestion: `Create proposal.md in ${changePath} with: # Change Proposal: [name]\n\n## Purpose\n[Description]\n\n## Scope\n[What will change]`,
        autoFixable: false,
      });
      suggestions.push(`Create proposal.md file at ${proposalPath}`);
    }

    // Check for tasks.md
    const tasksPath = path.join(changePath, 'tasks.md');
    if (!(await FileSystemUtils.fileExists(tasksPath))) {
      warnings.push({
        message: 'Change has no tasks.md file',
        path: tasksPath,
        suggestion: `Create tasks.md with implementation tasks grouped by project type and skill`,
        autoFixable: false,
      });
    }

    // Validate delta specs if they exist
    // Specs are now in heraspec/specs/<changeName>/ instead of heraspec/changes/<changeName>/specs/
    const changeName = path.basename(changePath);
    const specsDir = path.join(
      '.',
      HERASPEC_DIR_NAME,
      SPECS_DIR_NAME,
      changeName
    );
    if (await FileSystemUtils.fileExists(specsDir)) {
      const deltaSpecs = await this.findDeltaSpecs(specsDir);
      for (const specPath of deltaSpecs) {
        const report = await this.validateDeltaSpec(specPath);
        errors.push(...report.errors);
        warnings.push(...report.warnings);
        if (report.suggestions) {
          suggestions.push(...report.suggestions);
        }
      }
    } else {
      warnings.push({
        message: 'No delta specs found for this change',
        suggestion: `Create delta specs in ${specsDir}/spec.md using ADDED/MODIFIED/REMOVED sections`,
        autoFixable: false,
      });
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      suggestions: suggestions.length > 0 ? suggestions : undefined,
    };
  }

  private async validateDeltaSpec(filePath: string): Promise<ValidationReport> {
    const errors: ValidationIssue[] = [];
    const warnings: ValidationIssue[] = [];
    const suggestions: string[] = [];

    try {
      const content = readFileSync(filePath, 'utf-8');
      const parser = new MarkdownParser(content);
      const delta = parser.parseDeltaSpec(content);

      // Check that delta has at least one section
      if (delta.added.length === 0 && delta.modified.length === 0 && delta.removed.length === 0) {
        warnings.push({
          message: 'Delta spec has no changes',
          suggestion: 'Add at least one section: ## ADDED Requirements, ## MODIFIED Requirements, or ## REMOVED Requirements',
          autoFixable: false,
        });
      }

      // Check for proper delta format
      if (!content.includes('## ADDED') && !content.includes('## MODIFIED') && !content.includes('## REMOVED')) {
        warnings.push({
          message: 'Delta spec may not follow proper format',
          suggestion: 'Use sections: ## ADDED Requirements, ## MODIFIED Requirements, ## REMOVED Requirements',
          autoFixable: false,
        });
      }

      return {
        valid: errors.length === 0,
        errors,
        warnings,
        suggestions: suggestions.length > 0 ? suggestions : undefined,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const suggestion = this.getParseErrorSuggestion(errorMessage);
      
      return {
        valid: false,
        errors: [{
          message: errorMessage,
          suggestion,
          autoFixable: false,
        }],
        warnings: [],
        suggestions: suggestion ? [suggestion] : undefined,
      };
    }
  }

  private extractNameFromPath(filePath: string): string {
    const baseName = path.basename(filePath, '.md');
    return baseName === 'spec' ? path.basename(path.dirname(filePath)) : baseName;
  }

  private async findDeltaSpecs(dir: string): Promise<string[]> {
    const specs: string[] = [];
    const entries = await FileSystemUtils.readDirectory(dir);

    for (const entry of entries) {
      const entryPath = path.join(dir, entry);
      const stats = await FileSystemUtils.stat(entryPath);

      if (stats.isDirectory()) {
        const subSpecs = await this.findDeltaSpecs(entryPath);
        specs.push(...subSpecs);
      } else if (entry.endsWith('.md')) {
        specs.push(entryPath);
      }
    }

    return specs;
  }
}

