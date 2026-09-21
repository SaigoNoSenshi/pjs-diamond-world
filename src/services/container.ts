import { gardenItems } from '@/content/garden/items';
import { musicTracks } from '@/content/music/tracks';
import type { Repositories } from '@/repositories/interfaces';
import { createMemoryRepositories } from '@/repositories/memory';

import {
  InProcessEventBus,
  LocalAnalyticsService,
  LocalCreativeAssistant,
  NoCameraService,
  NoopSyncService,
  SilentAudioPromptService,
  SilentMusicService,
  SilentNoteService,
  SilentSoundEffectService,
} from './defaults';
import type {
  AnalyticsService,
  AudioPromptService,
  CameraService,
  CreativeAssistantService,
  EventBus,
  MusicService,
  NoteService,
  SoundEffectService,
  SyncService,
} from './interfaces';
import { createLogger, type Logger } from './logging/logger';
import { ProgressionService } from './progression/ProgressionService';

/**
 * The service container is the single place where implementations are chosen.
 * Features receive it through `AppServicesProvider` and depend only on interfaces.
 */
export interface AppServices {
  logger: Logger;
  repositories: Repositories;
  eventBus: EventBus;
  voice: AudioPromptService;
  music: MusicService;
  sfx: SoundEffectService;
  notes: NoteService;
  camera: CameraService;
  sync: SyncService;
  analytics: AnalyticsService;
  assistant: CreativeAssistantService;
  progression: ProgressionService;
  /** Produces small JPEG thumbnails from local images; null on web/failure. */
  makeThumbnail: (uri: string) => Promise<string | null>;
}

/** In-memory, silent container for tests and the web fallback. */
export function createTestServices(overrides: Partial<AppServices> = {}): AppServices {
  const logger = overrides.logger ?? createLogger();
  const repositories = overrides.repositories ?? createMemoryRepositories();
  const eventBus = overrides.eventBus ?? new InProcessEventBus(logger);
  const sync = overrides.sync ?? new NoopSyncService();
  const progression =
    overrides.progression ??
    new ProgressionService(eventBus, repositories.garden, gardenItems, logger, undefined, sync);
  progression.start();
  return {
    logger,
    repositories,
    eventBus,
    progression,
    voice: overrides.voice ?? new SilentAudioPromptService(),
    music: overrides.music ?? new SilentMusicService(musicTracks),
    sfx: overrides.sfx ?? new SilentSoundEffectService(),
    notes: overrides.notes ?? new SilentNoteService(),
    camera: overrides.camera ?? new NoCameraService(),
    sync,
    analytics: overrides.analytics ?? new LocalAnalyticsService(logger),
    makeThumbnail: overrides.makeThumbnail ?? (async () => null),
    assistant: overrides.assistant ?? new LocalCreativeAssistant(),
  };
}
