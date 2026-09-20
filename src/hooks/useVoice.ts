import { useCallback } from 'react';

import { useAppServices } from './useAppServices';
import { useProfile } from './useProfile';

/** Speak short prompts when voice guidance is enabled. Silent otherwise. */
export function useVoice() {
  const { voice } = useAppServices();
  const { settings } = useProfile();

  const speak = useCallback(
    (text: string) => {
      if (!settings.voiceEnabled) return;
      voice.speak(text);
    },
    [voice, settings.voiceEnabled],
  );

  const stop = useCallback(() => voice.stop(), [voice]);

  return { speak, stop, enabled: settings.voiceEnabled };
}
