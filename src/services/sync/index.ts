import type { Repositories } from '@/repositories/interfaces';
import type { AppSettings } from '@/domain/profile/schema';

import { NoopSyncService } from '../defaults';
import type { SyncService } from '../interfaces';
import type { Logger } from '../logging/logger';
import { readFirebaseConfig } from './firebase/config';
import { SyncQueueService } from './SyncQueueService';

/**
 * Chooses the sync implementation. Without a complete Firebase config this returns
 * the no-op service and the app is local-only — the default and recommended mode.
 *
 * The Firebase SDK (~1.9 MB of source) is loaded with a dynamic `import()` so it is
 * split out of the main bundle and never downloaded unless a config is present.
 */
export async function createSyncService(
  repositories: Repositories,
  getSettings: () => AppSettings,
  logger: Logger,
): Promise<SyncService> {
  const config = readFirebaseConfig();
  if (!config) {
    logger.info('cloud sync not configured; local-only');
    return new NoopSyncService();
  }
  try {
    const { FirebaseBackend } = await import('./firebase/FirebaseBackend');
    const backend = new FirebaseBackend(config, logger);
    return new SyncQueueService({ backend, repositories, logger, getSettings });
  } catch (error) {
    logger.error('firebase init failed; local-only', error);
    return new NoopSyncService();
  }
}
