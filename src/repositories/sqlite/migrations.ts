import type { SqlExecutor } from './executor';

/**
 * Versioned schema. Add a new entry to MIGRATIONS for every change; never edit an
 * applied migration. `PRAGMA user_version` tracks what has run.
 */
export const MIGRATIONS: readonly string[] = [
  // v1 — initial schema
  `
  CREATE TABLE IF NOT EXISTS creations (
    id TEXT PRIMARY KEY NOT NULL,
    child_id TEXT NOT NULL,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    thumbnail_uri TEXT NOT NULL,
    asset_uri TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    favorite INTEGER NOT NULL DEFAULT 0,
    metadata_json TEXT NOT NULL DEFAULT '{}'
  );
  CREATE INDEX IF NOT EXISTS idx_creations_child_created ON creations (child_id, created_at DESC);

  CREATE TABLE IF NOT EXISTS garden_states (
    child_id TEXT PRIMARY KEY NOT NULL,
    state_json TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS progression_events (
    id TEXT PRIMARY KEY NOT NULL,
    child_id TEXT NOT NULL,
    type TEXT NOT NULL,
    occurred_at TEXT NOT NULL,
    payload_json TEXT NOT NULL DEFAULT '{}'
  );
  CREATE INDEX IF NOT EXISTS idx_events_child_time ON progression_events (child_id, occurred_at DESC);

  CREATE TABLE IF NOT EXISTS craft_progress (
    child_id TEXT NOT NULL,
    craft_id TEXT NOT NULL,
    progress_json TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    PRIMARY KEY (child_id, craft_id)
  );

  CREATE TABLE IF NOT EXISTS drawing_drafts (
    child_id TEXT PRIMARY KEY NOT NULL,
    draft_json TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
  `,
  // v2 — learning progress (Plan 3: diamonds, stickers, completions, daily quest)
  `
  CREATE TABLE IF NOT EXISTS learning_progress (
    child_id TEXT PRIMARY KEY NOT NULL,
    progress_json TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
  `,
];

export async function migrate(db: SqlExecutor): Promise<number> {
  const row = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  let version = row?.user_version ?? 0;
  for (let i = version; i < MIGRATIONS.length; i += 1) {
    await db.execAsync(MIGRATIONS[i]!);
    version = i + 1;
    await db.execAsync(`PRAGMA user_version = ${version}`);
  }
  return version;
}
