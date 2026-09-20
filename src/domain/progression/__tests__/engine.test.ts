import { gardenItems } from '@/content/garden/items';

import { applyEvent, levelForPoints, replayEvents } from '../engine';
import { createInitialGardenState, type ProgressionEvent } from '../schema';

const NOW = '2026-09-14T00:00:00.000Z';
const ev = (
  type: ProgressionEvent['type'],
  payload: ProgressionEvent['payload'] = {},
): ProgressionEvent => ({
  id: `evt_${type}_${Math.random()}`,
  type,
  childId: 'chd_default',
  occurredAt: NOW,
  payload,
});

describe('progression engine', () => {
  it('first saved creation grows a sprout; nothing is ever taken away', () => {
    const initial = createInitialGardenState('chd_default', NOW);
    const r1 = applyEvent(initial, ev('DRAWING_COMPLETED'), gardenItems);
    expect(r1.unlocked).toEqual([]);
    const r2 = applyEvent(r1.state, ev('CREATION_SAVED', { creationId: 'cre_1' }), gardenItems);
    expect(r2.unlocked.map((i) => i.id)).toEqual(['sprout']);
    expect(r2.state.counters).toEqual({
      creations: 1,
      drawings: 1,
      crafts: 0,
      photos: 0,
      activities: 0,
    });
    expect(r2.state.creativityPoints).toBe(2);
    // Re-applying an event never re-unlocks or removes anything.
    const r3 = applyEvent(r2.state, ev('CREATION_SAVED'), gardenItems);
    expect(r3.unlocked.map((i) => i.id)).toEqual([]);
    expect(r3.state.unlockedItems).toEqual(['sprout']);
  });

  it('completing the clay cup blooms the flower and awards its reward points', () => {
    const initial = createInitialGardenState('chd_default', NOW);
    const r = applyEvent(
      initial,
      ev('CRAFT_COMPLETED', { craftId: 'crf_clay_cup', points: 5 }),
      gardenItems,
    );
    expect(r.unlocked.map((i) => i.id)).toEqual(['flower']);
    expect(r.state.creativityPoints).toBe(5);
    expect(r.state.completedCrafts).toEqual(['crf_clay_cup']);
  });

  it('three creations grow a tree, five a diamond, and levels rise gently', () => {
    let state = createInitialGardenState('chd_default', NOW);
    const seen: string[] = [];
    for (let i = 0; i < 5; i += 1) {
      const r = applyEvent(state, ev('CREATION_SAVED'), gardenItems);
      state = r.state;
      seen.push(...r.unlocked.map((u) => u.id));
    }
    expect(seen).toEqual(['sprout', 'tree', 'diamond']);
    expect(state.level).toBe(1);
    expect(levelForPoints(10)).toBe(2);
    expect(levelForPoints(25)).toBe(3);
  });

  it('replays an event log to the same state', () => {
    const initial = createInitialGardenState('chd_default', NOW);
    const events = [
      ev('CREATION_SAVED'),
      ev('CRAFT_COMPLETED', { craftId: 'crf_clay_cup', points: 5 }),
      ev('CREATION_SAVED'),
    ];
    const replayed = replayEvents(initial, events, gardenItems);
    expect(replayed.unlockedItems).toEqual(['sprout', 'flower']);
    expect(replayed.creativityPoints).toBe(7);
  });
});
