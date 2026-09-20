import { clampTitle, friendlyDrawingName } from '@/domain/creation/friendlyName';
import type { Creation } from '@/domain/creation/schema';
import { summarizeDrawing } from '@/domain/drawing/analysis';
import type { DrawingElement } from '@/domain/drawing/schema';
import { createProgressionEvent } from '@/domain/progression/events';
import type { Repositories } from '@/repositories/interfaces';
import type { EventBus, SyncService } from '@/services/interfaces';
import type { Logger } from '@/services/logging/logger';
import { createId } from '@/utils/ids';
import { systemClock, type Clock } from '@/utils/time';
import { attempt, type Result } from '@/utils/result';

/** Captured image from the canvas: either a temp file URI or base64 PNG data. */
export type CanvasCapture = { kind: 'uri'; uri: string } | { kind: 'base64'; base64: string };

export interface SaveDrawingDeps {
  repositories: Repositories;
  eventBus: EventBus;
  logger: Logger;
  /** Optional: queue the new creation for cloud backup (never blocks). */
  sync?: SyncService;
  clock?: Clock;
  /** Resolves a colour hex to its label ("Yellow"); returns null when unknown. */
  colorLabel: (hex: string) => string | null;
  /** Resolves a stamp id to its noun ("Star"). */
  stampNoun: (stampId: string) => string | null;
}

export interface SaveDrawingInput {
  childId: string;
  /** Optional small capture of the same canvas for the scrapbook grid. */
  thumbnail?: CanvasCapture;
  nickname: string;
  elements: readonly DrawingElement[];
  capture: CanvasCapture;
  width: number;
  height: number;
}

/**
 * Save use-case: asset first, then metadata, then events, then clear the draft.
 * If anything fails the draft is left intact so nothing is lost.
 */
export async function saveDrawing(
  deps: SaveDrawingDeps,
  input: SaveDrawingInput,
): Promise<Result<Creation>> {
  const clock = deps.clock ?? systemClock;
  return attempt(async () => {
    const id = createId('cre');
    const fileName = `${id}.png`;
    const stored =
      input.capture.kind === 'uri'
        ? await deps.repositories.assets.saveFromUri(input.capture.uri, 'creations', fileName)
        : await deps.repositories.assets.saveBase64(input.capture.base64, 'creations', fileName);

    let thumbnailUri = stored.uri;
    if (input.thumbnail) {
      const thumbName = `${id}-thumb.png`;
      const small =
        input.thumbnail.kind === 'uri'
          ? await deps.repositories.assets.saveFromUri(input.thumbnail.uri, 'thumbnails', thumbName)
          : await deps.repositories.assets.saveBase64(
              input.thumbnail.base64,
              'thumbnails',
              thumbName,
            );
      thumbnailUri = small.uri;
    }

    const summary = summarizeDrawing(input.elements);
    const lastStamp = summary.stamps[summary.stamps.length - 1];
    const title = clampTitle(
      friendlyDrawingName({
        nickname: input.nickname,
        colorLabel: summary.dominantColor ? deps.colorLabel(summary.dominantColor) : null,
        stampNoun: lastStamp ? deps.stampNoun(lastStamp) : null,
      }),
    );

    const creation = await deps.repositories.creations.create({
      childId: input.childId,
      type: 'DRAWING',
      title,
      thumbnailUri,
      assetUri: stored.uri,
      metadata: {
        dominantColor: summary.dominantColor ?? undefined,
        stamps: summary.stamps,
        width: input.width,
        height: input.height,
      },
    });

    const now = clock();
    await deps.eventBus.publish(
      createProgressionEvent(
        'DRAWING_COMPLETED',
        input.childId,
        { creationId: creation.id },
        { id: createId('evt'), occurredAt: now },
      ),
    );
    await deps.eventBus.publish(
      createProgressionEvent(
        'CREATION_SAVED',
        input.childId,
        { creationId: creation.id },
        { id: createId('evt'), occurredAt: now },
      ),
    );

    await deps.repositories.drafts.clear(input.childId);
    deps.sync?.enqueue({ kind: 'creation', id: creation.id, op: 'upsert' });
    void deps.sync?.flush();
    deps.logger.info('drawing saved', {
      creationId: creation.id,
      strokes: summary.strokeCount,
      stamps: summary.stampCount,
    });
    return creation;
  });
}
