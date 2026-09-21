import { createAudioPlayer, type AudioPlayer } from 'expo-audio';

import type { NoteService } from '../interfaces';
import type { Logger } from '../logging/logger';
import { hasUserInteracted } from './userGesture';

/**
 * Music Maker notes: one lazily created player per note, restarted on each tap so
 * quick repeated taps always sound. Unknown keys are ignored (content typo ≠ crash).
 */
export class ExpoNotePlayer implements NoteService {
  private readonly players = new Map<string, AudioPlayer>();

  constructor(
    private readonly sources: Record<string, number>,
    private readonly logger: Logger,
    private readonly volume = 0.8,
  ) {}

  play(key: string): void {
    if (!hasUserInteracted()) return;
    const source = this.sources[key];
    if (source === undefined) return;
    try {
      let player = this.players.get(key);
      if (!player) {
        player = createAudioPlayer(source);
        player.volume = this.volume;
        this.players.set(key, player);
      }
      player.seekTo(0);
      player.play();
    } catch (error) {
      this.logger.warn('note failed', { key, error: String(error) });
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
