import type { ActivityDefinition } from '@/domain/activity/schema';
import { palette } from '@/theme';

export const coloringActivities: ActivityDefinition[] = [
  // ── 1. Fish ──────────────────────────────────────────────────────────────
  {
    id: 'act_color_fish',
    grades: [1, 2, 3],
    subject: 'art',
    kind: 'COLORING',
    islandId: 'art',
    title: 'Color the Fish',
    icon: 'fish',
    color: palette.aqua,
    voiceIntro: 'Tap a color, then tap the picture to fill it in!',
    instruction: 'Tap a color, then tap a part of the picture.',
    reward: { diamonds: 3, stickerId: 'stk_ball' },
    tags: ['coloring', 'creative'],
    data: {
      kind: 'COLORING',
      viewBox: '0 0 100 100',
      regions: [
        // water background
        {
          id: 'bg',
          d: 'M 0 0 H 100 V 100 H 0 Z',
          suggested: palette.sea,
        },
        // main body
        {
          id: 'body',
          d: 'M 12 52 Q 15 34 40 33 Q 65 33 68 52 Q 65 71 40 71 Q 15 71 12 52 Z',
          suggested: palette.tangerine,
        },
        // tail fin (V-shape on the right)
        {
          id: 'tail',
          d: 'M 68 52 L 90 36 L 84 52 L 90 68 Z',
          suggested: palette.coral,
        },
        // top dorsal fin
        {
          id: 'fin_top',
          d: 'M 28 33 Q 36 17 52 20 Q 56 28 50 33 Z',
          suggested: palette.blossom,
        },
        // bottom pectoral fin
        {
          id: 'fin_bot',
          d: 'M 34 71 L 42 86 L 54 71 Z',
          suggested: palette.blossom,
        },
        // stripe 1 (front)
        {
          id: 'stripe1',
          d: 'M 34 35 L 42 35 L 42 69 L 34 69 Z',
          suggested: palette.coral,
        },
        // stripe 2 (middle)
        {
          id: 'stripe2',
          d: 'M 46 33 L 54 33 L 54 71 L 46 71 Z',
          suggested: palette.lavender,
        },
        // stripe 3 (back)
        {
          id: 'stripe3',
          d: 'M 56 35 L 64 35 L 64 69 L 56 69 Z',
          suggested: palette.leaf,
        },
        // eye (listed after stripes so it sits on top)
        {
          id: 'eye',
          d: 'M 20 52 A 6 6 0 1 0 32 52 A 6 6 0 1 0 20 52 Z',
          suggested: palette.white,
        },
        // bubble 1
        {
          id: 'bubble1',
          d: 'M 76 28 A 5 5 0 1 0 86 28 A 5 5 0 1 0 76 28 Z',
          suggested: palette.white,
        },
        // bubble 2
        {
          id: 'bubble2',
          d: 'M 82 14 A 4 4 0 1 0 90 14 A 4 4 0 1 0 82 14 Z',
          suggested: palette.white,
        },
      ],
      outlines: [
        // mouth smile
        'M 14 52 Q 10 57 14 62',
        // eye pupil
        'M 22 50 A 2 2 0 1 0 26 50 A 2 2 0 1 0 22 50',
      ],
    },
  },

  // ── 2. Flower ─────────────────────────────────────────────────────────────
  {
    id: 'act_color_flower',
    grades: [1, 2, 3],
    subject: 'art',
    kind: 'COLORING',
    islandId: 'art',
    title: 'Color the Flower',
    icon: 'flower',
    color: palette.blossom,
    voiceIntro: 'Tap a color, then tap the picture to fill it in!',
    instruction: 'Tap a color, then tap a part of the picture.',
    reward: { diamonds: 3, stickerId: 'stk_flower' },
    tags: ['coloring', 'creative'],
    data: {
      kind: 'COLORING',
      viewBox: '0 0 100 100',
      regions: [
        // sky/ground background
        {
          id: 'bg',
          d: 'M 0 0 H 100 V 100 H 0 Z',
          suggested: palette.sand,
        },
        // flower pot (trapezoid: wider at top)
        {
          id: 'pot',
          d: 'M 28 78 L 34 100 H 66 L 72 78 Z',
          suggested: palette.tangerine,
        },
        // stem
        {
          id: 'stem',
          d: 'M 46 44 H 54 V 78 H 46 Z',
          suggested: palette.leaf,
        },
        // left leaf
        {
          id: 'leaf_l',
          d: 'M 46 64 Q 30 56 24 66 Q 26 78 46 72 Z',
          suggested: palette.leaf,
        },
        // right leaf
        {
          id: 'leaf_r',
          d: 'M 54 64 Q 70 56 76 66 Q 74 78 54 72 Z',
          suggested: palette.leaf,
        },
        // petal top (12 o'clock)
        {
          id: 'petal_top',
          d: 'M 41 26 A 9 10 0 1 0 59 26 A 9 10 0 1 0 41 26 Z',
          suggested: palette.blossom,
        },
        // petal upper-right (~72° CW from top)
        {
          id: 'petal_tr',
          d: 'M 58 38 A 9 8 0 1 0 76 38 A 9 8 0 1 0 58 38 Z',
          suggested: palette.coral,
        },
        // petal lower-right
        {
          id: 'petal_br',
          d: 'M 52 59 A 9 8 0 1 0 70 59 A 9 8 0 1 0 52 59 Z',
          suggested: palette.blossom,
        },
        // petal lower-left
        {
          id: 'petal_bl',
          d: 'M 30 59 A 9 8 0 1 0 48 59 A 9 8 0 1 0 30 59 Z',
          suggested: palette.blossom,
        },
        // petal upper-left
        {
          id: 'petal_tl',
          d: 'M 24 38 A 9 8 0 1 0 42 38 A 9 8 0 1 0 24 38 Z',
          suggested: palette.coral,
        },
        // flower center (on top of petals)
        {
          id: 'center',
          d: 'M 40 44 A 10 10 0 1 0 60 44 A 10 10 0 1 0 40 44 Z',
          suggested: palette.sunshine,
        },
      ],
      outlines: [
        // small center dot
        'M 46 44 A 4 4 0 1 0 54 44 A 4 4 0 1 0 46 44',
        // pot rim line
        'M 28 78 H 72',
      ],
    },
  },

  // ── 3. Butterfly ─────────────────────────────────────────────────────────
  {
    id: 'act_color_butterfly',
    grades: [1, 2, 3],
    subject: 'art',
    kind: 'COLORING',
    islandId: 'art',
    title: 'Color the Butterfly',
    icon: 'butterfly',
    color: palette.lavender,
    voiceIntro: 'Tap a color, then tap the picture to fill it in!',
    instruction: 'Tap a color, then tap a part of the picture.',
    reward: { diamonds: 3, stickerId: 'stk_cloud' },
    tags: ['coloring', 'creative'],
    data: {
      kind: 'COLORING',
      viewBox: '0 0 100 100',
      regions: [
        // sky background
        {
          id: 'bg',
          d: 'M 0 0 H 100 V 100 H 0 Z',
          suggested: palette.mist,
        },
        // upper-left wing
        {
          id: 'wing_ul',
          d: 'M 48 46 Q 28 24 8 30 Q 4 48 20 60 Q 36 68 48 55 Z',
          suggested: palette.blossom,
        },
        // upper-right wing
        {
          id: 'wing_ur',
          d: 'M 52 46 Q 72 24 92 30 Q 96 48 80 60 Q 64 68 52 55 Z',
          suggested: palette.blossom,
        },
        // lower-left wing
        {
          id: 'wing_ll',
          d: 'M 46 56 Q 24 60 14 76 Q 20 90 40 86 Q 50 82 48 64 Z',
          suggested: palette.aqua,
        },
        // lower-right wing
        {
          id: 'wing_lr',
          d: 'M 54 56 Q 76 60 86 76 Q 80 90 60 86 Q 50 82 52 64 Z',
          suggested: palette.aqua,
        },
        // body (listed after wings so it appears on top)
        {
          id: 'body',
          d: 'M 47 28 Q 44 42 44 56 Q 44 68 48 74 Q 52 68 56 56 Q 56 42 53 28 Q 52 24 50 24 Q 48 24 47 28 Z',
          suggested: palette.lavender,
        },
        // head
        {
          id: 'head',
          d: 'M 44 22 A 6 6 0 1 0 56 22 A 6 6 0 1 0 44 22 Z',
          suggested: palette.lavender,
        },
        // upper-left wing spot
        {
          id: 'spot_ul',
          d: 'M 19 42 A 8 8 0 1 0 35 42 A 8 8 0 1 0 19 42 Z',
          suggested: palette.sunshine,
        },
        // upper-right wing spot
        {
          id: 'spot_ur',
          d: 'M 65 42 A 8 8 0 1 0 81 42 A 8 8 0 1 0 65 42 Z',
          suggested: palette.sunshine,
        },
        // lower-left wing spot
        {
          id: 'spot_ll',
          d: 'M 19 72 A 6 6 0 1 0 31 72 A 6 6 0 1 0 19 72 Z',
          suggested: palette.coral,
        },
        // lower-right wing spot
        {
          id: 'spot_lr',
          d: 'M 69 72 A 6 6 0 1 0 81 72 A 6 6 0 1 0 69 72 Z',
          suggested: palette.coral,
        },
      ],
      outlines: [
        // left antenna
        'M 48 22 Q 38 14 34 8',
        // right antenna
        'M 52 22 Q 62 14 66 8',
        // body centre stripe
        'M 44 52 H 56',
      ],
    },
  },

  // ── 4. House ─────────────────────────────────────────────────────────────
  {
    id: 'act_color_house',
    grades: [1, 2, 3],
    subject: 'art',
    kind: 'COLORING',
    islandId: 'art',
    title: 'Color the House',
    icon: 'house',
    color: palette.tangerine,
    voiceIntro: 'Tap a color, then tap the picture to fill it in!',
    instruction: 'Tap a color, then tap a part of the picture.',
    reward: { diamonds: 3, stickerId: 'stk_house' },
    tags: ['coloring', 'creative'],
    data: {
      kind: 'COLORING',
      viewBox: '0 0 100 100',
      regions: [
        // sky
        {
          id: 'sky',
          d: 'M 0 0 H 100 V 65 H 0 Z',
          suggested: palette.sea,
        },
        // ground / grass strip
        {
          id: 'ground',
          d: 'M 0 80 H 100 V 100 H 0 Z',
          suggested: palette.leaf,
        },
        // chimney (listed before roof so roof overlaps its base naturally)
        {
          id: 'chimney',
          d: 'M 63 20 H 73 V 44 H 63 Z',
          suggested: palette.tangerine,
        },
        // roof triangle
        {
          id: 'roof',
          d: 'M 8 65 L 50 18 L 92 65 Z',
          suggested: palette.coral,
        },
        // walls
        {
          id: 'walls',
          d: 'M 15 65 H 85 V 82 H 15 Z',
          suggested: palette.sand,
        },
        // left window
        {
          id: 'win_l',
          d: 'M 20 67 H 38 V 79 H 20 Z',
          suggested: palette.aqua,
        },
        // right window
        {
          id: 'win_r',
          d: 'M 62 67 H 80 V 79 H 62 Z',
          suggested: palette.aqua,
        },
        // door (arch top, flat bottom)
        {
          id: 'door',
          d: 'M 43 82 L 43 64 Q 43 57 50 57 Q 57 57 57 64 L 57 82 Z',
          suggested: palette.tangerine,
        },
        // front walkway
        {
          id: 'walkway',
          d: 'M 43 82 H 57 V 100 H 43 Z',
          suggested: palette.sand,
        },
        // sun
        {
          id: 'sun',
          d: 'M 70 12 A 10 10 0 1 0 90 12 A 10 10 0 1 0 70 12 Z',
          suggested: palette.sunshine,
        },
      ],
      outlines: [
        // left window cross
        'M 29 67 V 79 M 20 73 H 38',
        // right window cross
        'M 71 67 V 79 M 62 73 H 80',
      ],
    },
  },

  // ── 5. Robot ─────────────────────────────────────────────────────────────
  {
    id: 'act_color_robot',
    grades: [1, 2, 3],
    subject: 'art',
    kind: 'COLORING',
    islandId: 'art',
    title: 'Color the Robot',
    icon: 'robot',
    color: palette.sea,
    voiceIntro: 'Tap a color, then tap the picture to fill it in!',
    instruction: 'Tap a color, then tap a part of the picture.',
    reward: { diamonds: 3, stickerId: 'stk_robot' },
    tags: ['coloring', 'creative'],
    data: {
      kind: 'COLORING',
      viewBox: '0 0 100 100',
      regions: [
        // background
        {
          id: 'bg',
          d: 'M 0 0 H 100 V 100 H 0 Z',
          suggested: palette.mist,
        },
        // antenna stick
        {
          id: 'antenna_stick',
          d: 'M 47 10 H 53 V 18 H 47 Z',
          suggested: palette.tangerine,
        },
        // antenna ball
        {
          id: 'antenna_ball',
          d: 'M 45 6 A 5 5 0 1 0 55 6 A 5 5 0 1 0 45 6 Z',
          suggested: palette.coral,
        },
        // head
        {
          id: 'head',
          d: 'M 25 18 H 75 V 48 H 25 Z',
          suggested: palette.sea,
        },
        // torso
        {
          id: 'body',
          d: 'M 22 50 H 78 V 78 H 22 Z',
          suggested: palette.sea,
        },
        // left arm
        {
          id: 'arm_l',
          d: 'M 8 50 H 22 V 74 H 8 Z',
          suggested: palette.aqua,
        },
        // right arm
        {
          id: 'arm_r',
          d: 'M 78 50 H 92 V 74 H 78 Z',
          suggested: palette.aqua,
        },
        // left leg
        {
          id: 'leg_l',
          d: 'M 26 78 H 46 V 100 H 26 Z',
          suggested: palette.sea,
        },
        // right leg
        {
          id: 'leg_r',
          d: 'M 54 78 H 74 V 100 H 54 Z',
          suggested: palette.sea,
        },
        // belly control panel
        {
          id: 'belly',
          d: 'M 30 52 H 70 V 72 H 30 Z',
          suggested: palette.seaDeep,
        },
        // left eye (listed after belly so it sits on top of head)
        {
          id: 'eye_l',
          d: 'M 30 30 A 7 7 0 1 0 44 30 A 7 7 0 1 0 30 30 Z',
          suggested: palette.sunshine,
        },
        // right eye
        {
          id: 'eye_r',
          d: 'M 56 30 A 7 7 0 1 0 70 30 A 7 7 0 1 0 56 30 Z',
          suggested: palette.sunshine,
        },
      ],
      outlines: [
        // mouth (curved smile)
        'M 36 42 Q 50 48 64 42',
        // belly button circle
        'M 46 60 A 4 4 0 1 0 54 60 A 4 4 0 1 0 46 60',
      ],
    },
  },

  // ── 6. Jellyfish ─────────────────────────────────────────────────────────
  {
    id: 'act_color_jelly',
    grades: [1, 2, 3],
    subject: 'art',
    kind: 'COLORING',
    islandId: 'art',
    title: 'Color the Jellyfish',
    icon: 'jellyfish',
    color: palette.blossom,
    voiceIntro: 'Tap a color, then tap the picture to fill it in!',
    instruction: 'Tap a color, then tap a part of the picture.',
    reward: { diamonds: 3, stickerId: 'stk_mango' },
    tags: ['coloring', 'creative'],
    data: {
      kind: 'COLORING',
      viewBox: '0 0 100 100',
      regions: [
        // ocean background
        {
          id: 'bg',
          d: 'M 0 0 H 100 V 100 H 0 Z',
          suggested: palette.sea,
        },
        // dome / bell (semicircle)
        {
          id: 'dome',
          d: 'M 18 46 Q 18 12 50 12 Q 82 12 82 46 Z',
          suggested: palette.lavender,
        },
        // tentacle 1 (leftmost)
        {
          id: 'tent1',
          d: 'M 24 46 Q 20 62 22 80 Q 24 90 28 88 Q 32 90 34 80 Q 36 62 32 46 Z',
          suggested: palette.blossom,
        },
        // tentacle 2
        {
          id: 'tent2',
          d: 'M 36 46 Q 32 65 34 82 Q 36 90 40 90 Q 44 90 46 82 Q 48 65 44 46 Z',
          suggested: palette.lavender,
        },
        // tentacle 3 (centre)
        {
          id: 'tent3',
          d: 'M 47 46 Q 44 66 44 84 Q 46 95 50 95 Q 54 95 56 84 Q 56 66 53 46 Z',
          suggested: palette.blossom,
        },
        // tentacle 4
        {
          id: 'tent4',
          d: 'M 56 46 Q 52 65 54 82 Q 56 90 60 90 Q 64 90 66 82 Q 68 65 64 46 Z',
          suggested: palette.lavender,
        },
        // tentacle 5 (rightmost)
        {
          id: 'tent5',
          d: 'M 68 46 Q 64 62 66 80 Q 68 90 72 88 Q 76 90 78 80 Q 80 62 76 46 Z',
          suggested: palette.blossom,
        },
        // left cheek blush (listed before eyes so eyes sit on top)
        {
          id: 'blush_l',
          d: 'M 22 40 A 6 4 0 1 0 34 40 A 6 4 0 1 0 22 40 Z',
          suggested: palette.blossom,
        },
        // right cheek blush
        {
          id: 'blush_r',
          d: 'M 66 40 A 6 4 0 1 0 78 40 A 6 4 0 1 0 66 40 Z',
          suggested: palette.coral,
        },
        // left eye
        {
          id: 'eye_l',
          d: 'M 31 32 A 6 6 0 1 0 43 32 A 6 6 0 1 0 31 32 Z',
          suggested: palette.white,
        },
        // right eye
        {
          id: 'eye_r',
          d: 'M 57 32 A 6 6 0 1 0 69 32 A 6 6 0 1 0 57 32 Z',
          suggested: palette.white,
        },
      ],
      outlines: [
        // smile
        'M 42 40 Q 50 46 58 40',
        // left pupil
        'M 34 31 A 2 2 0 1 0 38 31 A 2 2 0 1 0 34 31',
        // right pupil
        'M 60 31 A 2 2 0 1 0 64 31 A 2 2 0 1 0 60 31',
      ],
    },
  },
];
