import { useEffect, useState } from 'react';

import { allActivities, registryVersion, subscribeActivities } from '@/content/activities/registry';
import type { ActivityDefinition } from '@/domain/activity/schema';

/** Live list of activities; re-renders when a remote pack is merged in. */
export function useActivities(): readonly ActivityDefinition[] {
  const [, setVersion] = useState(registryVersion());
  useEffect(() => subscribeActivities(() => setVersion(registryVersion())), []);
  return allActivities();
}
