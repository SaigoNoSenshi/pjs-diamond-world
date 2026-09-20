import { lazyScreen } from '@/utils/lazyScreen';

const ParentHomeScreen = lazyScreen(() =>
  import('@/features/parent/ParentHomeScreen').then((m) => m.ParentHomeScreen),
);

export default function ParentHomeRoute() {
  return <ParentHomeScreen />;
}
