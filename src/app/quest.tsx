import { lazyScreen } from '@/utils/lazyScreen';

const DailyQuestScreen = lazyScreen(() =>
  import('@/features/quest/DailyQuestScreen').then((m) => m.DailyQuestScreen),
);

export default function QuestRoute() {
  return <DailyQuestScreen />;
}
