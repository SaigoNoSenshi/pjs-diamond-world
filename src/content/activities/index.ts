import type { IslandId } from '@/domain/activity/schema';

import { coloringActivities } from './coloring';
import { countingActivities } from './counting';
import { creativeActivities } from './creative';
import { matchingActivities } from './matching';
import { musicMakerActivities } from './musicMaker';
import { puzzleActivities } from './puzzles';
import { quizActivities } from './quiz';
import {
  activitiesForIsland as registryForIsland,
  allActivities,
  findActivity,
  registerActivities,
} from './registry';
import { stickerSceneActivities } from './stickerScenes';
import { storyActivities } from './stories';
import { tracingActivities } from './tracing';

/**
 * Core built-in packs (the first wave). Registered strictly at module load so a
 * malformed entry fails in tests, never in front of a child. The Grade 1–6 curriculum
 * banks are a separate lazy chunk (`loadGradeContent`), and remote packs are merged
 * later by the RemoteContentService. Prefer `useActivities()` in screens.
 */
export const builtInActivities = [
  ...tracingActivities,
  ...countingActivities,
  ...matchingActivities,
  ...puzzleActivities,
  ...quizActivities,
  ...coloringActivities,
  ...stickerSceneActivities,
  ...storyActivities,
  ...musicMakerActivities,
  ...creativeActivities,
];

registerActivities(builtInActivities, 'builtin', { strict: true });

export const GRADE_CONTENT_SOURCE = 'builtin-grades';

let gradeLoad: Promise<void> | null = null;

/**
 * Loads and registers the Grade 1–6 banks (authored quizzes + generated Math / Words)
 * from their own bundle chunk. Idempotent; a failed load can be retried. The
 * LearningProvider awaits this before it reports `ready`, and screens subscribed through
 * `useActivities()` re-render when the content lands.
 */
export function loadGradeContent(): Promise<void> {
  gradeLoad ??= import('./gradeContent')
    .then((m) => {
      registerActivities(m.gradeContentActivities, GRADE_CONTENT_SOURCE, { strict: true });
    })
    .catch((error: unknown) => {
      gradeLoad = null;
      throw error;
    });
  return gradeLoad;
}

/** Snapshot at import time (core built-ins only). Live view: `allActivities()` / `useActivities()`. */
export const activities = allActivities();

export { allActivities, findActivity };

export function activitiesForIsland(islandId: IslandId, grade?: number) {
  return registryForIsland(islandId, grade);
}
