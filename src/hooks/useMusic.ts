import { useCallback, useEffect, useSyncExternalStore } from 'react';

import { useAppServices } from './useAppServices';
import { useProfile } from './useProfile';

/** Reactive view of the MusicService (via useSyncExternalStore) plus settings-aware controls. */
export function useMusic() {
  const { music } = useAppServices();
  const { settings, updateSettings } = useProfile();

  const subscribe = useCallback((onChange: () => void) => music.subscribe(onChange), [music]);
  const playing = useSyncExternalStore(subscribe, () => music.isPlaying());
  const track = useSyncExternalStore(subscribe, () => music.currentTrack());

  const toggle = useCallback(() => {
    if (music.isPlaying()) music.pause();
    else if (settings.musicEnabled) music.play();
  }, [music, settings.musicEnabled]);

  const next = useCallback(() => music.next(), [music]);

  const setVolume = useCallback(
    (volume: number) => {
      music.setVolume(volume);
      void updateSettings({ musicVolume: volume });
    },
    [music, updateSettings],
  );

  return {
    playing,
    track,
    volume: settings.musicVolume,
    enabled: settings.musicEnabled,
    toggle,
    next,
    setVolume,
  };
}

/**
 * Mounted once at the root: applies the parent's music settings to the service
 * (pause when disabled, keep volume in sync). No UI.
 */
export function useMusicController() {
  const { music } = useAppServices();
  const { settings } = useProfile();

  useEffect(() => {
    music.setVolume(settings.musicVolume);
  }, [music, settings.musicVolume]);

  useEffect(() => {
    if (!settings.musicEnabled && music.isPlaying()) music.pause();
  }, [music, settings.musicEnabled]);
}
