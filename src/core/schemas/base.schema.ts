/**
 * Base schemas for HeraSpec
 */
import { z } from 'zod';

export const ProjectTypeSchema = z.enum([
  'wordpress-plugin',
  'wordpress-theme',
  'perfex-module',
  'laravel-package',
  'node-service',
  'generic-webapp',
  'backend-api',
  'frontend-app',
  'multi-stack',
]);

export const SpecMetaSchema = z.object({
  projectType: z.union([
    ProjectTypeSchema,
    z.array(ProjectTypeSchema),
  ]).optional(),
  domain: z.string().optional(),
  stack: z.union([
    z.string(),
    z.array(z.string()),
  ]).optional(),
}).optional();

export const ScenarioSchema = z.object({
  name: z.string(),
  steps: z.array(z.string()).min(1),
});

export const RequirementSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string(),
  scenarios: z.array(ScenarioSchema).optional(),
  constraints: z.array(z.string()).optional(),
});

