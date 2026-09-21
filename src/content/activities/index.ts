import {
  activityDefinitionSchema,
  type ActivityDefinition,
  type IslandId,
} from '@/domain/activity/schema';

import { coloringActivities } from './coloring';
import { countingActivities } from './counting';
import { creativeActivities } from './creative';
import { matchingActivities } from './matching';
import { musicMakerActivities } from './musicMaker';
import { puzzleActivities } from './puzzles';
import { quizActivities } from './quiz';
import { stickerSceneActivities } from './stickerScenes';
import { storyActivities } from './stories';
import { tracingActivities } from './tracing';

/**
 * Activity registry. Every pack is validated once at startup; a bad entry throws
 * here (caught by tests) instead of failing in front of a child. Order within an
 * island is the order shown on the island screen.
 */
const raw: ActivityDefinition[] = [
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

export const activities: readonly ActivityDefinition[] = raw.map((a) =>
  activityDefinitionSchema.parse(a),
);

const byId = new Map(activities.map((a) => [a.id, a]));

export function findActivity(id: string): ActivityDefinition | undefined {
  return byId.get(id);
}

export function activitiesForIsland(islandId: IslandId): readonly ActivityDefinition[] {
  return activities.filter((a) => a.islandId === islandId);
}
