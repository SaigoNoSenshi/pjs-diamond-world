import * as Speech from 'expo-speech';

import type { AudioPromptService } from '../interfaces';
import type { Logger } from '../logging/logger';
import { hasUserInteracted } from './userGesture';

/**
 * Placeholder voice: on-device text-to-speech (offline, no cloud). A recorded-voice
 * implementation can replace this behind the same interface without touching features.
 * Prompts are short by design; a new prompt interrupts the previous one.
 */
export class ExpoSpeechPromptService implements AudioPromptService {
  constructor(private readonly logger: Logger) {}

  speak(text: string): void {
    if (!hasUserInteracted()) return;
    try {
      Speech.stop();
      Speech.speak(text, { language: 'en-US', rate: 0.95, pitch: 1.1, volume: 0.9 });
    } catch (error) {
      this.logger.warn('speech failed', { error: String(error) });
    }
  }

  stop(): void {
    try {
      Speech.stop();
    } catch {
      // ignore
    }
  }
}
