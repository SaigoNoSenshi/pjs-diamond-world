/**
 * Minimal Result type so persistence and sync failures are values, not thrown
 * surprises. The UI maps `err` to a friendly message; the logger gets the detail.
 */
export type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E };

export const ok = <T>(value: T): Result<T, never> => ({ ok: true, value });
export const err = <E>(error: E): Result<never, E> => ({ ok: false, error });

export function toError(cause: unknown): Error {
  if (cause instanceof Error) return cause;
  return new Error(typeof cause === 'string' ? cause : JSON.stringify(cause));
}

export async function attempt<T>(fn: () => Promise<T>): Promise<Result<T>> {
  try {
    return ok(await fn());
  } catch (cause) {
    return err(toError(cause));
  }
}
