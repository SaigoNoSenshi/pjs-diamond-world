import type { ActivityDefinition } from '@/domain/activity/schema';

/**
 * Every engine gets the activity and reports completion once with an optional
 * 0..1 score. Engines never talk to storage or progression themselves.
 */
export interface EngineProps<A extends ActivityDefinition = ActivityDefinition> {
  activity: A;
  onComplete: (score?: number) => void;
}
