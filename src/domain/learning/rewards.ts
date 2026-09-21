import type { ActivityDefinition } from '../activity/schema';
import { ensureQuest, questComplete, seededRandom } from './dailyQuest';
import type { LearningProgress } from './schema';

/**
 * Reward rules — pure functions.
 *  - Completing an activity always earns diamonds (full reward the first time, a
 *    smaller thank-you on repeats so there is no grinding pressure).
 *  - The activity's sticker is granted once, on first completion.
 *  - Completing all three quest activities opens the chest: bonus diamonds + a bonus
 *    sticker the child does not have yet.
 * Nothing is ever removed. No streaks, no leaderboards, no timers.
 */

export const REPEAT_DIAMONDS = 1;
export const CHEST_DIAMONDS = 10;

export interface Earned {
  diamonds: number;
  stickerId: string | null;
  questJustCompleted: boolean;
  /** Bonus sticker from the treasure chest (only when the quest just completed). */
  chestStickerId: string | null;
}

export interface CompletionInput {
  activity: ActivityDefinition;
  now: string;
  dateKey: string;
  /** 0..1 when the engine measures one. */
  score?: number;
  /** All activities (to build today's quest if needed). */
  activities: readonly ActivityDefinition[];
  /** Sticker catalogue ids, for the chest bonus. */
  stickerCatalogue: readonly string[];
  /** Current grade, for a grade-appropriate quest when one has to be created. */
  grade?: number;
}

export function recordCompletion(
  progress: LearningProgress,
  input: CompletionInput,
): { progress: LearningProgress; earned: Earned } {
  const withQuest = ensureQuest(progress, input.activities, input.dateKey, input.grade);
  const { activity } = input;
  const previous = withQuest.completions[activity.id];
  const first = !previous;

  const diamonds = first ? activity.reward.diamonds : REPEAT_DIAMONDS;
  const stickerId =
    first && activity.reward.stickerId && !withQuest.stickers.includes(activity.reward.stickerId)
      ? activity.reward.stickerId
      : null;

  const completions = {
    ...withQuest.completions,
    [activity.id]: {
      count: (previous?.count ?? 0) + 1,
      lastAt: input.now,
      ...(input.score !== undefined || previous?.best !== undefined
        ? { best: Math.max(previous?.best ?? 0, input.score ?? 0) }
        : {}),
    },
  };

  let quest = withQuest.quest;
  let questJustCompleted = false;
  let chestStickerId: string | null = null;
  let bonus = 0;
  if (
    quest &&
    quest.activityIds.includes(activity.id) &&
    !quest.completedIds.includes(activity.id)
  ) {
    quest = { ...quest, completedIds: [...quest.completedIds, activity.id] };
    if (questComplete(quest) && !quest.chestOpened) {
      questJustCompleted = true;
      quest = { ...quest, chestOpened: true };
      bonus = CHEST_DIAMONDS;
      const owned = new Set([...withQuest.stickers, ...(stickerId ? [stickerId] : [])]);
      const candidates = input.stickerCatalogue.filter((s) => !owned.has(s));
      if (candidates.length > 0) {
        const rand = seededRandom(`chest|${quest.dateKey}|${progress.childId}`);
        chestStickerId = candidates[Math.floor(rand() * candidates.length)] ?? null;
      }
    }
  }

  const stickers = [
    ...withQuest.stickers,
    ...(stickerId ? [stickerId] : []),
    ...(chestStickerId ? [chestStickerId] : []),
  ];

  return {
    progress: {
      ...withQuest,
      diamonds: withQuest.diamonds + diamonds + bonus,
      stickers,
      completions,
      quest,
      updatedAt: input.now,
    },
    earned: { diamonds: diamonds + bonus, stickerId, questJustCompleted, chestStickerId },
  };
}

export function isCompleted(progress: LearningProgress, activityId: string): boolean {
  return activityId in progress.completions;
}

export function completedCountForIsland(
  progress: LearningProgress,
  activities: readonly ActivityDefinition[],
  islandId: string,
): { done: number; total: number } {
  const own = activities.filter((a) => a.islandId === islandId);
  return { done: own.filter((a) => isCompleted(progress, a.id)).length, total: own.length };
}
