/**
 * HeraSpec Specification Schema
 */
import { z } from 'zod';
import { RequirementSchema, SpecMetaSchema } from './base.schema.js';

export const SpecSchema = z.object({
  name: z.string().min(1),
  meta: SpecMetaSchema,
  overview: z.string().min(1),
  requirements: z.array(RequirementSchema).min(1),
  metadata: z.object({
    version: z.string().default('1.0.0'),
    format: z.literal('heraspec'),
    sourcePath: z.string().optional(),
  }).optional(),
});

export type Spec = z.infer<typeof SpecSchema>;

