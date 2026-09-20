import { lazyScreen } from '@/utils/lazyScreen';

const ParentCreationsScreen = lazyScreen(() =>
  import('@/features/parent/ParentCreationsScreen').then((m) => m.ParentCreationsScreen),
);

export default function ParentCreationsRoute() {
  return <ParentCreationsScreen />;
}
