import type { Creation } from '@/domain/creation/schema';
import { defaultAppSettings, type AppSettings } from '@/domain/profile/schema';
import { createInitialGardenState } from '@/domain/progression/schema';
import { createMemoryRepositories } from '@/repositories/memory';
import { createLogger } from '@/services/logging/logger';

import { readFirebaseConfig } from '../firebase/config';
import { SyncQueueService, type SyncBackend } from '../SyncQueueService';

class FakeBackend implements SyncBackend {
  configured = true;
  signedIn = true;
  failUploads = false;
  uploads: string[] = [];
  creations = new Map<string, { creation: Creation; url: string | null }>();
  deleted: string[] = [];
  gardens = 0;
  isConfigured() {
    return this.configured;
  }
  isSignedIn() {
    return this.signedIn;
  }
  async uploadAsset(localUri: string, remotePath: string) {
    if (this.failUploads) throw new Error('offline');
    this.uploads.push(localUri);
    return `https://example.test/${remotePath}`;
  }
  async upsertCreation(creation: Creation, url: string | null) {
    this.creations.set(creation.id, { creation, url });
  }
  async deleteCreation(id: string) {
    this.deleted.push(id);
  }
  async upsertGardenState() {
    this.gardens += 1;
  }
  async upsertProfile() {}
}

function setup(settings: Partial<AppSettings> = {}) {
  const repositories = createMemoryRepositories();
  const backend = new FakeBackend();
  const current: AppSettings = { ...defaultAppSettings, ...settings };
  const service = new SyncQueueService({
    backend,
    repositories,
    logger: createLogger(),
    getSettings: () => current,
  });
  return { repositories, backend, service, current };
}

describe('SyncQueueService', () => {
  it('queues but never uploads while the parent has cloud sync off', async () => {
    const { repositories, backend, service } = setup({ cloudSyncEnabled: false });
    const c = await repositories.creations.create({
      childId: 'chd_default',
      type: 'DRAWING',
      title: 'x',
      thumbnailUri: 'file:///a.png',
      assetUri: 'file:///a.png',
      metadata: {},
    });
    service.enqueue({ kind: 'creation', id: c.id, op: 'upsert' });
    await service.flush();
    expect(service.isEnabled()).toBe(false);
    expect(backend.uploads).toEqual([]);
    expect(service.pendingCount()).toBe(1);
  });

  it('uploads assets and upserts documents once enabled; bundled illustrations are not uploaded', async () => {
    const { repositories, backend, service } = setup({ cloudSyncEnabled: true });
    const photo = await repositories.creations.create({
      childId: 'chd_default',
      type: 'CRAFT',
      title: 'My Cup',
      thumbnailUri: 'file:///cup.jpg',
      assetUri: 'file:///cup.jpg',
      metadata: {},
    });
    const bundled = await repositories.creations.create({
      childId: 'chd_default',
      type: 'CRAFT',
      title: 'My Cup',
      thumbnailUri: 'asset://craft.clayCup.7',
      assetUri: 'asset://craft.clayCup.7',
      metadata: {},
    });
    await repositories.garden.save(
      createInitialGardenState('chd_default', '2026-09-14T00:00:00.000Z'),
    );
    service.enqueue({ kind: 'creation', id: photo.id, op: 'upsert' });
    service.enqueue({ kind: 'creation', id: bundled.id, op: 'upsert' });
    service.enqueue({ kind: 'garden', id: 'chd_default', op: 'upsert' });
    await service.flush();
    expect(backend.uploads).toEqual(['file:///cup.jpg']);
    expect(backend.creations.get(photo.id)?.url).toMatch(/^https:/);
    expect(backend.creations.get(bundled.id)?.url).toBeNull();
    expect(backend.gardens).toBe(1);
    expect(service.pendingCount()).toBe(0);
  });

  it('keeps failed changes queued and retries later; a delete supersedes an upsert', async () => {
    const { repositories, backend, service } = setup({ cloudSyncEnabled: true });
    const c = await repositories.creations.create({
      childId: 'chd_default',
      type: 'DRAWING',
      title: 'x',
      thumbnailUri: 'file:///a.png',
      assetUri: 'file:///a.png',
      metadata: {},
    });
    backend.failUploads = true;
    service.enqueue({ kind: 'creation', id: c.id, op: 'upsert' });
    await service.flush();
    expect(service.pendingCount()).toBe(1);
    expect(await repositories.creations.get(c.id)).not.toBeNull(); // local data untouched
    backend.failUploads = false;
    service.enqueue({ kind: 'creation', id: c.id, op: 'delete' });
    await service.flush();
    expect(backend.deleted).toEqual([c.id]);
    expect(backend.uploads).toEqual([]);
    expect(service.pendingCount()).toBe(0);
  });

  it('is disabled when not signed in or not configured', () => {
    const { backend, service } = setup({ cloudSyncEnabled: true });
    backend.signedIn = false;
    expect(service.isEnabled()).toBe(false);
    backend.signedIn = true;
    backend.configured = false;
    expect(service.isEnabled()).toBe(false);
    expect(service.isConfigured()).toBe(false);
  });
});

describe('readFirebaseConfig', () => {
  it('returns null unless every variable is present', () => {
    expect(readFirebaseConfig({})).toBeNull();
    expect(readFirebaseConfig({ EXPO_PUBLIC_FIREBASE_API_KEY: 'k' })).toBeNull();
    expect(
      readFirebaseConfig({
        EXPO_PUBLIC_FIREBASE_API_KEY: 'k',
        EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN: 'd',
        EXPO_PUBLIC_FIREBASE_PROJECT_ID: 'p',
        EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET: 'b',
        EXPO_PUBLIC_FIREBASE_APP_ID: 'a',
      }),
    ).toEqual({ apiKey: 'k', authDomain: 'd', projectId: 'p', storageBucket: 'b', appId: 'a' });
  });
});
