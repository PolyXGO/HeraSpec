/**
 * Markdown Parser for HeraSpec
 * Handles parsing of specs with Meta section, project types, and delta specs
 */
import { z } from 'zod';
import { Spec, RequirementSchema } from '../schemas/index.js';
import { SpecMeta } from '../config.js';

interface Section {
  level: number;
  title: string;
  content: string[];
}

export class MarkdownParser {
  private lines: string[];

  constructor(content: string) {
    this.lines = MarkdownParser.normalizeContent(content).split('\n');
  }

  protected static normalizeContent(content: string): string {
    return content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  }

  parseSpec(name: string): Spec {
    const sections = this.parseSections();
    const meta = this.parseMeta(sections);
    const purpose = this.findSection(sections, 'Purpose')?.content.join('\n').trim() || '';
    const requirementsSection = this.findSection(sections, 'Requirements');

    if (!purpose) {
      throw new Error('Spec must have a Purpose section');
    }

    if (!requirementsSection) {
      throw new Error('Spec must have a Requirements section');
    }

    const requirements = this.parseRequirements(requirementsSection);

    return {
      name,
      meta,
      overview: purpose.trim(),
      requirements,
      metadata: {
        version: '1.0.0',
        format: 'heraspec',
      },
    };
  }

  parseDeltaSpec(content: string): {
    added: any[];
    modified: any[];
    removed: any[];
  } {
    const sections = this.parseSections();
    const added = this.findSection(sections, 'ADDED Requirements');
    const modified = this.findSection(sections, 'MODIFIED Requirements');
    const removed = this.findSection(sections, 'REMOVED Requirements');

    return {
      added: added ? this.parseDeltaRequirements(added) : [],
      modified: modified ? this.parseDeltaRequirements(modified) : [],
      removed: removed ? this.parseDeltaRequirements(removed) : [],
    };
  }

  private parseMeta(sections: Section[]): SpecMeta | undefined {
    const metaSection = this.findSection(sections, 'Meta');
    if (!metaSection) {
      return undefined;
    }

    const meta: SpecMeta = {};
    const content = metaSection.content.join('\n');

    // Parse project type
    const projectTypeMatch = content.match(/project type:\s*(.+)/i);
    if (projectTypeMatch) {
      const types = projectTypeMatch[1].split('|').map(t => t.trim());
      meta.projectType = types.length === 1 ? types[0] : types;
    }

    // Parse domain
    const domainMatch = content.match(/domain:\s*(.+)/i);
    if (domainMatch) {
      meta.domain = domainMatch[1].trim();
    }

    // Parse stack
    const stackMatch = content.match(/stack:\s*(.+)/i);
    if (stackMatch) {
      const stacks = stackMatch[1].split('|').map(s => s.trim());
      meta.stack = stacks.length === 1 ? stacks[0] : stacks;
    }

    return Object.keys(meta).length > 0 ? meta : undefined;
  }

  private parseSections(): Section[] {
    const sections: Section[] = [];
    let currentSection: Section | null = null;

    for (const line of this.lines) {
      const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);
      if (headerMatch) {
        if (currentSection) {
          sections.push(currentSection);
        }
        currentSection = {
          level: headerMatch[1].length,
          title: headerMatch[2].trim(),
          content: [],
        };
      } else if (currentSection) {
        currentSection.content.push(line);
      }
    }

    if (currentSection) {
      sections.push(currentSection);
    }

    return sections;
  }

  private findSection(sections: Section[], title: string): Section | undefined {
    return sections.find(s => 
      s.title.toLowerCase() === title.toLowerCase() ||
      s.title.toLowerCase().includes(title.toLowerCase())
    );
  }

  private parseRequirements(section: Section): z.infer<typeof RequirementSchema>[] {
    const requirements: z.infer<typeof RequirementSchema>[] = [];
    const lines = section.content;

    let currentRequirement: {
      name: string;
      description: string;
      scenarios: any[];
      constraints?: string[];
    } | null = null;

    let inRequirement = false;
    let inScenario = false;
    let currentScenario: { name: string; steps: string[] } | null = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Check for requirement header
      const reqMatch = line.match(/^###\s+Requirement:\s*(.+)$/i);
      if (reqMatch) {
        if (currentRequirement) {
          requirements.push(currentRequirement as any);
        }
        currentRequirement = {
          name: reqMatch[1].trim(),
          description: '',
          scenarios: [],
        };
        inRequirement = true;
        continue;
      }

      // Check for scenario header
      const scenarioMatch = line.match(/^####\s+Scenario:\s*(.+)$/i);
      if (scenarioMatch && currentRequirement) {
        if (currentScenario) {
          currentRequirement.scenarios.push(currentScenario);
        }
        currentScenario = {
          name: scenarioMatch[1].trim(),
          steps: [],
        };
        inScenario = true;
        continue;
      }

      // Check for GIVEN/WHEN/THEN steps
      if (currentScenario && (line.match(/^-\s*(GIVEN|WHEN|THEN|AND|BUT)\s+/i))) {
        const step = line.replace(/^-\s*/, '').trim();
        currentScenario.steps.push(step);
        continue;
      }

      // Regular content line
      if (currentRequirement && !inScenario) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          currentRequirement.description += (currentRequirement.description ? '\n' : '') + trimmed;
        }
      }
    }

    // Add final requirement and scenario
    if (currentScenario && currentRequirement) {
      currentRequirement.scenarios.push(currentScenario);
    }
    if (currentRequirement) {
      requirements.push(currentRequirement as any);
    }

    return requirements;
  }

  private parseDeltaRequirements(section: Section): any[] {
    // Similar to parseRequirements but expects ADDED/MODIFIED/REMOVED markers
    return this.parseRequirements(section);
  }
}

