import type { ActivityDefinition } from '@/domain/activity/schema';
import { palette } from '@/theme';

export const stickerSceneActivities: ActivityDefinition[] = [
  {
    id: 'act_scene_island',
    kind: 'STICKER_SCENE',
    islandId: 'art',
    title: 'Decorate the Island',
    icon: 'island',
    color: palette.leaf,
    voiceIntro:
      'Tap a sticker, then tap the island to place it. Make it yours! Save it when you are done.',
    instruction: 'Tap a sticker, then tap the scene.',
    reward: { diamonds: 3, stickerId: 'stk_tree' },
    tags: ['stickers', 'creative'],
    data: {
      kind: 'STICKER_SCENE',
      background: 'island',
      stickers: [
        'tree',
        'flower',
        'sun',
        'cloud',
        'house',
        'cat',
        'dog',
        'bird',
        'butterfly',
        'bee',
        'crown',
        'diamond',
      ],
    },
  },
  {
    id: 'act_scene_sea',
    kind: 'STICKER_SCENE',
    islandId: 'science',
    title: 'Under the Sea',
    icon: 'whale',
    color: palette.sea,
    voiceIntro: 'Fill the sea with friends! Tap a sticker, then tap the water.',
    instruction: 'Tap a sticker, then tap the sea.',
    reward: { diamonds: 3, stickerId: 'stk_whale' },
    tags: ['stickers', 'creative', 'animals'],
    data: {
      kind: 'STICKER_SCENE',
      background: 'sea',
      stickers: [
        'fish',
        'crab',
        'turtle',
        'octopus',
        'whale',
        'seahorse',
        'starfish',
        'shell',
        'jellyfish',
        'boat',
      ],
    },
  },
];
