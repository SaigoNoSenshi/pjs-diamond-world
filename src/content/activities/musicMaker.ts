import type { ActivityDefinition } from '@/domain/activity/schema';
import { palette } from '@/theme';

export const musicMakerActivities: ActivityDefinition[] = [
  {
    id: 'act_music_xylophone',
    grades: [1, 2, 3, 4, 5, 6],
    subject: 'music',
    kind: 'MUSIC_MAKER',
    islandId: 'art',
    title: 'Rainbow Xylophone',
    icon: 'music',
    color: palette.lavender,
    voiceIntro: 'Tap the rainbow bars to play a tune! Tap the play button to hear it again.',
    instruction: 'Tap the bars to make music.',
    reward: { diamonds: 3, stickerId: 'stk_music' },
    tags: ['music', 'creative'],
    data: {
      kind: 'MUSIC_MAKER',
      instrument: 'xylophone',
      pads: [
        { id: 'c', label: 'Do', color: palette.coral, sound: 'xylo.c' },
        { id: 'd', label: 'Re', color: palette.tangerine, sound: 'xylo.d' },
        { id: 'e', label: 'Mi', color: palette.sunshine, sound: 'xylo.e' },
        { id: 'f', label: 'Fa', color: palette.leaf, sound: 'xylo.f' },
        { id: 'g', label: 'So', color: palette.aqua, sound: 'xylo.g' },
        { id: 'a', label: 'La', color: palette.sea, sound: 'xylo.a' },
        { id: 'b', label: 'Ti', color: palette.lavender, sound: 'xylo.b' },
        { id: 'c2', label: 'Do', color: palette.blossom, sound: 'xylo.c2' },
      ],
      demo: ['c', 'd', 'e', 'c', 'c', 'd', 'e', 'c', 'e', 'f', 'g', 'e', 'f', 'g'],
    },
  },
  {
    id: 'act_music_drums',
    grades: [1, 2, 3, 4, 5, 6],
    subject: 'music',
    kind: 'MUSIC_MAKER',
    islandId: 'art',
    title: 'Beach Drums',
    icon: 'music',
    color: palette.tangerine,
    voiceIntro: 'Boom, tap, clap! Make a beat on the beach drums.',
    instruction: 'Tap the drums to make a beat.',
    reward: { diamonds: 3 },
    tags: ['music', 'creative', 'rhythm'],
    data: {
      kind: 'MUSIC_MAKER',
      instrument: 'drums',
      pads: [
        { id: 'kick', label: 'Boom', color: palette.coral, sound: 'drum.kick' },
        { id: 'snare', label: 'Tap', color: palette.sunshine, sound: 'drum.snare' },
        { id: 'hat', label: 'Tss', color: palette.aqua, sound: 'drum.hat' },
        { id: 'clap', label: 'Clap', color: palette.blossom, sound: 'drum.clap' },
      ],
      demo: ['kick', 'hat', 'snare', 'hat', 'kick', 'hat', 'snare', 'clap'],
    },
  },
];
