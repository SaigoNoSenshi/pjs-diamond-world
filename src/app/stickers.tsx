import { lazyScreen } from '@/utils/lazyScreen';

const StickerBookScreen = lazyScreen(() =>
  import('@/features/collection/StickerBookScreen').then((m) => m.StickerBookScreen),
);

export default function StickersRoute() {
  return <StickerBookScreen />;
}
