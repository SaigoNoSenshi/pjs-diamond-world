/**
 * Creations without a photo point at a bundled illustration through this scheme,
 * e.g. `asset://craft.clayCup.7`. Pure helpers; the image registry resolves keys.
 */
export const BUNDLED_ASSET_SCHEME = 'asset://';

export function bundledAssetUri(imageKey: string): string {
  return `${BUNDLED_ASSET_SCHEME}${imageKey}`;
}

export function isBundledAssetUri(uri: string): boolean {
  return uri.startsWith(BUNDLED_ASSET_SCHEME);
}

export function bundledAssetKey(uri: string): string {
  return uri.slice(BUNDLED_ASSET_SCHEME.length);
}
