import type { Creation } from '@/domain/creation/schema';
import { createProgressionEvent } from '@/domain/progression/events';
import type { CanvasCapture } from '@/features/drawing/saveDrawing';
import type { Repositories } from '@/repositories/interfaces';
import type { EventBus } from '@/services/interfaces';
import { createId } from '@/utils/ids';
import { attempt, type Result } from '@/utils/result';
import { nowIso } from '@/utils/time';

/**
 * Saves a coloring page or sticker scene into My Diamond Book. Like saveDrawing but
 * publishes only CREATION_SAVED (the activity itself reports completion), so a scene
 * never double-counts as a free drawing.
 */
export async function saveScene(
  deps: { repositories: Repositories; eventBus: EventBus },
  input: {
    childId: string;
    title: string;
    capture: CanvasCapture;
    thumbnail?: CanvasCapture;
    width: number;
    height: number;
    activityId: string;
  },
): Promise<Result<Creation>> {
  return attempt(async () => {
    const id = createId('cre');
    const store = async (c: CanvasCapture, folder: 'creations' | 'thumbnails', name: string) =>
      c.kind === 'uri'
        ? deps.repositories.assets.saveFromUri(c.uri, folder, name)
        : deps.repositories.assets.saveBase64(c.base64, folder, name);
    const stored = await store(input.capture, 'creations', `${id}.png`);
    const thumb = input.thumbnail
      ? await store(input.thumbnail, 'thumbnails', `${id}-thumb.png`)
      : stored;
    const creation = await deps.repositories.creations.create({
      childId: input.childId,
      type: 'DRAWING',
      title: input.title.slice(0, 60),
      thumbnailUri: thumb.uri,
      assetUri: stored.uri,
      metadata: { width: input.width, height: input.height, stamps: [input.activityId] },
    });
    await deps.eventBus.publish(
      createProgressionEvent(
        'CREATION_SAVED',
        input.childId,
        { creationId: creation.id, activityId: input.activityId },
        { id: createId('evt'), occurredAt: nowIso() },
      ),
    );
    return creation;
  });
}
