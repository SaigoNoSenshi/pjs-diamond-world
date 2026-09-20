import { Platform } from 'react-native';

import { createDeviceRepositories } from '@/repositories';

import { musicTracks, soundEffects } from '@/content/music/tracks';

import { ExpoMusicService } from './audio/ExpoMusicService';
import { ExpoSoundEffectService } from './audio/ExpoSoundEffectService';
import { ExpoSpeechPromptService } from './audio/ExpoSpeechPromptService';
import { installUserGestureTracking } from './audio/userGesture';
import { ExpoCameraService } from './camera/ExpoCameraService';
import { createTestServices, type AppServices } from './container';
import { createLogger } from './logging/logger';
import { createThumbnailMaker } from './media/thumbnails';
import { createSyncService } from './sync';

/**
 * Runtime service factory — the one place implementations are chosen.
 * Phase 5: device repositories (SQLite + FileSystem + AsyncStorage; memory on web).
 * Phase 8: camera service (live camera on device, library picker on web).
 * Phase 10: expo-audio music + SFX and expo-speech voice.
 * Phase 12: optional Firebase sync (no-op unless configured + parent-enabled + signed in).
 */
let pending: Promise<AppServices> | null = null;

export function createAppServices(): Promise<AppServices> {
  if (!pending) {
    pending = (async () => {
      const logger = createLogger();
      installUserGestureTracking((message) => logger.debug('autoplay blocked', { message }));
      if (Platform.OS === 'web') {
        // Read-only diagnostics hook for browser testing (technical log only; no child data).
        (globalThis as { __pjsLogger?: unknown }).__pjsLogger = logger;
      }
      const repositories = await createDeviceRepositories(logger);
      let settings = (await repositories.settings.getProfile()).settings;
      // Keep the sync gate current without awaiting storage on every check.
      const refreshSettings = () => {
        void repositories.settings.getProfile().then((p) => {
          settings = p.settings;
        });
      };
      const sync = await createSyncService(
        repositories,
        () => {
          refreshSettings();
          return settings;
        },
        logger,
      );
      return createTestServices({
        sync,
        makeThumbnail: createThumbnailMaker(logger),
        logger,
        repositories,
        camera: new ExpoCameraService(logger),
        music: new ExpoMusicService(musicTracks, logger),
        sfx: new ExpoSoundEffectService(soundEffects, logger),
        voice: new ExpoSpeechPromptService(logger),
      });
    })();
  }
  return pending;
}

/** Test helper: drop the singleton so each test gets a fresh container. */
export function resetAppServices(): void {
  pending = null;
}
