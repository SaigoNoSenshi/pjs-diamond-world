import { z } from 'zod';

import { entityId, isoDateTime } from '../shared/schema';

export const pointSchema = z.object({ x: z.number(), y: z.number() });
export type Point = z.infer<typeof pointSchema>;

export const brushKindSchema = z.enum(['brush', 'crayon', 'eraser']);
export type BrushKind = z.infer<typeof brushKindSchema>;

export const strokeSchema = z.object({
  id: z.string().min(1),
  kind: brushKindSchema,
  color: z.string().min(1),
  width: z.number().positive(),
  points: z.array(pointSchema).min(1),
});
export type Stroke = z.infer<typeof strokeSchema>;

export const stampPlacementSchema = z.object({
  id: z.string().min(1),
  stampId: z.string().min(1),
  x: z.number(),
  y: z.number(),
  size: z.number().positive(),
  color: z.string().min(1),
});
export type StampPlacement = z.infer<typeof stampPlacementSchema>;

/** A drawing element in z-order. */
export const drawingElementSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('stroke'), stroke: strokeSchema }),
  z.object({ type: z.literal('stamp'), stamp: stampPlacementSchema }),
]);
export type DrawingElement = z.infer<typeof drawingElementSchema>;

/** Autosaved draft so leaving the screen never loses work. */
export const drawingDraftSchema = z.object({
  id: entityId,
  childId: entityId,
  elements: z.array(drawingElementSchema),
  backgroundColor: z.string().min(1),
  updatedAt: isoDateTime,
});
export type DrawingDraft = z.infer<typeof drawingDraftSchema>;
