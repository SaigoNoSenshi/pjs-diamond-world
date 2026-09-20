import { craftProgressSchema, type CraftProgress } from '@/domain/craft/schema';
import {
  creationMetadataSchema,
  creationSchema,
  type Creation,
  type CreationFilter,
  type NewCreation,
} from '@/domain/creation/schema';
import { drawingDraftSchema, type DrawingDraft } from '@/domain/drawing/schema';
import {
  gardenStateSchema,
  progressionEventSchema,
  type GardenState,
  type ProgressionEvent,
} from '@/domain/progression/schema';
import { createId } from '@/utils/ids';
import { systemClock, type Clock } from '@/utils/time';

import type {
  CraftProgressRepository,
  CreationRepository,
  DraftRepository,
  GardenRepository,
} from '../interfaces';
import type { SqlExecutor, SqlParam } from './executor';

interface CreationRow {
  id: string;
  child_id: string;
  type: string;
  title: string;
  thumbnail_uri: string;
  asset_uri: string;
  created_at: string;
  updated_at: string;
  favorite: number;
  metadata_json: string;
}

function rowToCreation(row: CreationRow): Creation {
  return creationSchema.parse({
    id: row.id,
    childId: row.child_id,
    type: row.type,
    title: row.title,
    thumbnailUri: row.thumbnail_uri,
    assetUri: row.asset_uri,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    favorite: row.favorite === 1,
    metadata: creationMetadataSchema.parse(JSON.parse(row.metadata_json)),
  });
}

function filterClause(filter: CreationFilter): { sql: string; params: SqlParam[] } {
  switch (filter) {
    case 'ALL':
      return { sql: '', params: [] };
    case 'DRAWINGS':
      return { sql: ' AND type = ?', params: ['DRAWING'] };
    case 'CRAFTS':
      return { sql: " AND type IN ('CRAFT', 'PHOTO')", params: [] };
    case 'FAVORITES':
      return { sql: ' AND favorite = 1', params: [] };
  }
}

export class SqliteCreationRepository implements CreationRepository {
  constructor(
    private readonly db: SqlExecutor,
    private readonly clock: Clock = systemClock,
  ) {}

  async list(childId: string, filter: CreationFilter = 'ALL'): Promise<Creation[]> {
    const f = filterClause(filter);
    const rows = await this.db.getAllAsync<CreationRow>(
      `SELECT * FROM creations WHERE child_id = ?${f.sql} ORDER BY created_at DESC`,
      [childId, ...f.params],
    );
    return rows.map(rowToCreation);
  }

  async get(id: string): Promise<Creation | null> {
    const row = await this.db.getFirstAsync<CreationRow>('SELECT * FROM creations WHERE id = ?', [
      id,
    ]);
    return row ? rowToCreation(row) : null;
  }

  async create(input: NewCreation): Promise<Creation> {
    const now = this.clock();
    const creation: Creation = {
      ...input,
      id: createId('cre'),
      createdAt: now,
      updatedAt: now,
      favorite: false,
    };
    creationSchema.parse(creation);
    await this.db.runAsync(
      `INSERT INTO creations (id, child_id, type, title, thumbnail_uri, asset_uri, created_at, updated_at, favorite, metadata_json)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        creation.id,
        creation.childId,
        creation.type,
        creation.title,
        creation.thumbnailUri,
        creation.assetUri,
        creation.createdAt,
        creation.updatedAt,
        0,
        JSON.stringify(creation.metadata),
      ],
    );
    return creation;
  }

  async update(
    id: string,
    patch: Partial<Pick<Creation, 'title' | 'favorite' | 'metadata'>>,
  ): Promise<Creation> {
    const existing = await this.get(id);
    if (!existing) throw new Error(`Creation ${id} not found`);
    const updated: Creation = { ...existing, ...patch, updatedAt: this.clock() };
    creationSchema.parse(updated);
    await this.db.runAsync(
      'UPDATE creations SET title = ?, favorite = ?, metadata_json = ?, updated_at = ? WHERE id = ?',
      [
        updated.title,
        updated.favorite ? 1 : 0,
        JSON.stringify(updated.metadata),
        updated.updatedAt,
        id,
      ],
    );
    return updated;
  }

  async remove(id: string): Promise<void> {
    await this.db.runAsync('DELETE FROM creations WHERE id = ?', [id]);
  }

  async count(childId: string): Promise<number> {
    const row = await this.db.getFirstAsync<{ n: number }>(
      'SELECT COUNT(*) AS n FROM creations WHERE child_id = ?',
      [childId],
    );
    return row?.n ?? 0;
  }
}

export class SqliteGardenRepository implements GardenRepository {
  constructor(private readonly db: SqlExecutor) {}

  async get(childId: string): Promise<GardenState | null> {
    const row = await this.db.getFirstAsync<{ state_json: string }>(
      'SELECT state_json FROM garden_states WHERE child_id = ?',
      [childId],
    );
    return row ? gardenStateSchema.parse(JSON.parse(row.state_json)) : null;
  }

  async save(state: GardenState): Promise<void> {
    gardenStateSchema.parse(state);
    await this.db.runAsync(
      `INSERT INTO garden_states (child_id, state_json, updated_at) VALUES (?, ?, ?)
       ON CONFLICT(child_id) DO UPDATE SET state_json = excluded.state_json, updated_at = excluded.updated_at`,
      [state.childId, JSON.stringify(state), state.updatedAt],
    );
  }

  async appendEvent(event: ProgressionEvent): Promise<void> {
    progressionEventSchema.parse(event);
    await this.db.runAsync(
      'INSERT OR IGNORE INTO progression_events (id, child_id, type, occurred_at, payload_json) VALUES (?, ?, ?, ?, ?)',
      [event.id, event.childId, event.type, event.occurredAt, JSON.stringify(event.payload)],
    );
  }

  async listEvents(childId: string, limit = 100): Promise<ProgressionEvent[]> {
    const rows = await this.db.getAllAsync<{
      id: string;
      child_id: string;
      type: string;
      occurred_at: string;
      payload_json: string;
    }>(
      'SELECT * FROM progression_events WHERE child_id = ? ORDER BY occurred_at DESC, rowid DESC LIMIT ?',
      [childId, limit],
    );
    return rows.map((r) =>
      progressionEventSchema.parse({
        id: r.id,
        childId: r.child_id,
        type: r.type,
        occurredAt: r.occurred_at,
        payload: JSON.parse(r.payload_json),
      }),
    );
  }
}

export class SqliteCraftProgressRepository implements CraftProgressRepository {
  constructor(private readonly db: SqlExecutor) {}

  async get(childId: string, craftId: string): Promise<CraftProgress | null> {
    const row = await this.db.getFirstAsync<{ progress_json: string }>(
      'SELECT progress_json FROM craft_progress WHERE child_id = ? AND craft_id = ?',
      [childId, craftId],
    );
    return row ? craftProgressSchema.parse(JSON.parse(row.progress_json)) : null;
  }

  async save(progress: CraftProgress): Promise<void> {
    craftProgressSchema.parse(progress);
    await this.db.runAsync(
      `INSERT INTO craft_progress (child_id, craft_id, progress_json, updated_at) VALUES (?, ?, ?, ?)
       ON CONFLICT(child_id, craft_id) DO UPDATE SET progress_json = excluded.progress_json, updated_at = excluded.updated_at`,
      [progress.childId, progress.craftId, JSON.stringify(progress), progress.updatedAt],
    );
  }

  async clear(childId: string, craftId: string): Promise<void> {
    await this.db.runAsync('DELETE FROM craft_progress WHERE child_id = ? AND craft_id = ?', [
      childId,
      craftId,
    ]);
  }
}

export class SqliteDraftRepository implements DraftRepository {
  constructor(private readonly db: SqlExecutor) {}

  async getCurrent(childId: string): Promise<DrawingDraft | null> {
    const row = await this.db.getFirstAsync<{ draft_json: string }>(
      'SELECT draft_json FROM drawing_drafts WHERE child_id = ?',
      [childId],
    );
    return row ? drawingDraftSchema.parse(JSON.parse(row.draft_json)) : null;
  }

  async save(draft: DrawingDraft): Promise<void> {
    drawingDraftSchema.parse(draft);
    await this.db.runAsync(
      `INSERT INTO drawing_drafts (child_id, draft_json, updated_at) VALUES (?, ?, ?)
       ON CONFLICT(child_id) DO UPDATE SET draft_json = excluded.draft_json, updated_at = excluded.updated_at`,
      [draft.childId, JSON.stringify(draft), draft.updatedAt],
    );
  }

  async clear(childId: string): Promise<void> {
    await this.db.runAsync('DELETE FROM drawing_drafts WHERE child_id = ?', [childId]);
  }
}
