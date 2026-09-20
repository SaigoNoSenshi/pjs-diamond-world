import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  appSettingsSchema,
  childProfileSchema,
  createDefaultProfile,
  defaultAppSettings,
  type AppSettings,
  type ChildProfile,
} from '@/domain/profile/schema';
import { systemClock, type Clock } from '@/utils/time';

import type { SettingsRepository } from '../interfaces';

export const PROFILE_KEY = 'pjs.profile.v1';

/**
 * Lightweight settings + nickname in AsyncStorage (localStorage on web).
 * Unknown/corrupt data falls back to defaults — the child can always play.
 */
export class AsyncStorageSettingsRepository implements SettingsRepository {
  private cache: ChildProfile | null = null;

  constructor(
    private readonly clock: Clock = systemClock,
    private readonly storage: Pick<typeof AsyncStorage, 'getItem' | 'setItem'> = AsyncStorage,
  ) {}

  async getProfile(): Promise<ChildProfile> {
    if (this.cache) return this.cache;
    let raw: string | null = null;
    try {
      raw = await this.storage.getItem(PROFILE_KEY);
    } catch {
      // Storage denied (e.g. sandboxed iframe): fall through to defaults, keep in memory.
      raw = null;
    }
    if (raw) {
      const parsed = childProfileSchema.safeParse(withDefaults(safeJsonParse(raw)));
      if (parsed.success) {
        this.cache = parsed.data;
        return parsed.data;
      }
    }
    const profile = createDefaultProfile(this.clock());
    await this.saveProfile(profile);
    return profile;
  }

  async saveProfile(profile: ChildProfile): Promise<void> {
    childProfileSchema.parse(profile);
    this.cache = profile;
    try {
      await this.storage.setItem(PROFILE_KEY, JSON.stringify(profile));
    } catch {
      // Storage denied: the in-memory cache keeps the session consistent.
    }
  }

  async updateSettings(patch: Partial<AppSettings>): Promise<AppSettings> {
    const profile = await this.getProfile();
    const settings = appSettingsSchema.parse({ ...profile.settings, ...patch });
    await this.saveProfile({ ...profile, settings });
    return settings;
  }
}

function safeJsonParse(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/** Forward-compatible merge so new settings keys get defaults on old installs. */
function withDefaults(raw: unknown): unknown {
  if (typeof raw !== 'object' || raw === null) return raw;
  const obj = raw as { settings?: Record<string, unknown> };
  return { ...obj, settings: { ...defaultAppSettings, ...(obj.settings ?? {}) } };
}
