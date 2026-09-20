import { z } from 'zod';

import { entityId, isoDateTime } from '../shared/schema';

export const progressionEventTypeSchema = z.enum([
  'CREATION_SAVED',
  'CRAFT_COMPLETED',
  'DRAWING_COMPLETED',
  'PHOTO_SAVED',
  'ACTIVITY_COMPLETED',
  'GARDEN_ITEM_UNLOCKED',
]);
export type ProgressionEventType = z.infer<typeof progressionEventTypeSchema>;

export const progressionEventSchema = z.object({
  id: entityId,
  type: progressionEventTypeSchema,
  childId: entityId,
  occurredAt: isoDateTime,
  payload: z
    .object({
      creationId: z.string().optional(),
      craftId: z.string().optional(),
      activityId: z.string().optional(),
      gardenItemId: z.string().optional(),
      points: z.number().int().optional(),
    })
    .default({}),
});
export type ProgressionEvent = z.infer<typeof progressionEventSchema>;

export const gardenItemTypeSchema = z.enum([
  'SPROUT',
  'FLOWER',
  'TREE',
  'DIAMOND',
  'JELLYFISH',
  'ISLAND',
  'CHARACTER',
  'STATION',
]);
export type GardenItemType = z.infer<typeof gardenItemTypeSchema>;

/** Unlock rules are data. Add a new kind here and in `evaluateRequirement`. */
export const unlockRequirementSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('CREATIONS_AT_LEAST'), count: z.number().int().positive() }),
  z.object({ kind: z.literal('DRAWINGS_AT_LEAST'), count: z.number().int().positive() }),
  z.object({ kind: z.literal('CRAFTS_AT_LEAST'), count: z.number().int().positive() }),
  z.object({ kind: z.literal('POINTS_AT_LEAST'), points: z.number().int().positive() }),
  z.object({ kind: z.literal('EVENT'), eventType: progressionEventTypeSchema }),
  z.object({ kind: z.literal('CRAFT_COMPLETED'), craftId: z.string().min(1) }),
]);
export type UnlockRequirement = z.infer<typeof unlockRequirementSchema>;

export const gardenItemSchema = z.object({
  id: z.string().min(1),
  type: gardenItemTypeSchema,
  name: z.string().min(1),
  unlockRequirement: unlockRequirementSchema,
  /** Asset key resolved by the content registry. */
  asset: z.string().min(1),
  /** Position on the island as 0..1 fractions of the garden canvas. */
  position: z.object({ x: z.number().min(0).max(1), y: z.number().min(0).max(1) }),
  /** Relative size multiplier. */
  scale: z.number().positive().default(1),
});
export type GardenItem = z.infer<typeof gardenItemSchema>;

export const gardenCountersSchema = z.object({
  creations: z.number().int().nonnegative(),
  drawings: z.number().int().nonnegative(),
  crafts: z.number().int().nonnegative(),
  photos: z.number().int().nonnegative(),
  activities: z.number().int().nonnegative(),
});
export type GardenCounters = z.infer<typeof gardenCountersSchema>;

export const gardenStateSchema = z.object({
  childId: entityId,
  level: z.number().int().positive(),
  creativityPoints: z.number().int().nonnegative(),
  unlockedItems: z.array(z.string()),
  counters: gardenCountersSchema,
  completedCrafts: z.array(z.string()),
  updatedAt: isoDateTime,
});
export type GardenState = z.infer<typeof gardenStateSchema>;

export function createInitialGardenState(childId: string, updatedAt: string): GardenState {
  return {
    childId,
    level: 1,
    creativityPoints: 0,
    unlockedItems: [],
    counters: { creations: 0, drawings: 0, crafts: 0, photos: 0, activities: 0 },
    completedCrafts: [],
    updatedAt,
  };
}
