import { resolveImage } from '@/constants/images';
import { bundledAssetKey, isBundledAssetUri } from '@/domain/creation/assetUri';

/** Turns a stored creation URI into an expo-image source (bundled key or file/http URI). */
export function imageSourceFromUri(uri: string): number | { uri: string } {
  if (isBundledAssetUri(uri)) {
    return resolveImage(bundledAssetKey(uri)) ?? { uri: '' };
  }
  return { uri };
}
