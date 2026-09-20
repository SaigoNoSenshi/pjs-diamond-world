import 'fake-indexeddb/auto';

import { MemorySettingsRepository } from '../../memory';
import { runRepositoryContract } from '../../__tests__/repositoryContract';
import { createMemoryKeyValueStore, openIndexedDb } from '../database';
import { createKvRepositories, DataUriAssetStore } from '../repositories';

let dbCounter = 0;

runRepositoryContract('indexeddb', async () => {
  dbCounter += 1;
  const kv = await openIndexedDb(`pjs-test-${dbCounter}`);
  return createKvRepositories(kv, new MemorySettingsRepository());
});

runRepositoryContract('kv-memory-fallback', () =>
  createKvRepositories(createMemoryKeyValueStore(), new MemorySettingsRepository()),
);

describe('DataUriAssetStore', () => {
  it('converts blob sources to data URIs and tracks sizes', async () => {
    const kv = createMemoryKeyValueStore();
    const fakeFetch = (async () => ({
      blob: async () => new Blob([new Uint8Array([1, 2, 3, 4])], { type: 'image/png' }),
    })) as unknown as typeof fetch;
    const store = new DataUriAssetStore(kv, fakeFetch);
    const stored = await store.saveFromUri('blob:http://x/1', 'photos', 'a.jpg');
    expect(stored.uri.startsWith('data:image/png;base64,')).toBe(true);
    expect(stored.bytes).toBe(4);
    expect(await store.exists(stored.uri)).toBe(true);
    expect(await store.totalBytes()).toBe(4);
    await store.remove(stored.uri);
    expect(await store.exists(stored.uri)).toBe(false);
  });
});
