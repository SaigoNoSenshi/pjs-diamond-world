import { useLocalSearchParams } from 'expo-router';

import { lazyScreen } from '@/utils/lazyScreen';

// All activity engines live in this chunk; it loads on the first activity only.
const ActivityPlayerScreen = lazyScreen(() =>
  import('@/features/activities/ActivityPlayerScreen').then((m) => m.ActivityPlayerScreen),
);

export default function PlayRoute() {
  const { activityId } = useLocalSearchParams<{ activityId: string }>();
  return <ActivityPlayerScreen activityId={activityId ?? ''} />;
}
