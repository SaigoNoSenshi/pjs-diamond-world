import { z } from 'zod';

import { assetUri, entityId, isoDateTime } from '../shared/schema';

export const craftDifficultySchema = z.enum(['EASY', 'MEDIUM', 'HARD']);
export type CraftDifficulty = z.infer<typeof craftDifficultySchema>;

/**
 * Step kinds drive the Craft Player:
 *  - INSTRUCTION: illustration + short text + voice + NEXT
 *  - PHOTO: opens the camera; result is attached to the session
 *  - SAVE: final step; saving creates a Creation and completes the craft
 */
export const craftStepKindSchema = z.enum(['INSTRUCTION', 'PHOTO', 'SAVE']);
export type CraftStepKind = z.infer<typeof craftStepKindSchema>;

export const craftStepSchema = z.object({
  id: z.string().min(1),
  order: z.number().int().nonnegative(),
  kind: craftStepKindSchema,
  /** Very short child-friendly instruction. */
  instruction: z.string().min(1).max(80),
  /** Illustration asset key resolved by the content registry. */
  illustration: z.string().min(1),
  /** Voice prompt text (or key for prerecorded audio). */
  audioPrompt: z.string().min(1).max(120),
  animation: z.enum(['none', 'sparkle', 'bounce', 'grow', 'wiggle']).optional(),
  sound: z.string().optional(),
});
export type CraftStep = z.infer<typeof craftStepSchema>;

export const craftRewardSchema = z.object({
  creativityPoints: z.number().int().nonnegative(),
  /** Optional garden item to unlock directly on completion. */
  gardenItemId: z.string().optional(),
});
export type CraftReward = z.infer<typeof craftRewardSchema>;

export const craftTemplateSchema = z
  .object({
    id: entityId,
    title: z.string().min(1).max(40),
    /** Short noun used in celebration copy: "cup". */
    noun: z.string().min(1).max(20),
    description: z.string().max(200),
    icon: z.string().min(1),
    illustration: z.string().optional(),
    difficulty: craftDifficultySchema,
    estimatedMinutes: z.number().int().positive(),
    materials: z.array(z.string().min(1)).min(1),
    steps: z.array(craftStepSchema).min(1),
    tags: z.array(z.string()),
    reward: craftRewardSchema,
    completionAction: z.enum(['SAVE_PHOTO', 'SAVE_WITHOUT_PHOTO']),
  })
  .refine(
    (t) => t.steps.every((s, i) => s.order === i),
    'steps must be ordered contiguously from 0',
  )
  .refine((t) => t.steps.filter((s) => s.kind === 'SAVE').length === 1, 'exactly one SAVE step')
  .refine((t) => t.steps.at(-1)?.kind === 'SAVE', 'the SAVE step must be last');
export type CraftTemplate = z.infer<typeof craftTemplateSchema>;

export const craftProgressSchema = z.object({
  craftId: entityId,
  childId: entityId,
  currentStepIndex: z.number().int().nonnegative(),
  photoUri: assetUri.optional(),
  startedAt: isoDateTime,
  updatedAt: isoDateTime,
  completedAt: isoDateTime.optional(),
});
export type CraftProgress = z.infer<typeof craftProgressSchema>;
