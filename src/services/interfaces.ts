import type { CraftTemplate } from '@/domain/craft/schema';
import type { ProgressionEvent } from '@/domain/progression/schema';

/**
 * Platform/service contracts. Screens depend on these interfaces through the
 * service container so implementations can change (TTS → recorded voice, no-op →
 * Firebase sync) without touching features.
 */

export interface AudioPromptService {
  /** Speak a short prompt. Returns immediately; never throws to the caller. */
  speak(text: string): void;
  stop(): void;
}

export interface MusicTrack {
  id: string;
  title: string;
  /** Bundled asset (require) or local file URI. */
  source: number | string;
  /** True for placeholder loops that must be replaced before release. */
  placeholder: boolean;
}

export interface MusicService {
  readonly tracks: readonly MusicTrack[];
  play(): void;
  pause(): void;
  next(): void;
  setVolume(volume: number): void;
  isPlaying(): boolean;
  currentTrack(): MusicTrack | null;
  /** Subscribe to state changes; returns an unsubscribe. */
  subscribe(listener: () => void): () => void;
  release(): void;
}

export type SoundEffectKey = 'tap' | 'sparkle' | 'grow' | 'save' | 'celebrate' | 'oops' | 'bubble';

export interface SoundEffectService {
  play(key: SoundEffectKey): void;
}

export interface CapturedPhoto {
  uri: string;
  width: number;
  height: number;
}

export interface CameraService {
  /** True when a live camera view is available on this platform. */
  hasLiveCamera(): boolean;
  /** Fallback path (web / no camera): pick from the device library. */
  pickFromLibrary(): Promise<CapturedPhoto | null>;
}

export interface SyncChange {
  kind: 'creation' | 'garden' | 'settings';
  id: string;
  op: 'upsert' | 'delete';
}

export interface SyncService {
  /** True when this build has cloud credentials at all. */
  isConfigured(): boolean;
  isEnabled(): boolean;
  enqueue(change: SyncChange): void;
  /** Flush pending changes when online. Never throws; never blocks UI. */
  flush(): Promise<void>;
}

export type AnalyticsEventName =
  'activity_started' | 'activity_completed' | 'creation_saved' | 'screen_opened';

export interface AnalyticsService {
  /** Local-only in the MVP. No identifiers, no personal text, no photos. */
  track(name: AnalyticsEventName, props?: Record<string, string | number | boolean>): void;
}

export interface CreativeAssistantService {
  suggestDrawingPrompt(): Promise<string>;
  recommendCraft(available: readonly CraftTemplate[]): Promise<CraftTemplate | null>;
}

export interface EventBus {
  publish(event: ProgressionEvent): Promise<void>;
  subscribe(handler: (event: ProgressionEvent) => Promise<void> | void): () => void;
}
