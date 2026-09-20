import * as Haptics from 'expo-haptics';
import { useCallback } from 'react';
import { Platform } from 'react-native';

import type { SoundEffectKey } from '@/services/interfaces';

import { useAppServices } from './useAppServices';
import { useProfile } from './useProfile';

/** Sound effect + light haptic feedback, gated by parent settings. Never throws. */
export function useSfx() {
  const { sfx } = useAppServices();
  const { settings } = useProfile();

  const play = useCallback(
    (key: SoundEffectKey) => {
      if (settings.soundEffectsEnabled) sfx.play(key);
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => undefined);
      }
    },
    [sfx, settings.soundEffectsEnabled],
  );

  return { play };
}
