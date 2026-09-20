import { AsyncStorageSettingsRepository, PROFILE_KEY } from '../AsyncStorageSettingsRepository';

function fakeStorage(initial: Record<string, string> = {}) {
  const map = new Map(Object.entries(initial));
  return {
    map,
    getItem: async (k: string) => map.get(k) ?? null,
    setItem: async (k: string, v: string) => {
      map.set(k, v);
    },
  };
}

describe('AsyncStorageSettingsRepository', () => {
  it('creates and persists a default profile, then patches settings', async () => {
    const storage = fakeStorage();
    const repo = new AsyncStorageSettingsRepository(() => '2026-09-14T00:00:00.000Z', storage);
    const profile = await repo.getProfile();
    expect(profile.nickname).toBe('PJ');
    expect(storage.map.has(PROFILE_KEY)).toBe(true);

    await repo.updateSettings({ musicEnabled: false });
    const reloaded = new AsyncStorageSettingsRepository(() => 'x', storage);
    expect((await reloaded.getProfile()).settings.musicEnabled).toBe(false);
  });

  it('fills in defaults for settings keys added after an install and survives corrupt data', async () => {
    const old = {
      id: 'chd_default',
      nickname: 'PJ',
      avatar: 'star',
      createdAt: '2026-01-01T00:00:00.000Z',
      settings: { musicEnabled: true },
    };
    const repo = new AsyncStorageSettingsRepository(
      () => 'x',
      fakeStorage({ [PROFILE_KEY]: JSON.stringify(old) }),
    );
    const profile = await repo.getProfile();
    expect(profile.avatar).toBe('star');
    expect(profile.settings.cloudSyncEnabled).toBe(false);
    expect(profile.settings.musicVolume).toBe(0.6);

    const broken = new AsyncStorageSettingsRepository(
      () => '2026-09-14T00:00:00.000Z',
      fakeStorage({ [PROFILE_KEY]: '{not json' }),
    );
    expect((await broken.getProfile()).nickname).toBe('PJ');
  });
});
