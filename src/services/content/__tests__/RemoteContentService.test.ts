import { allActivities, findActivity } from '@/content/activities/registry';
import { createLogger } from '@/services/logging/logger';

import { RemoteContentService } from '../RemoteContentService';

const remoteQuiz = {
  id: 'act_remote_sci_g2_extra',
  kind: 'QUIZ',
  islandId: 'science',
  title: 'Remote Science',
  icon: 'flask',
  color: '#6BCB77',
  voiceIntro: 'hi',
  instruction: 'tap',
  reward: { diamonds: 2 },
  grades: [2],
  subject: 'science',
  data: {
    kind: 'QUIZ',
    pick: 1,
    questions: [
      {
        id: 'q',
        prompt: 'p',
        choices: [
          { id: 'a', label: 'A' },
          { id: 'b', label: 'B' },
        ],
        answerId: 'a',
      },
    ],
  },
};

function memoryStorage() {
  const m = new Map<string, string>();
  return {
    async getItem(k: string) {
      return m.get(k) ?? null;
    },
    async setItem(k: string, v: string) {
      m.set(k, v);
    },
    map: m,
  };
}

const ok = (body: unknown) => async () =>
  new Response(typeof body === 'string' ? body : JSON.stringify(body), { status: 200 });

describe('RemoteContentService', () => {
  it('fetches, validates, merges, caches; unchanged on same version; withdraws on new version', async () => {
    const storage = memoryStorage();
    const before = allActivities().length;
    const svc = new RemoteContentService(
      'https://example.test/content/packs.json',
      createLogger(),
      ok({ version: 1, publishedAt: '2026-09-21', activities: [remoteQuiz, { id: 'bad' }] }),
      storage,
    );
    const r1 = await svc.start();
    expect(r1.status).toBe('updated');
    expect(r1).toMatchObject({ added: 1, rejected: 1 });
    expect(findActivity('act_remote_sci_g2_extra')?.title).toBe('Remote Science');
    expect(allActivities().length).toBe(before + 1);
    expect(storage.map.size).toBe(2);

    const r2 = await svc.refresh();
    expect(r2.status).toBe('unchanged');

    // A new version that no longer contains the activity withdraws it.
    const svc2 = new RemoteContentService(
      'https://example.test/content/packs.json',
      createLogger(),
      ok({ version: 2, publishedAt: '2026-09-22', activities: [] }),
      storage,
    );
    const r3 = await svc2.start(); // loads cached v1 first, then refreshes to v2
    expect(r3.status).toBe('updated');
    expect(findActivity('act_remote_sci_g2_extra')).toBeUndefined();
    expect(allActivities().length).toBe(before);
  });

  it('is harmless when offline or when the pack is invalid', async () => {
    const storage = memoryStorage();
    const before = allActivities().length;
    const offline = new RemoteContentService(
      'https://example.test/x.json',
      createLogger(),
      async () => {
        throw new Error('network down');
      },
      storage,
    );
    expect((await offline.start()).status).toBe('offline');
    const invalid = new RemoteContentService(
      'https://example.test/x.json',
      createLogger(),
      ok('not json'),
      storage,
    );
    expect((await invalid.start()).status).toBe('invalid');
    const wrongShape = new RemoteContentService(
      'https://example.test/x.json',
      createLogger(),
      ok({ nope: true }),
      storage,
    );
    expect((await wrongShape.start()).status).toBe('invalid');
    expect(allActivities().length).toBe(before);
    const none = new RemoteContentService(null, createLogger(), ok({}), storage);
    expect((await none.start()).status).toBe('unchanged');
  });

  it('starts from the cache when offline', async () => {
    const storage = memoryStorage();
    const online = new RemoteContentService(
      'https://example.test/p.json',
      createLogger(),
      ok({ version: 5, publishedAt: 'x', activities: [remoteQuiz] }),
      storage,
    );
    await online.start();
    const offline = new RemoteContentService(
      'https://example.test/p.json',
      createLogger(),
      async () => {
        throw new Error('down');
      },
      storage,
    );
    const r = await offline.start();
    expect(r.status).toBe('offline');
    expect(findActivity('act_remote_sci_g2_extra')).toBeDefined();
    expect(offline.getMeta()?.version).toBe(5);
  });
});
