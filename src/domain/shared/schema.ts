import { z } from 'zod';

/** Shared primitives used by every domain schema. */
export const isoDateTime = z.iso.datetime({ offset: true });
export const entityId = z.string().min(3);

/** Local file URI or bundled asset key. */
export const assetUri = z.string().min(1);
