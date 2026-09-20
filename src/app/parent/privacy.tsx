import { lazyScreen } from '@/utils/lazyScreen';

const ParentPrivacyScreen = lazyScreen(() =>
  import('@/features/parent/ParentPrivacyScreen').then((m) => m.ParentPrivacyScreen),
);

export default function ParentPrivacyRoute() {
  return <ParentPrivacyScreen />;
}
