import { lazyScreen } from '@/utils/lazyScreen';

const ParentLearningScreen = lazyScreen(() =>
  import('@/features/parent/ParentLearningScreen').then((m) => m.ParentLearningScreen),
);

export default function ParentLearningRoute() {
  return <ParentLearningScreen />;
}
