import { useLocalSearchParams } from 'expo-router';

import { lazyScreen } from '@/utils/lazyScreen';

const CreationDetailScreen = lazyScreen(() =>
  import('@/features/diamond-book/CreationDetailScreen').then((m) => m.CreationDetailScreen),
);

export default function CreationRoute() {
  const { creationId } = useLocalSearchParams<{ creationId: string }>();
  return <CreationDetailScreen creationId={creationId} />;
}
