import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';

import type { MusicService, MusicTrack } from '../interfaces';
import type { Logger } from '../logging/logger';
import { hasUserInteracted } from './userGesture';

const DEFAULT_VOLUME = 0.6;
const MAX_VOLUME = 0.85;

/**
 * Looping background music via expo-audio. Volume is clamped so nothing is ever
 * unexpectedly loud; device volume still applies on top. Never throws to the UI.
 */
export class ExpoMusicService implements MusicService {
  readonly tracks: readonly MusicTrack[];
  private player: AudioPlayer | null = null;
  private index = 0;
  private playing = false;
  private volume = DEFAULT_VOLUME;
  private readonly listeners = new Set<() => void>();

  constructor(
    tracks: readonly MusicTrack[],
    private readonly logger: Logger,
  ) {
    this.tracks = tracks;
    setAudioModeAsync({ playsInSilentMode: false, interruptionMode: 'mixWithOthers' }).catch(
      (error: unknown) => logger.warn('audio mode failed', { error: String(error) }),
    );
  }

  private emit(): void {
    for (const l of this.listeners) l();
  }

  private ensurePlayer(): AudioPlayer | null {
    const track = this.tracks[this.index];
    if (!track) return null;
    if (!this.player) {
      try {
        this.player = createAudioPlayer(track.source);
        this.player.loop = true;
        this.player.volume = this.volume;
      } catch (error) {
        this.logger.error('music player failed', error);
        this.player = null;
      }
    }
    return this.player;
  }

  private disposePlayer(): void {
    try {
      this.player?.remove();
    } catch (error) {
      this.logger.warn('music player dispose failed', { error: String(error) });
    }
    this.player = null;
  }

  play(): void {
    if (!hasUserInteracted()) return; // browser autoplay policy
    const player = this.ensurePlayer();
    if (!player) return;
    try {
      player.play();
      this.playing = true;
    } catch (error) {
      this.logger.error('music play failed', error);
    }
    this.emit();
  }

  pause(): void {
    try {
      this.player?.pause();
    } catch (error) {
      this.logger.warn('music pause failed', { error: String(error) });
    }
    this.playing = false;
    this.emit();
  }

  next(): void {
    if (this.tracks.length === 0) return;
    const wasPlaying = this.playing;
    this.disposePlayer();
    this.index = (this.index + 1) % this.tracks.length;
    if (wasPlaying) this.play();
    else this.emit();
  }

  setVolume(volume: number): void {
    this.volume = Math.min(MAX_VOLUME, Math.max(0, volume));
    if (this.player) this.player.volume = this.volume;
    this.emit();
  }

  getVolume(): number {
    return this.volume;
  }

  isPlaying(): boolean {
    return this.playing;
  }

  currentTrack(): MusicTrack | null {
    return this.tracks[this.index] ?? null;
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  release(): void {
    this.disposePlayer();
    this.listeners.clear();
    this.playing = false;
  }
}
