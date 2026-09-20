import { createAudioPlayer, type AudioPlayer } from 'expo-audio';

import type { SoundEffectKey, SoundEffectService } from '../interfaces';
import type { Logger } from '../logging/logger';
import { hasUserInteracted } from './userGesture';

/** Short cues, one lazily-created player per key, restarted from the top on each play. */
export class ExpoSoundEffectService implements SoundEffectService {
  private readonly players = new Map<SoundEffectKey, AudioPlayer>();

  constructor(
    private readonly sources: Record<SoundEffectKey, number>,
    private readonly logger: Logger,
    private readonly volume = 0.5,
  ) {}

  play(key: SoundEffectKey): void {
    if (!hasUserInteracted()) return; // browser autoplay policy
    try {
      let player = this.players.get(key);
      if (!player) {
        player = createAudioPlayer(this.sources[key]);
        player.volume = this.volume;
        this.players.set(key, player);
      }
      player.seekTo(0);
      player.play();
    } catch (error) {
      this.logger.warn('sfx failed', { key, error: String(error) });
    }
  }

  release(): void {
    for (const player of this.players.values()) {
      try {
        player.remove();
      } catch {
        // ignore
      }
    }
    this.players.clear();
  }
}
