/**
 * Minimal SQL surface the repositories need. `expo-sqlite`'s `SQLiteDatabase`
 * satisfies it directly on devices; tests use a `node:sqlite` adapter so the same
 * SQL runs for real under Jest.
 */
export type SqlParam = string | number | null;

export interface SqlRunResult {
  changes: number;
}

export interface SqlExecutor {
  execAsync(sql: string): Promise<void>;
  runAsync(sql: string, params?: SqlParam[]): Promise<SqlRunResult>;
  getAllAsync<T>(sql: string, params?: SqlParam[]): Promise<T[]>;
  getFirstAsync<T>(sql: string, params?: SqlParam[]): Promise<T | null>;
}
