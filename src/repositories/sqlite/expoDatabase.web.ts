import type { SqlExecutor } from './executor';

export const DATABASE_NAME = 'pjs-diamond-world.db';

/**
 * Web preview never opens SQLite (it would need wasm hosting + COOP/COEP headers).
 * `createDeviceRepositories` already picks the in-memory repositories on web; this
 * platform file guarantees the native driver is not bundled for web at all.
 */
export async function openExpoDatabase(): Promise<SqlExecutor> {
  throw new Error('SQLite is not available in the web preview; using in-memory repositories.');
}
