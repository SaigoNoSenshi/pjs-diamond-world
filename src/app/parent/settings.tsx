import { lazyScreen } from '@/utils/lazyScreen';

const ParentSettingsScreen = lazyScreen(() =>
  import('@/features/parent/ParentSettingsScreen').then((m) => m.ParentSettingsScreen),
);

export default function ParentSettingsRoute() {
  return <ParentSettingsScreen />;
}
