import { lazyScreen } from '@/utils/lazyScreen';

const DiamondBookScreen = lazyScreen(() =>
  import('@/features/diamond-book/DiamondBookScreen').then((m) => m.DiamondBookScreen),
);

export default function BookRoute() {
  return <DiamondBookScreen />;
}
