import { lazyScreen } from '@/utils/lazyScreen';

const MusicReefScreen = lazyScreen(() =>
  import('@/features/music/MusicReefScreen').then((m) => m.MusicReefScreen),
);

export default function MusicRoute() {
  return <MusicReefScreen />;
}
