import type { ProgressionEvent, ProgressionEventType } from './schema';

/** Factory so every emitter builds events the same way. IDs/clock are injected. */
export function createProgressionEvent(
  type: ProgressionEventType,
  childId: string,
  payload: ProgressionEvent['payload'],
  deps: { id: string; occurredAt: string },
): ProgressionEvent {
  return { id: deps.id, type, childId, occurredAt: deps.occurredAt, payload };
}
