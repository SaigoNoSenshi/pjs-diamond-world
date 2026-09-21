import { Platform } from 'react-native';

import type { Logger } from '@/services/logging/logger';

import { AsyncStorageSettingsRepository } from './asyncstorage/AsyncStorageSettingsRepository';
import { FileSystemAssetStore } from './filesystem/FileSystemAssetStore';
import type { Repositories } from './interfaces';
import {
  createMemoryKeyValueStore,
  isIndexedDbAvailable,
  openIndexedDb,
} from './indexeddb/database';
import { createKvRepositories } from './indexeddb/repositories';
import { createMemoryRepositories } from './memory';
import { openExpoDatabase } from './sqlite/expoDatabase';
import { SqliteLearningRepository } from './sqlite/learning';
import {
  SqliteCraftProgressRepository,
  SqliteCreationRepository,
  SqliteDraftRepository,
  SqliteGardenRepository,
} from './sqlite/repositories';

/**
 * Chooses persistence per platform:
 *  - iOS/Android: SQLite (metadata) + FileSystem (assets) + AsyncStorage (settings)
 *  - web: IndexedDB-backed repositories (data-URI assets); memory when storage is denied.
 * If SQLite fails to open, we fall back to memory so the child can still play and log loudly.
 */
export async function createDeviceRepositories(logger: Logger): Promise<Repositories> {
  const settings = new AsyncStorageSettingsRepository();
  if (Platform.OS === 'web') {
    // Browsers: IndexedDB when available (proper hosting), otherwise an in-memory
    // key-value store (sandboxed iframes deny storage). Same repositories either way.
    if (isIndexedDbAvailable()) {
      try {
        const kv = await openIndexedDb();
        logger.info('web: using IndexedDB repositories');
        return createKvRepositories(kv, settings);
      } catch (error) {
        logger.warn('web: IndexedDB unavailable, using memory', { error: String(error) });
      }
    }
    return createKvRepositories(createMemoryKeyValueStore(), settings);
  }
  try {
    const db = await openExpoDatabase();
    return {
      creations: new SqliteCreationRepository(db),
      garden: new SqliteGardenRepository(db),
      craftProgress: new SqliteCraftProgressRepository(db),
      drafts: new SqliteDraftRepository(db),
      learning: new SqliteLearningRepository(db),
      settings,
      assets: new FileSystemAssetStore(),
    };
  } catch (error) {
    logger.error('sqlite unavailable, falling back to memory repositories', error);
    return { ...createMemoryRepositories(), settings };
  }
}

export type { Repositories } from './interfaces';
