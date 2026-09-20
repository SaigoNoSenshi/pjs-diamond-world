import { lazyScreen } from '@/utils/lazyScreen';

const DrawScreen = lazyScreen(() =>
  import('@/features/drawing/DrawScreen').then((m) => m.DrawScreen),
);

export default function DrawRoute() {
  return <DrawScreen />;
}
