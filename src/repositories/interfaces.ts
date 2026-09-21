import type { Creation, CreationFilter, NewCreation } from '@/domain/creation/schema';
import type { CraftProgress } from '@/domain/craft/schema';
import type { DrawingDraft } from '@/domain/drawing/schema';
import type { LearningProgress } from '@/domain/learning/schema';
import type { AppSettings, ChildProfile } from '@/domain/profile/schema';
import type { GardenState, ProgressionEvent } from '@/domain/progression/schema';

/**
 * Persistence contracts. Every implementation (SQLite, FileSystem, AsyncStorage,
 * in-memory) satisfies these exactly, so features never know where data lives.
 */

export interface CreationRepository {
  list(childId: string, filter?: CreationFilter): Promise<Creation[]>;
  get(id: string): Promise<Creation | null>;
  create(input: NewCreation): Promise<Creation>;
  update(
    id: string,
    patch: Partial<Pick<Creation, 'title' | 'favorite' | 'metadata'>>,
  ): Promise<Creation>;
  remove(id: string): Promise<void>;
  count(childId: string): Promise<number>;
}

export interface GardenRepository {
  get(childId: string): Promise<GardenState | null>;
  save(state: GardenState): Promise<void>;
  appendEvent(event: ProgressionEvent): Promise<void>;
  listEvents(childId: string, limit?: number): Promise<ProgressionEvent[]>;
}

export interface CraftProgressRepository {
  get(childId: string, craftId: string): Promise<CraftProgress | null>;
  save(progress: CraftProgress): Promise<void>;
  clear(childId: string, craftId: string): Promise<void>;
}

export interface DraftRepository {
  getCurrent(childId: string): Promise<DrawingDraft | null>;
  save(draft: DrawingDraft): Promise<void>;
  clear(childId: string): Promise<void>;
}

/** Diamonds, stickers, completions and today's quest — one record per child. */
export interface LearningProgressRepository {
  get(childId: string): Promise<LearningProgress | null>;
  save(progress: LearningProgress): Promise<void>;
}

export interface SettingsRepository {
  getProfile(): Promise<ChildProfile>;
  saveProfile(profile: ChildProfile): Promise<void>;
  updateSettings(patch: Partial<AppSettings>): Promise<AppSettings>;
}

export interface StoredAsset {
  uri: string;
  bytes: number;
}

/**
 * Binary asset storage (PNG drawings, JPEG photos, thumbnails). Assets are written
 * before metadata so a crash never leaves a Creation pointing at nothing.
 */
export interface AssetStore {
  /** Copies or writes a file into app-private storage and returns its stable URI. */
  saveFromUri(
    sourceUri: string,
    folder: 'creations' | 'photos' | 'thumbnails',
    fileName: string,
  ): Promise<StoredAsset>;
  saveBase64(
    base64: string,
    folder: 'creations' | 'photos' | 'thumbnails',
    fileName: string,
  ): Promise<StoredAsset>;
  remove(uri: string): Promise<void>;
  exists(uri: string): Promise<boolean>;
  totalBytes(): Promise<number>;
}

export interface Repositories {
  creations: CreationRepository;
  garden: GardenRepository;
  craftProgress: CraftProgressRepository;
  drafts: DraftRepository;
  learning: LearningProgressRepository;
  settings: SettingsRepository;
  assets: AssetStore;
}
