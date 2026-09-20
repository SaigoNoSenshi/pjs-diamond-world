/** ISO-8601 timestamps everywhere. Injectable clock for deterministic tests. */
export type Clock = () => string;

export const systemClock: Clock = () => new Date().toISOString();

export function nowIso(): string {
  return systemClock();
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
