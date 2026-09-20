import { lazyScreen } from '@/utils/lazyScreen';

const GardenScreen = lazyScreen(() =>
  import('@/features/garden/GardenScreen').then((m) => m.GardenScreen),
);

export default function GardenRoute() {
  return <GardenScreen />;
}
