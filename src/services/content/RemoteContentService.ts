import AsyncStorage from '@react-native-async-storage/async-storage';
import { z } from 'zod';

import { registerActivities, unregisterSource } from '@/content/activities/registry';
import { activityDefinitionSchema } from '@/domain/activity/schema';

import type { Logger } from '../logging/logger';

/**
 * Auto-updating content: a JSON pack published with the app on its OWN site
 * (`/content/packs.json`). Fetched at launch when online, validated, cached locally,
 * merged into the activity registry. Same-origin only — the app never talks to a
 * third party, never sends anything, and a bad or missing pack changes nothing.
 */
export const contentPackSchema = z.object({
  /** Increases with every published change. */
  version: z.number().int().nonnegative(),
  publishedAt: z.string().min(1),
  /** Short human note shown to parents. */
  note: z.string().max(200).optional(),
  activities: z.array(z.unknown()),
});
export type ContentPack = z.infer<typeof contentPackSchema>;

export const REMOTE_SOURCE = 'remote';
const CACHE_KEY = 'pjdw.remotePack.v1';
const META_KEY = 'pjdw.remotePack.meta.v1';

export interface RemoteContentMeta {
  version: number;
  checkedAt: string;
  activities: number;
}

export interface RemoteContentResult {
  status: 'updated' | 'unchanged' | 'offline' | 'invalid';
  meta: RemoteContentMeta | null;
  added: number;
  replaced: number;
  rejected: number;
}

export class RemoteContentService {
  private readonly listeners = new Set<() => void>();
  private meta: RemoteContentMeta | null = null;

  constructor(
    private readonly url: string | null,
    private readonly logger: Logger,
    private readonly fetchImpl: typeof fetch = (...args) => fetch(...args),
    private readonly storage: Pick<typeof AsyncStorage, 'getItem' | 'setItem'> = AsyncStorage,
    private readonly now: () => string = () => new Date().toISOString(),
  ) {}

  getMeta(): RemoteContentMeta | null {
    return this.meta;
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /** Registers the cached pack (offline start), then refreshes from the network. */
  async start(): Promise<RemoteContentResult> {
    await this.loadCached();
    return this.refresh();
  }

  private async loadCached(): Promise<void> {
    try {
      const [raw, meta] = await Promise.all([
        this.storage.getItem(CACHE_KEY),
        this.storage.getItem(META_KEY),
      ]);
      if (!raw) return;
      const pack = contentPackSchema.safeParse(JSON.parse(raw));
      if (!pack.success) return;
      this.apply(pack.data);
      if (meta) this.meta = JSON.parse(meta) as RemoteContentMeta;
    } catch (error) {
      this.logger.warn('remote content cache unreadable', { error: String(error) });
    }
  }

  async refresh(): Promise<RemoteContentResult> {
    const base: RemoteContentResult = {
      status: 'offline',
      meta: this.meta,
      added: 0,
      replaced: 0,
      rejected: 0,
    };
    if (!this.url) return { ...base, status: 'unchanged' };
    let text: string;
    try {
      const response = await this.fetchImpl(`${this.url}?t=${Date.now()}`, { cache: 'no-store' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      text = await response.text();
    } catch (error) {
      this.logger.info('remote content unavailable', { error: String(error) });
      return base;
    }
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      return { ...base, status: 'invalid' };
    }
    const pack = contentPackSchema.safeParse(parsed);
    if (!pack.success) {
      this.logger.warn('remote content pack invalid', { issue: pack.error.issues[0]?.message });
      return { ...base, status: 'invalid' };
    }
    const unchanged = this.meta !== null && this.meta.version === pack.data.version;
    const result = this.apply(pack.data);
    this.meta = {
      version: pack.data.version,
      checkedAt: this.now(),
      activities: pack.data.activities.length,
    };
    try {
      await this.storage.setItem(CACHE_KEY, text);
      await this.storage.setItem(META_KEY, JSON.stringify(this.meta));
    } catch (error) {
      this.logger.warn('remote content cache write failed', { error: String(error) });
    }
    for (const l of this.listeners) l();
    return { status: unchanged ? 'unchanged' : 'updated', meta: this.meta, ...result };
  }

  private apply(pack: ContentPack): { added: number; replaced: number; rejected: number } {
    unregisterSource(REMOTE_SOURCE);
    // Validate here too so the count of rejected entries is reported to parents.
    const valid = pack.activities.filter((a) => activityDefinitionSchema.safeParse(a).success);
    const result = registerActivities(valid, REMOTE_SOURCE);
    const rejected = pack.activities.length - valid.length;
    if (rejected > 0) this.logger.warn('remote pack entries rejected', { rejected });
    return { added: result.added, replaced: result.replaced, rejected };
  }
}

/** Where this build looks for content updates. Web: same origin. Native: the published site. */
export function defaultContentUrl(platform: string, base: string): string | null {
  if (platform === 'web') {
    if (typeof window === 'undefined') return null;
    return `${window.location.origin}${base}/content/packs.json`;
  }
  const configured = process.env.EXPO_PUBLIC_CONTENT_URL;
  return configured && configured.length > 0 ? configured : null;
}
