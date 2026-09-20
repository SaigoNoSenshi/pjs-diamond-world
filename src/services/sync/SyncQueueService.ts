import type { Creation } from '@/domain/creation/schema';
import type { AppSettings, ChildProfile } from '@/domain/profile/schema';
import type { GardenState } from '@/domain/progression/schema';
import type { Repositories } from '@/repositories/interfaces';

import type { SyncChange, SyncService } from '../interfaces';
import type { Logger } from '../logging/logger';

/**
 * What a cloud backend must provide. Kept tiny so it can be faked in tests and so
 * the Firebase adapter stays thin. Every method may throw; the queue handles it.
 */
export interface SyncBackend {
  /** True when credentials/config exist for this build. */
  isConfigured(): boolean;
  /** True when a parent account is signed in. */
  isSignedIn(): boolean;
  /** Uploads a local file and returns its remote URL. */
  uploadAsset(localUri: string, remotePath: string): Promise<string>;
  upsertCreation(creation: Creation, remoteAssetUrl: string | null): Promise<void>;
  deleteCreation(creationId: string): Promise<void>;
  upsertGardenState(state: GardenState): Promise<void>;
  upsertProfile(profile: ChildProfile): Promise<void>;
}

export interface SyncQueueDeps {
  backend: SyncBackend;
  repositories: Repositories;
  logger: Logger;
  /** Reads the current parent setting; sync is off unless the parent turned it on. */
  getSettings: () => AppSettings;
  /** Called after each successful flush (for UI/logging). */
  onFlushed?: (count: number) => void;
}

/**
 * Local-first sync: changes are queued locally and flushed only when configured,
 * enabled by the parent, signed in, and the backend cooperates. Never blocks UI,
 * never throws to callers, never alters local data.
 */
export class SyncQueueService implements SyncService {
  private readonly pending = new Map<string, SyncChange>();
  private flushing: Promise<void> | null = null;

  constructor(private readonly deps: SyncQueueDeps) {}

  isConfigured(): boolean {
    return this.deps.backend.isConfigured();
  }

  isEnabled(): boolean {
    return (
      this.isConfigured() &&
      this.deps.getSettings().cloudSyncEnabled &&
      this.deps.backend.isSignedIn()
    );
  }

  pendingCount(): number {
    return this.pending.size;
  }

  enqueue(change: SyncChange): void {
    // Latest change per record wins; a delete supersedes an upsert.
    this.pending.set(`${change.kind}:${change.id}`, change);
  }

  flush(): Promise<void> {
    if (this.flushing) return this.flushing;
    this.flushing = this.run().finally(() => {
      this.flushing = null;
    });
    return this.flushing;
  }

  private async run(): Promise<void> {
    if (!this.isEnabled() || this.pending.size === 0) return;
    let flushed = 0;
    for (const [key, change] of [...this.pending.entries()]) {
      try {
        await this.apply(change);
        this.pending.delete(key);
        flushed += 1;
      } catch (error) {
        // Leave it queued; a later flush retries. Local data is untouched.
        this.deps.logger.warn('sync change failed', { key, error: String(error) });
      }
    }
    if (flushed > 0) this.deps.onFlushed?.(flushed);
  }

  private async apply(change: SyncChange): Promise<void> {
    const { backend, repositories } = this.deps;
    switch (change.kind) {
      case 'creation': {
        if (change.op === 'delete') {
          await backend.deleteCreation(change.id);
          return;
        }
        const creation = await repositories.creations.get(change.id);
        if (!creation) return; // deleted locally since; nothing to sync
        const remoteUrl = creation.assetUri.startsWith('asset://')
          ? null
          : await backend.uploadAsset(
              creation.assetUri,
              `creations/${creation.childId}/${creation.id}`,
            );
        await backend.upsertCreation(creation, remoteUrl);
        return;
      }
      case 'garden': {
        const state = await repositories.garden.get(change.id);
        if (state) await backend.upsertGardenState(state);
        return;
      }
      case 'settings': {
        await backend.upsertProfile(await repositories.settings.getProfile());
        return;
      }
    }
  }
}
