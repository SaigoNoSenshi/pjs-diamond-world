import type { CraftTemplate } from '@/domain/craft/schema';
import type { ProgressionEvent } from '@/domain/progression/schema';

import type {
  AnalyticsEventName,
  AnalyticsService,
  AudioPromptService,
  CameraService,
  CapturedPhoto,
  CreativeAssistantService,
  EventBus,
  MusicService,
  NoteService,
  MusicTrack,
  SoundEffectKey,
  SoundEffectService,
  SyncChange,
  SyncService,
} from './interfaces';
import type { Logger } from './logging/logger';

/** Safe, silent implementations used in tests and as fallbacks. */

export class SilentAudioPromptService implements AudioPromptService {
  readonly spoken: string[] = [];
  speak(text: string): void {
    this.spoken.push(text);
  }
  stop(): void {}
}

export class SilentMusicService implements MusicService {
  readonly tracks: readonly MusicTrack[];
  private playing = false;
  private index = 0;
  private volume = 0.6;
  private readonly listeners = new Set<() => void>();

  constructor(tracks: readonly MusicTrack[] = []) {
    this.tracks = tracks;
  }
  private emit(): void {
    for (const l of this.listeners) l();
  }
  play(): void {
    this.playing = this.tracks.length > 0;
    this.emit();
  }
  pause(): void {
    this.playing = false;
    this.emit();
  }
  next(): void {
    if (this.tracks.length === 0) return;
    this.index = (this.index + 1) % this.tracks.length;
    this.emit();
  }
  setVolume(volume: number): void {
    this.volume = Math.min(1, Math.max(0, volume));
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
    this.listeners.clear();
  }
}

export class SilentSoundEffectService implements SoundEffectService {
  readonly played: SoundEffectKey[] = [];
  play(key: SoundEffectKey): void {
    this.played.push(key);
  }
}

export class SilentNoteService implements NoteService {
  readonly played: string[] = [];
  play(key: string): void {
    this.played.push(key);
  }
  release(): void {
    this.played.length = 0;
  }
}

export class NoCameraService implements CameraService {
  constructor(private readonly picker: () => Promise<CapturedPhoto | null> = async () => null) {}
  hasLiveCamera(): boolean {
    return false;
  }
  pickFromLibrary(): Promise<CapturedPhoto | null> {
    return this.picker();
  }
}

export class NoopSyncService implements SyncService {
  readonly queue: SyncChange[] = [];
  isConfigured(): boolean {
    return false;
  }
  isEnabled(): boolean {
    return false;
  }
  enqueue(change: SyncChange): void {
    this.queue.push(change);
  }
  async flush(): Promise<void> {}
}

export class LocalAnalyticsService implements AnalyticsService {
  constructor(private readonly logger: Logger) {}
  track(name: AnalyticsEventName, props?: Record<string, string | number | boolean>): void {
    this.logger.debug(`analytics:${name}`, props);
  }
}

const DRAWING_PROMPTS = [
  'Draw a yellow jellyfish!',
  'Draw a diamond island!',
  'Draw a happy flower!',
  'Draw a star in the sea!',
  'Draw a princess crown!',
];

export class LocalCreativeAssistant implements CreativeAssistantService {
  async suggestDrawingPrompt(): Promise<string> {
    return (
      DRAWING_PROMPTS[Math.floor(Math.random() * DRAWING_PROMPTS.length)] ?? DRAWING_PROMPTS[0]!
    );
  }
  async recommendCraft(available: readonly CraftTemplate[]): Promise<CraftTemplate | null> {
    return available.find((c) => c.difficulty === 'EASY') ?? available[0] ?? null;
  }
}

export class InProcessEventBus implements EventBus {
  private readonly handlers = new Set<(event: ProgressionEvent) => Promise<void> | void>();

  constructor(private readonly logger: Logger) {}

  async publish(event: ProgressionEvent): Promise<void> {
    for (const handler of this.handlers) {
      try {
        await handler(event);
      } catch (error) {
        this.logger.error('event handler failed', error, { type: event.type });
      }
    }
  }

  subscribe(handler: (event: ProgressionEvent) => Promise<void> | void): () => void {
    this.handlers.add(handler);
    return () => this.handlers.delete(handler);
  }
}
