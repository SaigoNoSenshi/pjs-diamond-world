import type { GardenItem, GardenState, ProgressionEvent, UnlockRequirement } from './schema';

/**
 * Progression engine — pure functions. Events update counters and points; unlock
 * rules (data on GardenItem) are evaluated afterwards. Progress is additive and can
 * never be lost: nothing here ever removes an unlock or lowers a counter.
 */

const POINTS: Record<ProgressionEvent['type'], number> = {
  CREATION_SAVED: 1,
  DRAWING_COMPLETED: 1,
  CRAFT_COMPLETED: 3,
  PHOTO_SAVED: 1,
  ACTIVITY_COMPLETED: 0,
  GARDEN_ITEM_UNLOCKED: 0,
};

/** Level is a gentle, monotonic function of points. */
export function levelForPoints(points: number): number {
  return 1 + Math.floor(points / 10);
}

export function applyCounters(state: GardenState, event: ProgressionEvent): GardenState {
  const counters = { ...state.counters };
  let completedCrafts = state.completedCrafts;
  switch (event.type) {
    case 'CREATION_SAVED':
      counters.creations += 1;
      break;
    case 'DRAWING_COMPLETED':
      counters.drawings += 1;
      break;
    case 'CRAFT_COMPLETED':
      counters.crafts += 1;
      if (event.payload.craftId && !completedCrafts.includes(event.payload.craftId)) {
        completedCrafts = [...completedCrafts, event.payload.craftId];
      }
      break;
    case 'PHOTO_SAVED':
      counters.photos += 1;
      break;
    case 'ACTIVITY_COMPLETED':
      counters.activities += 1;
      break;
    case 'GARDEN_ITEM_UNLOCKED':
      break;
  }
  const bonus =
    event.type === 'CRAFT_COMPLETED' || event.type === 'ACTIVITY_COMPLETED'
      ? (event.payload.points ?? POINTS[event.type])
      : POINTS[event.type];
  const creativityPoints = state.creativityPoints + Math.max(0, bonus);
  return {
    ...state,
    counters,
    completedCrafts,
    creativityPoints,
    level: Math.max(state.level, levelForPoints(creativityPoints)),
    updatedAt: event.occurredAt,
  };
}

export function evaluateRequirement(
  req: UnlockRequirement,
  state: GardenState,
  event: ProgressionEvent,
): boolean {
  switch (req.kind) {
    case 'CREATIONS_AT_LEAST':
      return state.counters.creations >= req.count;
    case 'DRAWINGS_AT_LEAST':
      return state.counters.drawings >= req.count;
    case 'CRAFTS_AT_LEAST':
      return state.counters.crafts >= req.count;
    case 'ACTIVITIES_AT_LEAST':
      return state.counters.activities >= req.count;
    case 'POINTS_AT_LEAST':
      return state.creativityPoints >= req.points;
    case 'EVENT':
      return event.type === req.eventType;
    case 'CRAFT_COMPLETED':
      return state.completedCrafts.includes(req.craftId);
  }
}

export interface ApplyResult {
  state: GardenState;
  unlocked: GardenItem[];
}

/** Apply one event and evaluate every still-locked item. */
export function applyEvent(
  state: GardenState,
  event: ProgressionEvent,
  items: readonly GardenItem[],
): ApplyResult {
  const next = applyCounters(state, event);
  const unlocked = items.filter(
    (item) =>
      !next.unlockedItems.includes(item.id) &&
      evaluateRequirement(item.unlockRequirement, next, event),
  );
  if (unlocked.length === 0) return { state: next, unlocked };
  return {
    state: { ...next, unlockedItems: [...next.unlockedItems, ...unlocked.map((i) => i.id)] },
    unlocked,
  };
}

/** Rebuild state from an event log (used for repair/migration; never for normal play). */
export function replayEvents(
  initial: GardenState,
  events: readonly ProgressionEvent[],
  items: readonly GardenItem[],
): GardenState {
  return events.reduce((state, event) => applyEvent(state, event, items).state, initial);
}
