import type { ActivityDefinition } from '../activity/schema';
import type { DailyQuestState, LearningProgress } from './schema';

/**
 * Daily Quest: three short activities from three different islands, the same three
 * for the whole day on this device (seeded by date + child), always completable,
 * never a streak. Finishing all three opens the treasure chest.
 */

/** Small deterministic PRNG (mulberry32) seeded from a string. */
export function seededRandom(seed: string): () => number {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i += 1) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = h >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const QUEST_SIZE = 3;

export function pickDailyQuest(
  activities: readonly ActivityDefinition[],
  dateKey: string,
  childId: string,
  grade?: number,
): string[] {
  const rand = seededRandom(`${dateKey}|${childId}|g${grade ?? 0}`);
  const noCrafts = activities.filter((a) => a.kind !== 'CRAFT'); // crafts need materials; never required
  // Grade-appropriate pool, falling back to everything when a grade has too little content.
  const forGrade =
    grade === undefined ? noCrafts : noCrafts.filter((a) => a.grades.includes(grade));
  const pool = forGrade.length >= QUEST_SIZE ? forGrade : noCrafts;
  const shuffled = [...pool].sort(() => rand() - 0.5);
  const chosen: ActivityDefinition[] = [];
  const islands = new Set<string>();
  // Prefer one creative activity so every quest has making in it.
  const creative = shuffled.find((a) => a.islandId === 'art');
  if (creative) {
    chosen.push(creative);
    islands.add(creative.islandId);
  }
  for (const a of shuffled) {
    if (chosen.length >= QUEST_SIZE) break;
    if (chosen.includes(a) || islands.has(a.islandId)) continue;
    chosen.push(a);
    islands.add(a.islandId);
  }
  // Tiny content packs: allow repeats of an island rather than an incomplete quest.
  for (const a of shuffled) {
    if (chosen.length >= QUEST_SIZE) break;
    if (!chosen.includes(a)) chosen.push(a);
  }
  return chosen.slice(0, QUEST_SIZE).map((a) => a.id);
}

/** Returns progress whose quest is for `dateKey` (creating or resetting it). */
export function ensureQuest(
  progress: LearningProgress,
  activities: readonly ActivityDefinition[],
  dateKey: string,
  grade?: number,
): LearningProgress {
  if (progress.quest && progress.quest.dateKey === dateKey) return progress;
  const quest: DailyQuestState = {
    dateKey,
    activityIds: pickDailyQuest(activities, dateKey, progress.childId, grade),
    completedIds: [],
    chestOpened: false,
  };
  if (quest.activityIds.length < QUEST_SIZE) return { ...progress, quest: null };
  return { ...progress, quest };
}

export function questComplete(quest: DailyQuestState | null): boolean {
  return !!quest && quest.activityIds.every((id) => quest.completedIds.includes(id));
}
