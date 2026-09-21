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

import { findActivity, loadGradeContent } from '@/content/activities';
import { allActivities } from '@/content/activities/registry';
import { stickerIds } from '@/content/stickers';
import type { ActivityDefinition } from '@/domain/activity/schema';
import { ensureQuest } from '@/domain/learning/dailyQuest';
import { clampGrade, nextGrade } from '@/domain/learning/grades';
import { recordCompletion, type Earned } from '@/domain/learning/rewards';
import {
  createInitialLearningProgress,
  dateKeyFor,
  type LearningProgress,
} from '@/domain/learning/schema';
import { createProgressionEvent } from '@/domain/progression/events';
import { useActivities } from '@/hooks/useActivities';
import { useAppServices } from '@/hooks/useAppServices';
import { useProfile } from '@/hooks/useProfile';
import { createId } from '@/utils/ids';
import { nowIso } from '@/utils/time';

export interface CompletionOutcome extends Earned {
  /** Set when this completion unlocked the next grade (auto-advance). */
  newGrade: number | null;
}

export interface LearningContextValue {
  progress: LearningProgress;
  ready: boolean;
  /** The child's current grade (1–6). */
  grade: number;
  /** Record a finished activity: diamonds, sticker, quest, garden event, grade. Never throws. */
  complete(activity: ActivityDefinition, score?: number): Promise<CompletionOutcome>;
  /** Remember which DRAW/CRAFT activity the child opened so its save completes it. */
  setPendingActivity(activityId: string | null): void;
  isCompleted(activityId: string): boolean;
}

export const LearningContext = createContext<LearningContextValue | null>(null);

const NO_EARNED: CompletionOutcome = {
  diamonds: 0,
  stickerId: null,
  questJustCompleted: false,
  chestStickerId: null,
  newGrade: null,
};

/**
 * Owns diamonds, stickers, completions, the Daily Quest and grade progression for the
 * current child. Also completes DRAW / CRAFT activities when the drawing or craft is
 * actually saved (event bus), by listening to the event bus.
 */
export function LearningProvider({ children }: PropsWithChildren) {
  const { repositories, logger, eventBus } = useAppServices();
  const { profile, settings, updateSettings } = useProfile();
  const activities = useActivities();
  const childId = profile.id;
  const grade = clampGrade(settings.grade);
  const [progress, setProgress] = useState<LearningProgress>(() =>
    createInitialLearningProgress(childId, nowIso()),
  );
  const [ready, setReady] = useState(false);
  const progressRef = useRef(progress);
  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);
  const gradeRef = useRef(grade);
  useEffect(() => {
    gradeRef.current = grade;
  }, [grade]);
  const settingsRef = useRef(settings);
  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);
  const pending = useRef<string | null>(null);
  // Serialise completions so two quick saves cannot lose diamonds.
  const queue = useRef<Promise<unknown>>(Promise.resolve());

  useEffect(() => {
    let mounted = true;
    // Grade banks are a lazy chunk; wait for them so the daily quest and mastery see the
    // whole curriculum. If the chunk fails (offline before first visit) the core packs
    // still work and the load is retried on the next mount.
    const gradeContent = loadGradeContent().catch((error: unknown) =>
      logger.error('grade content load failed', error),
    );
    Promise.all([repositories.learning.get(childId), gradeContent])
      .then(([loaded]) => {
        if (!mounted) return;
        const base = loaded ?? createInitialLearningProgress(childId, nowIso());
        setProgress(ensureQuest(base, allActivities(), dateKeyFor(new Date()), gradeRef.current));
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
    (activity: ActivityDefinition, score?: number): Promise<CompletionOutcome> => {
      const run = async (): Promise<CompletionOutcome> => {
        try {
          const now = nowIso();
          const all = allActivities();
          const { progress: next, earned } = recordCompletion(progressRef.current, {
            activity,
            now,
            dateKey: dateKeyFor(new Date()),
            ...(score !== undefined ? { score } : {}),
            activities: all,
            stickerCatalogue: stickerIds,
            grade: gradeRef.current,
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
          // Grade progression (auto-advance): never down, at most one step per completion.
          let newGrade: number | null = null;
          const current = gradeRef.current;
          const target = nextGrade(next, all, current, settingsRef.current.autoAdvanceGrade);
          if (target > current) {
            newGrade = Math.min(target, current + 1);
            gradeRef.current = newGrade;
            await updateSettings({ grade: newGrade });
          }
          return { ...earned, newGrade };
        } catch (error) {
          logger.error('activity completion failed', error, { activity: activity.id });
          return NO_EARNED;
        }
      };
      const result = queue.current.then(run, run);
      queue.current = result;
      return result;
    },
    [repositories.learning, eventBus, childId, logger, updateSettings],
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
        const activity = allActivities().find(
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
    () => ({ progress, ready, grade, complete, setPendingActivity, isCompleted }),
    [progress, ready, grade, complete, setPendingActivity, isCompleted],
  );
  void activities; // subscription keeps consumers current when remote packs arrive

  return <LearningContext.Provider value={value}>{children}</LearningContext.Provider>;
}

export function useLearning(): LearningContextValue {
  const value = useContext(LearningContext);
  if (!value) throw new Error('useLearning must be used inside LearningProvider');
  return value;
}
