import { applyEvent } from '@/domain/progression/engine';
import { createProgressionEvent } from '@/domain/progression/events';
import {
  createInitialGardenState,
  type GardenItem,
  type GardenState,
  type ProgressionEvent,
} from '@/domain/progression/schema';
import type { GardenRepository } from '@/repositories/interfaces';
import { createId } from '@/utils/ids';
import { systemClock, type Clock } from '@/utils/time';

import type { EventBus, SyncService } from '../interfaces';
import type { Logger } from '../logging/logger';

export type UnlockListener = (unlocked: GardenItem[], state: GardenState) => void;

/**
 * Subscribes to the event bus, applies the progression engine, persists state and
 * the event log, and announces unlocks. Screens never compute progression.
 * Events are processed strictly in order (a queue) so two quick saves cannot race.
 */
export class ProgressionService {
  private readonly listeners = new Set<UnlockListener>();
  private queue: Promise<void> = Promise.resolve();
  private unsubscribe: (() => void) | null = null;

  constructor(
    private readonly eventBus: EventBus,
    private readonly garden: GardenRepository,
    private readonly items: readonly GardenItem[],
    private readonly logger: Logger,
    private readonly clock: Clock = systemClock,
    private readonly sync?: SyncService,
  ) {}

  start(): void {
    if (this.unsubscribe) return;
    // Fire-and-forget into the queue: the bus awaits subscribers, and handle() itself
    // publishes GARDEN_ITEM_UNLOCKED, so returning the queue promise here would deadlock.
    this.unsubscribe = this.eventBus.subscribe((event) => {
      void this.enqueue(event);
    });
  }

  stop(): void {
    this.unsubscribe?.();
    this.unsubscribe = null;
  }

  onUnlock(listener: UnlockListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  async getState(childId: string): Promise<GardenState> {
    return (await this.garden.get(childId)) ?? createInitialGardenState(childId, this.clock());
  }

  /** Returns a promise that resolves once every queued event has been applied. */
  async whenIdle(): Promise<void> {
    // Handlers can enqueue follow-up events (unlock announcements), so wait until the
    // queue stops growing rather than for the snapshot taken on entry.
    let snapshot: Promise<void>;
    do {
      snapshot = this.queue;
      await snapshot;
    } while (snapshot !== this.queue);
  }

  private enqueue(event: ProgressionEvent): Promise<void> {
    // GARDEN_ITEM_UNLOCKED is our own announcement; recording it is enough.
    this.queue = this.queue
      .then(() => this.handle(event))
      .catch((error: unknown) => {
        this.logger.error('progression failed', error, { type: event.type });
      });
    return this.queue;
  }

  private async handle(event: ProgressionEvent): Promise<void> {
    await this.garden.appendEvent(event);
    if (event.type === 'GARDEN_ITEM_UNLOCKED') return;

    const current = await this.getState(event.childId);
    const { state, unlocked } = applyEvent(current, event, this.items);
    await this.garden.save(state);
    this.sync?.enqueue({ kind: 'garden', id: state.childId, op: 'upsert' });
    void this.sync?.flush();

    if (unlocked.length > 0) {
      for (const listener of this.listeners) listener(unlocked, state);
      for (const item of unlocked) {
        await this.eventBus.publish(
          createProgressionEvent(
            'GARDEN_ITEM_UNLOCKED',
            event.childId,
            { gardenItemId: item.id },
            { id: createId('evt'), occurredAt: this.clock() },
          ),
        );
      }
    }
  }
}
