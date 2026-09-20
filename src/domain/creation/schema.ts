import { z } from 'zod';

import { assetUri, entityId, isoDateTime } from '../shared/schema';

export const creationTypeSchema = z.enum(['DRAWING', 'CRAFT', 'PHOTO']);
export type CreationType = z.infer<typeof creationTypeSchema>;

/** Free-form but typed metadata per creation type. */
export const creationMetadataSchema = z.object({
  /** Drawing: dominant colour id; used for friendly names. */
  dominantColor: z.string().optional(),
  /** Drawing: stamp ids used. */
  stamps: z.array(z.string()).optional(),
  /** Craft: template id that produced this creation. */
  craftId: z.string().optional(),
  /** Craft: short noun used in celebrations ("cup"). */
  craftNoun: z.string().optional(),
  /** Optional child voice note (local file). */
  voiceNoteUri: assetUri.optional(),
  /** Optional sticker decorations. */
  stickers: z.array(z.object({ id: z.string(), x: z.number(), y: z.number() })).optional(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
});
export type CreationMetadata = z.infer<typeof creationMetadataSchema>;

export const creationSchema = z.object({
  id: entityId,
  childId: entityId,
  type: creationTypeSchema,
  title: z.string().min(1).max(60),
  thumbnailUri: assetUri,
  assetUri: assetUri,
  createdAt: isoDateTime,
  updatedAt: isoDateTime,
  favorite: z.boolean(),
  metadata: creationMetadataSchema,
});
export type Creation = z.infer<typeof creationSchema>;

export type NewCreation = Omit<Creation, 'id' | 'createdAt' | 'updatedAt' | 'favorite'>;

export const creationFilterSchema = z.enum(['ALL', 'DRAWINGS', 'CRAFTS', 'FAVORITES']);
export type CreationFilter = z.infer<typeof creationFilterSchema>;

export function matchesFilter(creation: Creation, filter: CreationFilter): boolean {
  switch (filter) {
    case 'ALL':
      return true;
    case 'DRAWINGS':
      return creation.type === 'DRAWING';
    case 'CRAFTS':
      return creation.type === 'CRAFT' || creation.type === 'PHOTO';
    case 'FAVORITES':
      return creation.favorite;
  }
}
