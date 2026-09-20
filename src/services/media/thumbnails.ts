import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import { Platform } from 'react-native';

import { layout } from '@/constants/layout';

import type { Logger } from '../logging/logger';

/** Produces a small JPEG for a local image URI, or null when it cannot (caller falls back to the full asset). */
export type ThumbnailMaker = (sourceUri: string) => Promise<string | null>;

/**
 * Scrapbook thumbnails keep My Diamond Book light: a 320-px JPEG instead of the
 * full drawing or photo. Failures are logged and ignored — the full image still works.
 */
export function createThumbnailMaker(logger: Logger): ThumbnailMaker {
  return async (sourceUri) => {
    if (Platform.OS === 'web') return null; // web preview uses the full image
    try {
      const context = ImageManipulator.manipulate(sourceUri);
      context.resize({ width: layout.thumbnailSize });
      const image = await context.renderAsync();
      const result = await image.saveAsync({ compress: 0.7, format: SaveFormat.JPEG });
      return result.uri;
    } catch (error) {
      logger.warn('thumbnail failed', { error: String(error) });
      return null;
    }
  };
}
