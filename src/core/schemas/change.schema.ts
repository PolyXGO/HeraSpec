/**
 * HeraSpec Change Schema
 */
import { z } from 'zod';

export const DeltaTypeSchema = z.enum(['ADDED', 'MODIFIED', 'REMOVED']);

export const DeltaRequirementSchema = z.object({
  type: DeltaTypeSchema,
  requirement: z.object({
    id: z.string().optional(),
    name: z.string(),
    description: z.string(),
    scenarios: z.array(z.object({
      name: z.string(),
      steps: z.array(z.string()),
    })).optional(),
    constraints: z.array(z.string()).optional(),
  }),
});

export const ChangeSchema = z.object({
  name: z.string(),
  proposal: z.string().min(1),
  tasks: z.array(z.string()).optional(),
  design: z.string().optional(),
});

export type Change = z.infer<typeof ChangeSchema>;
export type DeltaRequirement = z.infer<typeof DeltaRequirementSchema>;

