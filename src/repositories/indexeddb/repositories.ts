import { craftProgressSchema, type CraftProgress } from '@/domain/craft/schema';
import {
  creationSchema,
  matchesFilter,
  type Creation,
  type CreationFilter,
  type NewCreation,
} from '@/domain/creation/schema';
import { drawingDraftSchema, type DrawingDraft } from '@/domain/drawing/schema';
import { learningProgressSchema, type LearningProgress } from '@/domain/learning/schema';
import {
  gardenStateSchema,
  progressionEventSchema,
  type GardenState,
  type ProgressionEvent,
} from '@/domain/progression/schema';
import { createId } from '@/utils/ids';
import { systemClock, type Clock } from '@/utils/time';

import type {
  AssetStore,
  CraftProgressRepository,
  CreationRepository,
  DraftRepository,
  GardenRepository,
  LearningProgressRepository,
  Repositories,
  SettingsRepository,
  StoredAsset,
} from '../interfaces';
import type { KeyValueStore } from './database';

export class KvLearningRepository implements LearningProgressRepository {
  constructor(private readonly kv: KeyValueStore) {}

  async get(childId: string): Promise<LearningProgress | null> {
    const parsed = learningProgressSchema.safeParse(await this.kv.get('learningProgress', childId));
    return parsed.success ? parsed.data : null;
  }

  async save(progress: LearningProgress): Promise<void> {
    await this.kv.put('learningProgress', progress.childId, learningProgressSchema.parse(progress));
  }
}

/**
 * Web repositories over a KeyValueStore (IndexedDB in browsers; memory when denied).
 * Records are validated on read so a corrupt entry can never crash a screen.
 */

export class KvCreationRepository implements CreationRepository {
  constructor(
    private readonly kv: KeyValueStore,
    private readonly clock: Clock = systemClock,
  ) {}

  async list(childId: string, filter: CreationFilter = 'ALL'): Promise<Creation[]> {
    const all = await this.kv.getAll<unknown>('creations');
    return all
      .map((raw) => creationSchema.safeParse(raw))
      .flatMap((r) => (r.success ? [r.data] : []))
      .filter((c) => c.childId === childId && matchesFilter(c, filter))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  async get(id: string): Promise<Creation | null> {
    const raw = await this.kv.get<unknown>('creations', id);
    const parsed = creationSchema.safeParse(raw);
    return parsed.success ? parsed.data : null;
  }

  async create(input: NewCreation): Promise<Creation> {
    const now = this.clock();
    const creation = creationSchema.parse({
      ...input,
      id: createId('cre'),
      createdAt: now,
      updatedAt: now,
      favorite: false,
    });
    await this.kv.put('creations', creation.id, creation);
    return creation;
  }

  async update(
    id: string,
    patch: Partial<Pick<Creation, 'title' | 'favorite' | 'metadata'>>,
  ): Promise<Creation> {
    const existing = await this.get(id);
    if (!existing) throw new Error(`Creation ${id} not found`);
    const updated = creationSchema.parse({ ...existing, ...patch, updatedAt: this.clock() });
    await this.kv.put('creations', id, updated);
    return updated;
  }

  async remove(id: string): Promise<void> {
    await this.kv.delete('creations', id);
  }

  async count(childId: string): Promise<number> {
    return (await this.list(childId)).length;
  }
}

export class KvGardenRepository implements GardenRepository {
  constructor(private readonly kv: KeyValueStore) {}

  async get(childId: string): Promise<GardenState | null> {
    const parsed = gardenStateSchema.safeParse(await this.kv.get('gardenStates', childId));
    return parsed.success ? parsed.data : null;
  }

  async save(state: GardenState): Promise<void> {
    await this.kv.put('gardenStates', state.childId, gardenStateSchema.parse(state));
  }

  async appendEvent(event: ProgressionEvent): Promise<void> {
    await this.kv.put('events', event.id, progressionEventSchema.parse(event));
  }

  async listEvents(childId: string, limit = 100): Promise<ProgressionEvent[]> {
    const all = await this.kv.getAll<unknown>('events');
    return all
      .map((raw) => progressionEventSchema.safeParse(raw))
      .flatMap((r) => (r.success ? [r.data] : []))
      .filter((e) => e.childId === childId)
      .sort((a, b) => b.occurredAt.localeCompare(a.occurredAt))
      .slice(0, limit);
  }
}

export class KvCraftProgressRepository implements CraftProgressRepository {
  constructor(private readonly kv: KeyValueStore) {}

  async get(childId: string, craftId: string): Promise<CraftProgress | null> {
    const parsed = craftProgressSchema.safeParse(
      await this.kv.get('craftProgress', `${childId}:${craftId}`),
    );
    return parsed.success ? parsed.data : null;
  }

  async save(progress: CraftProgress): Promise<void> {
    await this.kv.put(
      'craftProgress',
      `${progress.childId}:${progress.craftId}`,
      craftProgressSchema.parse(progress),
    );
  }

  async clear(childId: string, craftId: string): Promise<void> {
    await this.kv.delete('craftProgress', `${childId}:${craftId}`);
  }
}

export class KvDraftRepository implements DraftRepository {
  constructor(private readonly kv: KeyValueStore) {}

  async getCurrent(childId: string): Promise<DrawingDraft | null> {
    const parsed = drawingDraftSchema.safeParse(await this.kv.get('drafts', childId));
    return parsed.success ? parsed.data : null;
  }

  async save(draft: DrawingDraft): Promise<void> {
    await this.kv.put('drafts', draft.childId, drawingDraftSchema.parse(draft));
  }

  async clear(childId: string): Promise<void> {
    await this.kv.delete('drafts', childId);
  }
}

/**
 * Web asset store: images are kept as data URIs (no file system in a browser).
 * `saveFromUri` accepts blob:/data:/http(s): sources and converts them to data URIs.
 * Sizes are tracked in the `assets` table for the Parent Mode storage figure.
 */
export class DataUriAssetStore implements AssetStore {
  constructor(
    private readonly kv: KeyValueStore,
    private readonly fetchImpl: typeof fetch = (...args) => fetch(...args),
  ) {}

  private async record(uri: string, bytes: number): Promise<StoredAsset> {
    await this.kv.put('assets', hashKey(uri), { bytes });
    return { uri, bytes };
  }

  async saveFromUri(sourceUri: string, _folder: string, _fileName: string): Promise<StoredAsset> {
    if (sourceUri.startsWith('data:')) {
      return this.record(sourceUri, estimateBytes(sourceUri));
    }
    const response = await this.fetchImpl(sourceUri);
    const blob = await response.blob();
    const dataUri = await blobToDataUri(blob);
    return this.record(dataUri, blob.size);
  }

  async saveBase64(base64: string, _folder: string, fileName: string): Promise<StoredAsset> {
    const clean = base64.replace(/^data:[^;]+;base64,/, '');
    const mime = fileName.endsWith('.jpg') ? 'image/jpeg' : 'image/png';
    const uri = `data:${mime};base64,${clean}`;
    return this.record(uri, estimateBytes(uri));
  }

  async remove(uri: string): Promise<void> {
    await this.kv.delete('assets', hashKey(uri));
  }

  async exists(uri: string): Promise<boolean> {
    return uri.startsWith('data:') && (await this.kv.get('assets', hashKey(uri))) !== undefined;
  }

  async totalBytes(): Promise<number> {
    const all = await this.kv.getAll<{ bytes: number }>('assets');
    return all.reduce((sum, a) => sum + (a?.bytes ?? 0), 0);
  }
}

function estimateBytes(dataUri: string): number {
  const comma = dataUri.indexOf(',');
  return Math.floor(((dataUri.length - comma - 1) * 3) / 4);
}

/** Cheap stable key for a (possibly multi-MB) data URI. */
function hashKey(s: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return `${h.toString(16)}:${s.length}`;
}

async function blobToDataUri(blob: Blob): Promise<string> {
  // arrayBuffer() exists in every modern browser and in Node; no FileReader needed.
  const bytes = new Uint8Array(await blob.arrayBuffer());
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  const b64 = typeof btoa === 'function' ? btoa(binary) : manualBase64(bytes);
  return `data:${blob.type || 'application/octet-stream'};base64,${b64}`;
}

function manualBase64(bytes: Uint8Array): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let out = '';
  for (let i = 0; i < bytes.length; i += 3) {
    const a = bytes[i]!;
    const b = bytes[i + 1];
    const c = bytes[i + 2];
    const triple = (a << 16) | ((b ?? 0) << 8) | (c ?? 0);
    out += chars[(triple >> 18) & 63]! + chars[(triple >> 12) & 63]!;
    out += b === undefined ? '=' : chars[(triple >> 6) & 63]!;
    out += c === undefined ? '=' : chars[triple & 63]!;
  }
  return out;
}

export function createKvRepositories(
  kv: KeyValueStore,
  settings: SettingsRepository,
): Repositories {
  return {
    creations: new KvCreationRepository(kv),
    garden: new KvGardenRepository(kv),
    craftProgress: new KvCraftProgressRepository(kv),
    drafts: new KvDraftRepository(kv),
    learning: new KvLearningRepository(kv),
    settings,
    assets: new DataUriAssetStore(kv),
  };
}
