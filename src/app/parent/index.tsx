import { lazyScreen } from '@/utils/lazyScreen';

const ParentGateScreen = lazyScreen(() =>
  import('@/features/parent/ParentGateScreen').then((m) => m.ParentGateScreen),
);

export default function ParentGateRoute() {
  return <ParentGateScreen />;
}
