import { z } from 'zod';

import { entityId, isoDateTime } from '../shared/schema';

/**
 * Learning progress: diamonds, stickers, per-activity completions and today's quest.
 * Additive only — nothing here ever takes anything away from the child.
 */

export const completionRecordSchema = z.object({
  count: z.number().int().positive(),
  lastAt: isoDateTime,
  /** Best score 0..1 where the engine reports one (tracing coverage, quiz ratio). */
  best: z.number().min(0).max(1).optional(),
});
export type CompletionRecord = z.infer<typeof completionRecordSchema>;

export const dateKeySchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const dailyQuestStateSchema = z.object({
  dateKey: dateKeySchema,
  activityIds: z.array(z.string()).length(3),
  completedIds: z.array(z.string()),
  chestOpened: z.boolean(),
});
export type DailyQuestState = z.infer<typeof dailyQuestStateSchema>;

export const learningProgressSchema = z.object({
  childId: entityId,
  diamonds: z.number().int().nonnegative(),
  stickers: z.array(z.string()),
  completions: z.record(z.string(), completionRecordSchema),
  quest: dailyQuestStateSchema.nullable(),
  updatedAt: isoDateTime,
});
export type LearningProgress = z.infer<typeof learningProgressSchema>;

export function createInitialLearningProgress(
  childId: string,
  updatedAt: string,
): LearningProgress {
  return { childId, diamonds: 0, stickers: [], completions: {}, quest: null, updatedAt };
}

/** Local calendar day, e.g. "2026-09-21". Quests reset at local midnight. */
export function dateKeyFor(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
