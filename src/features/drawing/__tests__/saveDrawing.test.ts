import type { ProgressionEvent } from '@/domain/progression/schema';
import { createMemoryRepositories } from '@/repositories/memory';
import { InProcessEventBus } from '@/services/defaults';
import { createLogger } from '@/services/logging/logger';

import { saveDrawing } from '../saveDrawing';

describe('saveDrawing', () => {
  it('stores the asset, creates a titled creation, publishes events and clears the draft', async () => {
    const repositories = createMemoryRepositories();
    const logger = createLogger();
    const eventBus = new InProcessEventBus(logger);
    const received: ProgressionEvent[] = [];
    eventBus.subscribe((e) => {
      received.push(e);
    });
    await repositories.drafts.save({
      id: 'drf_1',
      childId: 'chd_default',
      elements: [],
      backgroundColor: '#FFFFFF',
      updatedAt: '2026-09-14T00:00:00.000Z',
    });

    const result = await saveDrawing(
      {
        repositories,
        eventBus,
        logger,
        colorLabel: (hex) => (hex === '#FFD93D' ? 'Yellow' : null),
        stampNoun: (id) => (id === 'star' ? 'Star' : null),
      },
      {
        childId: 'chd_default',
        nickname: 'PJ',
        elements: [
          {
            type: 'stroke',
            stroke: {
              id: 'a',
              kind: 'brush',
              color: '#FFD93D',
              width: 10,
              points: [
                { x: 0, y: 0 },
                { x: 50, y: 0 },
              ],
            },
          },
          {
            type: 'stamp',
            stamp: { id: 's', stampId: 'star', x: 1, y: 1, size: 10, color: '#FFD93D' },
          },
        ],
        capture: { kind: 'base64', base64: 'aGVsbG8=' },
        width: 800,
        height: 600,
      },
    );

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.title).toBe("PJ's Yellow Star");
    expect(result.value.type).toBe('DRAWING');
    expect(await repositories.assets.exists(result.value.assetUri)).toBe(true);
    expect(await repositories.creations.count('chd_default')).toBe(1);
    expect(received.map((e) => e.type)).toEqual(['DRAWING_COMPLETED', 'CREATION_SAVED']);
    expect(received[1]?.payload.creationId).toBe(result.value.id);
    expect(await repositories.drafts.getCurrent('chd_default')).toBeNull();
  });

  it('returns an error result and keeps the draft when asset storage fails', async () => {
    const repositories = createMemoryRepositories();
    repositories.assets.saveBase64 = async () => {
      throw new Error('disk full');
    };
    const logger = createLogger();
    await repositories.drafts.save({
      id: 'drf_1',
      childId: 'chd_default',
      elements: [],
      backgroundColor: '#FFFFFF',
      updatedAt: '2026-09-14T00:00:00.000Z',
    });

    const result = await saveDrawing(
      {
        repositories,
        eventBus: new InProcessEventBus(logger),
        logger,
        colorLabel: () => null,
        stampNoun: () => null,
      },
      {
        childId: 'chd_default',
        nickname: 'PJ',
        elements: [],
        capture: { kind: 'base64', base64: 'x' },
        width: 1,
        height: 1,
      },
    );
    expect(result.ok).toBe(false);
    expect(await repositories.creations.count('chd_default')).toBe(0);
    expect(await repositories.drafts.getCurrent('chd_default')).not.toBeNull();
  });
});
