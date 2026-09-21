import {
  matchesFilter,
  type Creation,
  type CreationFilter,
  type NewCreation,
} from '@/domain/creation/schema';
import type { CraftProgress } from '@/domain/craft/schema';
import type { DrawingDraft } from '@/domain/drawing/schema';
import type { LearningProgress } from '@/domain/learning/schema';
import { createDefaultProfile, type AppSettings, type ChildProfile } from '@/domain/profile/schema';
import type { GardenState, ProgressionEvent } from '@/domain/progression/schema';
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

/**
 * In-memory repositories. Used by tests and as the web-preview fallback (SQLite on
 * web requires wasm hosting configuration that is out of MVP scope).
 */

export class MemoryCreationRepository implements CreationRepository {
  private readonly items = new Map<string, Creation>();

  constructor(private readonly clock: Clock = systemClock) {}

  async list(childId: string, filter: CreationFilter = 'ALL'): Promise<Creation[]> {
    return [...this.items.values()]
      .filter((c) => c.childId === childId && matchesFilter(c, filter))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  async get(id: string): Promise<Creation | null> {
    return this.items.get(id) ?? null;
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
    this.items.set(creation.id, creation);
    return creation;
  }

  async update(
    id: string,
    patch: Partial<Pick<Creation, 'title' | 'favorite' | 'metadata'>>,
  ): Promise<Creation> {
    const existing = this.items.get(id);
    if (!existing) throw new Error(`Creation ${id} not found`);
    const updated: Creation = { ...existing, ...patch, updatedAt: this.clock() };
    this.items.set(id, updated);
    return updated;
  }

  async remove(id: string): Promise<void> {
    this.items.delete(id);
  }

  async count(childId: string): Promise<number> {
    return [...this.items.values()].filter((c) => c.childId === childId).length;
  }
}

export class MemoryGardenRepository implements GardenRepository {
  private readonly states = new Map<string, GardenState>();
  private readonly events: ProgressionEvent[] = [];

  async get(childId: string): Promise<GardenState | null> {
    return this.states.get(childId) ?? null;
  }

  async save(state: GardenState): Promise<void> {
    this.states.set(state.childId, state);
  }

  async appendEvent(event: ProgressionEvent): Promise<void> {
    this.events.push(event);
  }

  async listEvents(childId: string, limit = 100): Promise<ProgressionEvent[]> {
    return this.events
      .filter((e) => e.childId === childId)
      .slice(-limit)
      .reverse();
  }
}

export class MemoryCraftProgressRepository implements CraftProgressRepository {
  private readonly items = new Map<string, CraftProgress>();

  private key(childId: string, craftId: string): string {
    return `${childId}:${craftId}`;
  }

  async get(childId: string, craftId: string): Promise<CraftProgress | null> {
    return this.items.get(this.key(childId, craftId)) ?? null;
  }

  async save(progress: CraftProgress): Promise<void> {
    this.items.set(this.key(progress.childId, progress.craftId), progress);
  }

  async clear(childId: string, craftId: string): Promise<void> {
    this.items.delete(this.key(childId, craftId));
  }
}

export class MemoryDraftRepository implements DraftRepository {
  private readonly drafts = new Map<string, DrawingDraft>();

  async getCurrent(childId: string): Promise<DrawingDraft | null> {
    return this.drafts.get(childId) ?? null;
  }

  async save(draft: DrawingDraft): Promise<void> {
    this.drafts.set(draft.childId, draft);
  }

  async clear(childId: string): Promise<void> {
    this.drafts.delete(childId);
  }
}

export class MemoryLearningRepository implements LearningProgressRepository {
  private readonly items = new Map<string, LearningProgress>();

  async get(childId: string): Promise<LearningProgress | null> {
    return this.items.get(childId) ?? null;
  }

  async save(progress: LearningProgress): Promise<void> {
    this.items.set(progress.childId, progress);
  }
}

export class MemorySettingsRepository implements SettingsRepository {
  private profile: ChildProfile;

  constructor(clock: Clock = systemClock, initial?: ChildProfile) {
    this.profile = initial ?? createDefaultProfile(clock());
  }

  async getProfile(): Promise<ChildProfile> {
    return this.profile;
  }

  async saveProfile(profile: ChildProfile): Promise<void> {
    this.profile = profile;
  }

  async updateSettings(patch: Partial<AppSettings>): Promise<AppSettings> {
    this.profile = { ...this.profile, settings: { ...this.profile.settings, ...patch } };
    return this.profile.settings;
  }
}

export class MemoryAssetStore implements AssetStore {
  private readonly files = new Map<string, number>();

  async saveFromUri(sourceUri: string, folder: string, fileName: string): Promise<StoredAsset> {
    const uri = `memory://${folder}/${fileName}`;
    // In memory we cannot copy bytes; record the source so tests can assert on it.
    this.files.set(uri, sourceUri.length);
    return { uri, bytes: sourceUri.length };
  }

  async saveBase64(base64: string, folder: string, fileName: string): Promise<StoredAsset> {
    const uri = `memory://${folder}/${fileName}`;
    const bytes = Math.floor((base64.length * 3) / 4);
    this.files.set(uri, bytes);
    return { uri, bytes };
  }

  async remove(uri: string): Promise<void> {
    this.files.delete(uri);
  }

  async exists(uri: string): Promise<boolean> {
    return this.files.has(uri);
  }

  async totalBytes(): Promise<number> {
    let total = 0;
    for (const bytes of this.files.values()) total += bytes;
    return total;
  }
}

export function createMemoryRepositories(clock: Clock = systemClock): Repositories {
  return {
    creations: new MemoryCreationRepository(clock),
    garden: new MemoryGardenRepository(),
    craftProgress: new MemoryCraftProgressRepository(),
    drafts: new MemoryDraftRepository(),
    learning: new MemoryLearningRepository(),
    settings: new MemorySettingsRepository(clock),
    assets: new MemoryAssetStore(),
  };
}
