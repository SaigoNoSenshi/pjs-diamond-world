import { useLocalSearchParams } from 'expo-router';

import { lazyScreen } from '@/utils/lazyScreen';

const IslandScreen = lazyScreen(() =>
  import('@/features/islands/IslandScreen').then((m) => m.IslandScreen),
);

export default function IslandRoute() {
  const { islandId } = useLocalSearchParams<{ islandId: string }>();
  return <IslandScreen islandId={islandId ?? ''} />;
}
