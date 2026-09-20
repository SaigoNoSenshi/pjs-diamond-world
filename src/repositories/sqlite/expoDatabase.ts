import * as SQLite from 'expo-sqlite';

import type { SqlExecutor } from './executor';
import { migrate } from './migrations';

export const DATABASE_NAME = 'pjs-diamond-world.db';

/** Opens (and migrates) the on-device database. expo-sqlite's API matches SqlExecutor. */
export async function openExpoDatabase(name = DATABASE_NAME): Promise<SqlExecutor> {
  const db = await SQLite.openDatabaseAsync(name);
  await db.execAsync('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;');
  const executor: SqlExecutor = {
    execAsync: (sql) => db.execAsync(sql),
    runAsync: async (sql, params = []) => {
      const result = await db.runAsync(sql, params);
      return { changes: result.changes };
    },
    getAllAsync: (sql, params = []) => db.getAllAsync(sql, params),
    getFirstAsync: (sql, params = []) => db.getFirstAsync(sql, params),
  };
  await migrate(executor);
  return executor;
}
