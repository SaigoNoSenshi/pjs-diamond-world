import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';

import { activities, findActivity } from '@/content/activities';
import { stickerIds } from '@/content/stickers';
import type { ActivityDefinition } from '@/domain/activity/schema';
import { ensureQuest } from '@/domain/learning/dailyQuest';
import { recordCompletion, type Earned } from '@/domain/learning/rewards';
import {
  createInitialLearningProgress,
  dateKeyFor,
  type LearningProgress,
} from '@/domain/learning/schema';
import { createProgressionEvent } from '@/domain/progression/events';
import { useAppServices } from '@/hooks/useAppServices';
import { useProfile } from '@/hooks/useProfile';
import { createId } from '@/utils/ids';
import { nowIso } from '@/utils/time';

export interface LearningContextValue {
  progress: LearningProgress;
  ready: boolean;
  /** Record a finished activity: diamonds, sticker, quest, garden event. Never throws. */
  complete(activity: ActivityDefinition, score?: number): Promise<Earned>;
  /** Remember which DRAW/CRAFT activity the child opened so its save completes it. */
  setPendingActivity(activityId: string | null): void;
  isCompleted(activityId: string): boolean;
}

export const LearningContext = createContext<LearningContextValue | null>(null);

const NO_EARNED: Earned = {
  diamonds: 0,
  stickerId: null,
  questJustCompleted: false,
  chestStickerId: null,
};

/**
 * Owns diamonds, stickers, completions and the Daily Quest for the current child.
 * Also completes DRAW / CRAFT activities when the drawing or craft is actually saved
 * (those engines live outside the activity player), by listening to the event bus.
 */
export function LearningProvider({ children }: PropsWithChildren) {
  const { repositories, logger, eventBus } = useAppServices();
  const { profile } = useProfile();
  const childId = profile.id;
  const [progress, setProgress] = useState<LearningProgress>(() =>
    createInitialLearningProgress(childId, nowIso()),
  );
  const [ready, setReady] = useState(false);
  const progressRef = useRef(progress);
  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);
  const pending = useRef<string | null>(null);
  // Serialise completions so two quick saves cannot lose diamonds.
  const queue = useRef<Promise<unknown>>(Promise.resolve());

  useEffect(() => {
    let mounted = true;
    repositories.learning
      .get(childId)
      .then((loaded) => {
        if (!mounted) return;
        const base = loaded ?? createInitialLearningProgress(childId, nowIso());
        setProgress(ensureQuest(base, activities, dateKeyFor(new Date())));
      })
      .catch((error: unknown) => logger.error('learning progress load failed', error))
      .finally(() => {
        if (mounted) setReady(true);
      });
    return () => {
      mounted = false;
    };
  }, [repositories.learning, childId, logger]);

  const complete = useCallback(
    (activity: ActivityDefinition, score?: number): Promise<Earned> => {
      const run = async (): Promise<Earned> => {
        try {
          const now = nowIso();
          const { progress: next, earned } = recordCompletion(progressRef.current, {
            activity,
            now,
            dateKey: dateKeyFor(new Date()),
            ...(score !== undefined ? { score } : {}),
            activities,
            stickerCatalogue: stickerIds,
          });
          progressRef.current = next;
          setProgress(next);
          await repositories.learning.save(next);
          await eventBus.publish(
            createProgressionEvent(
              'ACTIVITY_COMPLETED',
              childId,
              { activityId: activity.id, points: earned.diamonds },
              { id: createId('evt'), occurredAt: now },
            ),
          );
          return earned;
        } catch (error) {
          logger.error('activity completion failed', error, { activity: activity.id });
          return NO_EARNED;
        }
      };
      const result = queue.current.then(run, run);
      queue.current = result;
      return result;
    },
    [repositories.learning, eventBus, childId, logger],
  );

  // Drawings and crafts complete their activities when they are really saved.
  useEffect(() => {
    return eventBus.subscribe((event) => {
      if (event.childId !== childId) return;
      if (event.type === 'DRAWING_COMPLETED') {
        const id = pending.current;
        pending.current = null;
        const activity = (id && findActivity(id)) || findActivity('act_draw_free');
        if (activity?.kind === 'DRAW') void complete(activity);
      } else if (event.type === 'CRAFT_COMPLETED' && event.payload.craftId) {
        const craftId = event.payload.craftId;
        const activity = activities.find(
          (a) => a.data.kind === 'CRAFT' && a.data.craftId === craftId,
        );
        if (activity) void complete(activity);
      }
    });
  }, [eventBus, childId, complete]);

  const setPendingActivity = useCallback((activityId: string | null) => {
    pending.current = activityId;
  }, []);

  const isCompleted = useCallback(
    (activityId: string) => activityId in progress.completions,
    [progress.completions],
  );

  const value = useMemo<LearningContextValue>(
    () => ({ progress, ready, complete, setPendingActivity, isCompleted }),
    [progress, ready, complete, setPendingActivity, isCompleted],
  );

  return <LearningContext.Provider value={value}>{children}</LearningContext.Provider>;
}

export function useLearning(): LearningContextValue {
  const value = useContext(LearningContext);
  if (!value) throw new Error('useLearning must be used inside LearningProvider');
  return value;
}
