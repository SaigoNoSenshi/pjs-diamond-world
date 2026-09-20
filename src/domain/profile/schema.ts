import { z } from 'zod';

import { entityId, isoDateTime } from '../shared/schema';

export const appSettingsSchema = z.object({
  musicEnabled: z.boolean(),
  soundEffectsEnabled: z.boolean(),
  voiceEnabled: z.boolean(),
  cloudSyncEnabled: z.boolean(),
  /** Parent override; when undefined the OS reduced-motion preference is used. */
  reducedMotion: z.boolean().optional(),
  introSeen: z.boolean(),
  /** Salted hash of an optional parent PIN. Never the PIN itself. */
  parentPinHash: z.string().optional(),
  musicVolume: z.number().min(0).max(1),
});
export type AppSettings = z.infer<typeof appSettingsSchema>;

export const defaultAppSettings: AppSettings = {
  musicEnabled: true,
  soundEffectsEnabled: true,
  voiceEnabled: true,
  cloudSyncEnabled: false,
  introSeen: false,
  musicVolume: 0.6,
};

export const avatarIdSchema = z.enum(['jellyfish', 'diamond', 'star', 'flower', 'crown']);
export type AvatarId = z.infer<typeof avatarIdSchema>;

/** Nickname only. No real names, birthdays, or contact data — see docs/CHILD_SAFETY.md. */
export const childProfileSchema = z.object({
  id: entityId,
  nickname: z.string().trim().min(1).max(24),
  avatar: avatarIdSchema,
  createdAt: isoDateTime,
  settings: appSettingsSchema,
});
export type ChildProfile = z.infer<typeof childProfileSchema>;

export const DEFAULT_CHILD_ID = 'chd_default';
export const DEFAULT_NICKNAME = 'PJ';

export function createDefaultProfile(createdAt: string): ChildProfile {
  return {
    id: DEFAULT_CHILD_ID,
    nickname: DEFAULT_NICKNAME,
    avatar: 'jellyfish',
    createdAt,
    settings: defaultAppSettings,
  };
}
