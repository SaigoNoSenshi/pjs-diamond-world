import type { NewCreation } from '@/domain/creation/schema';
import { createInitialGardenState } from '@/domain/progression/schema';

import type { Repositories } from '../interfaces';

/**
 * Shared contract every Repositories implementation must satisfy. Run it against
 * the in-memory implementation now and the SQLite implementation once it exists.
 */
export function runRepositoryContract(
  name: string,
  factory: () => Promise<Repositories> | Repositories,
) {
  describe(`${name} repositories`, () => {
    const childId = 'chd_default';
    const newCreation = (overrides: Partial<NewCreation> = {}): NewCreation => ({
      childId,
      type: 'DRAWING',
      title: 'PJ drew',
      thumbnailUri: 'file:///t.png',
      assetUri: 'file:///a.png',
      metadata: {},
      ...overrides,
    });

    it('creates, lists, updates, favourites, and removes creations', async () => {
      const repos = await factory();
      const a = await repos.creations.create(newCreation());
      const b = await repos.creations.create(newCreation({ type: 'CRAFT', title: 'My Clay Cup' }));
      expect(await repos.creations.count(childId)).toBe(2);

      expect((await repos.creations.list(childId, 'DRAWINGS')).map((c) => c.id)).toEqual([a.id]);
      expect((await repos.creations.list(childId, 'CRAFTS')).map((c) => c.id)).toEqual([b.id]);

      const fav = await repos.creations.update(a.id, { favorite: true, title: "PJ's Star" });
      expect(fav.favorite).toBe(true);
      expect((await repos.creations.get(a.id))?.title).toBe("PJ's Star");
      expect((await repos.creations.list(childId, 'FAVORITES')).map((c) => c.id)).toEqual([a.id]);

      await repos.creations.remove(a.id);
      expect(await repos.creations.get(a.id)).toBeNull();
      expect(await repos.creations.count(childId)).toBe(1);
    });

    it('persists garden state and events', async () => {
      const repos = await factory();
      expect(await repos.garden.get(childId)).toBeNull();
      const state = createInitialGardenState(childId, '2026-09-14T00:00:00.000Z');
      await repos.garden.save({ ...state, creativityPoints: 3, unlockedItems: ['sprout'] });
      const loaded = await repos.garden.get(childId);
      expect(loaded?.creativityPoints).toBe(3);
      expect(loaded?.unlockedItems).toEqual(['sprout']);

      await repos.garden.appendEvent({
        id: 'evt_1',
        type: 'CREATION_SAVED',
        childId,
        occurredAt: '2026-09-14T00:00:01.000Z',
        payload: { creationId: 'cre_x' },
      });
      const events = await repos.garden.listEvents(childId);
      expect(events).toHaveLength(1);
      expect(events[0]?.type).toBe('CREATION_SAVED');
    });

    it('stores craft progress and drafts and clears them', async () => {
      const repos = await factory();
      await repos.craftProgress.save({
        craftId: 'crf_clay_cup',
        childId,
        currentStepIndex: 2,
        startedAt: '2026-09-14T00:00:00.000Z',
        updatedAt: '2026-09-14T00:00:00.000Z',
      });
      expect((await repos.craftProgress.get(childId, 'crf_clay_cup'))?.currentStepIndex).toBe(2);
      await repos.craftProgress.clear(childId, 'crf_clay_cup');
      expect(await repos.craftProgress.get(childId, 'crf_clay_cup')).toBeNull();

      await repos.drafts.save({
        id: 'drf_1',
        childId,
        elements: [],
        backgroundColor: '#FFFFFF',
        updatedAt: '2026-09-14T00:00:00.000Z',
      });
      expect((await repos.drafts.getCurrent(childId))?.id).toBe('drf_1');
      await repos.drafts.clear(childId);
      expect(await repos.drafts.getCurrent(childId)).toBeNull();
    });

    it('stores learning progress (diamonds, stickers, quest)', async () => {
      const repos = await factory();
      expect(await repos.learning.get(childId)).toBeNull();
      await repos.learning.save({
        childId,
        diamonds: 12,
        stickers: ['stk_star'],
        completions: { act_trace_a: { count: 2, lastAt: '2026-09-21T00:00:00.000Z', best: 0.9 } },
        quest: {
          dateKey: '2026-09-21',
          activityIds: ['act_a', 'act_b', 'act_c'],
          completedIds: ['act_a'],
          chestOpened: false,
        },
        updatedAt: '2026-09-21T00:00:00.000Z',
      });
      const loaded = await repos.learning.get(childId);
      expect(loaded?.diamonds).toBe(12);
      expect(loaded?.stickers).toEqual(['stk_star']);
      expect(loaded?.completions['act_trace_a']?.best).toBe(0.9);
      expect(loaded?.quest?.completedIds).toEqual(['act_a']);
      await repos.learning.save({ ...loaded!, diamonds: 20 });
      expect((await repos.learning.get(childId))?.diamonds).toBe(20);
    });

    it('returns a default profile and patches settings', async () => {
      const repos = await factory();
      const profile = await repos.settings.getProfile();
      expect(profile.nickname).toBe('PJ');
      expect(profile.settings.cloudSyncEnabled).toBe(false);
      const settings = await repos.settings.updateSettings({
        musicEnabled: false,
        introSeen: true,
      });
      expect(settings.musicEnabled).toBe(false);
      expect(settings.introSeen).toBe(true);
      expect((await repos.settings.getProfile()).settings.voiceEnabled).toBe(true);
    });

    it('stores assets and reports usage', async () => {
      const repos = await factory();
      const stored = await repos.assets.saveBase64('aGVsbG8=', 'creations', 'a.png');
      expect(await repos.assets.exists(stored.uri)).toBe(true);
      expect(await repos.assets.totalBytes()).toBeGreaterThan(0);
      await repos.assets.remove(stored.uri);
      expect(await repos.assets.exists(stored.uri)).toBe(false);
    });
  });
}
