import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';

import { createDefaultProfile, type AppSettings, type ChildProfile } from '@/domain/profile/schema';
import { nowIso } from '@/utils/time';

import { useAppServices } from './useAppServices';

interface ProfileContextValue {
  profile: ChildProfile;
  settings: AppSettings;
  ready: boolean;
  updateSettings(patch: Partial<AppSettings>): Promise<void>;
  updateNickname(nickname: string): Promise<void>;
}

export const ProfileContext = createContext<ProfileContextValue | null>(null);

/**
 * Loads the single local child profile and exposes settings to every screen.
 * Storage failures fall back to defaults so the child can always play.
 */
export function ProfileProvider({ children }: PropsWithChildren) {
  const { repositories, logger } = useAppServices();
  const [profile, setProfile] = useState<ChildProfile>(() => createDefaultProfile(nowIso()));
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    repositories.settings
      .getProfile()
      .then((loaded) => {
        if (mounted) setProfile(loaded);
      })
      .catch((error: unknown) => logger.error('profile load failed', error))
      .finally(() => {
        if (mounted) setReady(true);
      });
    return () => {
      mounted = false;
    };
  }, [repositories.settings, logger]);

  const updateSettings = useCallback(
    async (patch: Partial<AppSettings>) => {
      setProfile((p) => ({ ...p, settings: { ...p.settings, ...patch } }));
      try {
        await repositories.settings.updateSettings(patch);
      } catch (error) {
        logger.error('settings save failed', error);
      }
    },
    [repositories.settings, logger],
  );

  const updateNickname = useCallback(
    async (nickname: string) => {
      const trimmed = nickname.trim().slice(0, 24) || profile.nickname;
      const next = { ...profile, nickname: trimmed };
      setProfile(next);
      try {
        await repositories.settings.saveProfile(next);
      } catch (error) {
        logger.error('profile save failed', error);
      }
    },
    [profile, repositories.settings, logger],
  );

  const value = useMemo<ProfileContextValue>(
    () => ({ profile, settings: profile.settings, ready, updateSettings, updateNickname }),
    [profile, ready, updateSettings, updateNickname],
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile(): ProfileContextValue {
  const value = useContext(ProfileContext);
  if (!value) throw new Error('useProfile must be used inside ProfileProvider');
  return value;
}
