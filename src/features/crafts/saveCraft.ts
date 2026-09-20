import { bundledAssetUri } from '@/domain/creation/assetUri';
import { clampTitle, friendlyCraftName } from '@/domain/creation/friendlyName';
import type { Creation } from '@/domain/creation/schema';
import type { CraftSession } from '@/domain/craft/craftEngine';
import { createProgressionEvent } from '@/domain/progression/events';
import type { Repositories } from '@/repositories/interfaces';
import type { EventBus, SyncService } from '@/services/interfaces';
import type { Logger } from '@/services/logging/logger';
import { createId } from '@/utils/ids';
import { attempt, type Result } from '@/utils/result';
import { systemClock, type Clock } from '@/utils/time';

export interface SaveCraftDeps {
  repositories: Repositories;
  eventBus: EventBus;
  logger: Logger;
  /** Optional: queue the new creation for cloud backup (never blocks). */
  sync?: SyncService;
  /** Optional: produce a small thumbnail from a local image URI. */
  makeThumbnail?: (uri: string) => Promise<string | null>;
  clock?: Clock;
}

export interface SaveCraftInput {
  childId: string;
  session: CraftSession;
}

/**
 * Complete a craft: copy the photo into app storage (if any), create the Creation,
 * publish CRAFT_COMPLETED (+ PHOTO_SAVED) + CREATION_SAVED + ACTIVITY_COMPLETED,
 * and clear saved progress. Failure leaves progress intact so PJ can retry.
 */
export async function saveCraft(
  deps: SaveCraftDeps,
  input: SaveCraftInput,
): Promise<Result<Creation>> {
  const clock = deps.clock ?? systemClock;
  const { template, photoUri } = input.session;
  return attempt(async () => {
    const id = createId('cre');
    let assetUri: string;
    let thumbnailUri: string | null = null;
    if (photoUri) {
      const stored = await deps.repositories.assets.saveFromUri(photoUri, 'photos', `${id}.jpg`);
      assetUri = stored.uri;
      const small = deps.makeThumbnail ? await deps.makeThumbnail(stored.uri) : null;
      if (small) {
        thumbnailUri = (
          await deps.repositories.assets.saveFromUri(small, 'thumbnails', `${id}.jpg`)
        ).uri;
      }
    } else {
      assetUri = bundledAssetUri(
        template.illustration ?? template.steps.at(-1)?.illustration ?? 'garden.flower',
      );
    }

    const creation = await deps.repositories.creations.create({
      childId: input.childId,
      type: 'CRAFT',
      title: clampTitle(friendlyCraftName(template.noun)),
      thumbnailUri: thumbnailUri ?? assetUri,
      assetUri,
      metadata: { craftId: template.id, craftNoun: template.noun },
    });

    const now = clock();
    const stamp = () => ({ id: createId('evt'), occurredAt: now });
    const payload = {
      creationId: creation.id,
      craftId: template.id,
      activityId: template.id,
      points: template.reward.creativityPoints,
    };
    await deps.eventBus.publish(
      createProgressionEvent('CRAFT_COMPLETED', input.childId, payload, stamp()),
    );
    if (photoUri) {
      await deps.eventBus.publish(
        createProgressionEvent('PHOTO_SAVED', input.childId, payload, stamp()),
      );
    }
    await deps.eventBus.publish(
      createProgressionEvent('CREATION_SAVED', input.childId, payload, stamp()),
    );
    await deps.eventBus.publish(
      createProgressionEvent('ACTIVITY_COMPLETED', input.childId, payload, stamp()),
    );

    await deps.repositories.craftProgress.clear(input.childId, template.id);
    deps.sync?.enqueue({ kind: 'creation', id: creation.id, op: 'upsert' });
    void deps.sync?.flush();
    deps.logger.info('craft saved', {
      creationId: creation.id,
      craftId: template.id,
      photo: Boolean(photoUri),
    });
    return creation;
  });
}
