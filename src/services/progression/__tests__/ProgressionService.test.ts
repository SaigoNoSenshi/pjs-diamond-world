import { gardenItems } from '@/content/garden/items';
import { createProgressionEvent } from '@/domain/progression/events';
import type { GardenItem, ProgressionEvent } from '@/domain/progression/schema';
import { createMemoryRepositories } from '@/repositories/memory';
import { InProcessEventBus } from '@/services/defaults';
import { createLogger } from '@/services/logging/logger';

import { ProgressionService } from '../ProgressionService';

describe('ProgressionService', () => {
  it('applies bus events in order, persists state + log, and announces unlocks', async () => {
    const repositories = createMemoryRepositories();
    const logger = createLogger();
    const bus = new InProcessEventBus(logger);
    const service = new ProgressionService(
      bus,
      repositories.garden,
      gardenItems,
      logger,
      () => '2026-09-14T00:00:00.000Z',
    );
    service.start();

    const announced: GardenItem[][] = [];
    service.onUnlock((items) => announced.push(items));
    const seen: ProgressionEvent['type'][] = [];
    bus.subscribe((e) => {
      seen.push(e.type);
    });

    const stamp = (n: number) => ({ id: `evt_${n}`, occurredAt: '2026-09-14T00:00:00.000Z' });
    // Fire two saves back to back without awaiting between them: the queue must serialise.
    void bus.publish(
      createProgressionEvent('CREATION_SAVED', 'chd_default', { creationId: 'a' }, stamp(1)),
    );
    void bus.publish(
      createProgressionEvent(
        'CRAFT_COMPLETED',
        'chd_default',
        { craftId: 'crf_clay_cup', points: 5 },
        stamp(2),
      ),
    );
    await service.whenIdle();

    const state = await service.getState('chd_default');
    expect(state.unlockedItems).toEqual(['sprout', 'flower']);
    expect(state.creativityPoints).toBe(6);
    expect(announced.map((a) => a.map((i) => i.id))).toEqual([['sprout'], ['flower']]);
    // Triggers are published first; each unlock announcement follows its trigger.
    expect(seen.filter((t) => t !== 'GARDEN_ITEM_UNLOCKED')).toEqual([
      'CREATION_SAVED',
      'CRAFT_COMPLETED',
    ]);
    expect(seen.filter((t) => t === 'GARDEN_ITEM_UNLOCKED')).toHaveLength(2);
    expect(seen.indexOf('GARDEN_ITEM_UNLOCKED')).toBeGreaterThan(seen.indexOf('CREATION_SAVED'));

    const log = await repositories.garden.listEvents('chd_default');
    expect(log).toHaveLength(4);

    service.stop();
    await bus.publish(createProgressionEvent('CREATION_SAVED', 'chd_default', {}, stamp(3)));
    await service.whenIdle();
    expect((await service.getState('chd_default')).counters.creations).toBe(1);
  });

  it('returns an initial state when nothing is stored', async () => {
    const repositories = createMemoryRepositories();
    const logger = createLogger();
    const service = new ProgressionService(
      new InProcessEventBus(logger),
      repositories.garden,
      gardenItems,
      logger,
    );
    const state = await service.getState('chd_default');
    expect(state.level).toBe(1);
    expect(state.unlockedItems).toEqual([]);
  });
});
