/**
 * Prefixed, collision-resistant identifiers. Uses the platform UUID generator when
 * available and falls back to time + randomness (sufficient for a single-device app).
 */
export type IdPrefix = 'cre' | 'crf' | 'chd' | 'evt' | 'drf' | 'gdn';

function randomUuid(): string {
  const cryptoApi = (globalThis as { crypto?: { randomUUID?: () => string } }).crypto;
  if (cryptoApi?.randomUUID) {
    return cryptoApi.randomUUID();
  }
  const time = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 12) + Math.random().toString(36).slice(2, 12);
  return `${time}-${rand}`;
}

export function createId(prefix: IdPrefix): string {
  return `${prefix}_${randomUuid()}`;
}
