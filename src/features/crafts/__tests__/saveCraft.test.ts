import { clayCup } from '@/content/crafts/clayCup';
import { attachPhoto, createCraftSession, isLastStep, nextStep } from '@/domain/craft/craftEngine';
import type { ProgressionEvent } from '@/domain/progression/schema';
import { createMemoryRepositories } from '@/repositories/memory';
import { InProcessEventBus } from '@/services/defaults';
import { createLogger } from '@/services/logging/logger';

import { bundledAssetKey, isBundledAssetUri } from '@/domain/creation/assetUri';

import { saveCraft } from '../saveCraft';

function finishedSession(photo: string | null) {
  let s = createCraftSession(clayCup, '2026-09-14T00:00:00.000Z');
  while (!isLastStep(s)) s = nextStep(s);
  return attachPhoto(s, photo);
}

describe('saveCraft', () => {
  it('stores the photo, names the creation "My Cup", publishes events and clears progress', async () => {
    const repositories = createMemoryRepositories();
    const logger = createLogger();
    const eventBus = new InProcessEventBus(logger);
    const events: ProgressionEvent[] = [];
    eventBus.subscribe((e) => {
      events.push(e);
    });
    await repositories.craftProgress.save({
      craftId: clayCup.id,
      childId: 'chd_default',
      currentStepIndex: 6,
      startedAt: '2026-09-14T00:00:00.000Z',
      updatedAt: '2026-09-14T00:00:00.000Z',
    });

    const result = await saveCraft(
      { repositories, eventBus, logger },
      { childId: 'chd_default', session: finishedSession('file:///tmp/cup.jpg') },
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.title).toBe('My Cup');
    expect(result.value.type).toBe('CRAFT');
    expect(result.value.metadata.craftId).toBe(clayCup.id);
    expect(await repositories.assets.exists(result.value.assetUri)).toBe(true);
    expect(events.map((e) => e.type)).toEqual(['CRAFT_COMPLETED', 'PHOTO_SAVED', 'CREATION_SAVED']);
    expect(events[0]?.payload.points).toBe(clayCup.reward.creativityPoints);
    expect(await repositories.craftProgress.get('chd_default', clayCup.id)).toBeNull();
  });

  it('completes without a photo using the bundled illustration and skips PHOTO_SAVED', async () => {
    const repositories = createMemoryRepositories();
    const logger = createLogger();
    const eventBus = new InProcessEventBus(logger);
    const types: string[] = [];
    eventBus.subscribe((e) => {
      types.push(e.type);
    });
    const result = await saveCraft(
      { repositories, eventBus, logger },
      { childId: 'chd_default', session: finishedSession(null) },
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(isBundledAssetUri(result.value.assetUri)).toBe(true);
    expect(bundledAssetKey(result.value.assetUri)).toBe('craft.clayCup.7');
    expect(types).toEqual(['CRAFT_COMPLETED', 'CREATION_SAVED']);
  });
});
