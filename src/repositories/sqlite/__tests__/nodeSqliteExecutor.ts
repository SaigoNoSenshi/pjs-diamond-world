import { DatabaseSync } from 'node:sqlite';

import type { SqlExecutor, SqlParam } from '../executor';

/** Test-only adapter: runs the repositories' SQL against Node's built-in SQLite. */
export function createNodeSqliteExecutor(): SqlExecutor {
  const db = new DatabaseSync(':memory:');
  return {
    async execAsync(sql: string) {
      db.exec(sql);
    },
    async runAsync(sql: string, params: SqlParam[] = []) {
      const result = db.prepare(sql).run(...params);
      return { changes: Number(result.changes) };
    },
    async getAllAsync<T>(sql: string, params: SqlParam[] = []) {
      return db.prepare(sql).all(...params) as T[];
    },
    async getFirstAsync<T>(sql: string, params: SqlParam[] = []) {
      return (db.prepare(sql).get(...params) as T | undefined) ?? null;
    },
  };
}
