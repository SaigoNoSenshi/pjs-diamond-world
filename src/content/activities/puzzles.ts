import type { ActivityDefinition } from '@/domain/activity/schema';
import { palette } from '@/theme';

const P = (icon: string, color: string) => ({ icon, color });

export const puzzleActivities: ActivityDefinition[] = [
  {
    id: 'act_puzzle_princess',
    grades: [1, 2],
    subject: 'art',
    kind: 'PUZZLE',
    islandId: 'art',
    title: 'Princess Puzzle',
    icon: 'crown',
    color: palette.blossom,
    voiceIntro: 'The picture is mixed up! Tap two pieces to swap them until the princess is whole.',
    instruction: 'Tap two pieces to swap them.',
    reward: { diamonds: 4, stickerId: 'stk_crown' },
    tags: ['puzzle', 'jigsaw'],
    data: { kind: 'PUZZLE', mode: 'jigsaw', image: 'character.princess', grid: 2 },
  },
  {
    id: 'act_puzzle_jelly',
    grades: [1, 2],
    subject: 'art',
    kind: 'PUZZLE',
    islandId: 'art',
    title: 'Jelly Puzzle',
    icon: 'jellyfish',
    color: palette.sunshine,
    voiceIntro:
      'Oh no, Jelly is in pieces! Tap two pieces to swap them and put Jelly back together.',
    instruction: 'Tap two pieces to swap them.',
    reward: { diamonds: 5, stickerId: 'stk_jelly' },
    tags: ['puzzle', 'jigsaw'],
    data: { kind: 'PUZZLE', mode: 'jigsaw', image: 'character.jelly', grid: 3 },
  },
  {
    id: 'act_pattern_next',
    grades: [1, 2],
    subject: 'math',
    kind: 'PUZZLE',
    islandId: 'numbers',
    title: 'What Comes Next?',
    icon: 'sparkle',
    color: palette.aqua,
    voiceIntro: 'Look at the pattern. What comes next? Tap it!',
    instruction: 'Fill the gap in the pattern.',
    reward: { diamonds: 4, stickerId: 'stk_star' },
    tags: ['patterns', 'logic'],
    data: {
      kind: 'PUZZLE',
      mode: 'pattern',
      rounds: [
        {
          id: 'r1',
          sequence: [
            P('star', palette.sunshine),
            P('heart', palette.blossom),
            P('star', palette.sunshine),
            P('heart', palette.blossom),
            null,
          ],
          choices: [
            P('star', palette.sunshine),
            P('heart', palette.blossom),
            P('circle', palette.sea),
          ],
          answerIndex: 0,
        },
        {
          id: 'r2',
          sequence: [
            P('circle', palette.coral),
            P('circle', palette.sea),
            P('circle', palette.coral),
            null,
            P('circle', palette.coral),
          ],
          choices: [
            P('circle', palette.coral),
            P('circle', palette.sea),
            P('circle', palette.leaf),
          ],
          answerIndex: 1,
        },
        {
          id: 'r3',
          sequence: [
            P('fish', palette.tangerine),
            P('fish', palette.tangerine),
            P('crab', palette.coral),
            P('fish', palette.tangerine),
            P('fish', palette.tangerine),
            null,
          ],
          choices: [
            P('fish', palette.tangerine),
            P('crab', palette.coral),
            P('turtle', palette.leaf),
          ],
          answerIndex: 1,
        },
        {
          id: 'r4',
          sequence: [
            P('square', palette.sea),
            P('triangle', palette.leaf),
            P('circle', palette.coral),
            P('square', palette.sea),
            null,
            P('circle', palette.coral),
          ],
          choices: [
            P('circle', palette.coral),
            P('square', palette.sea),
            P('triangle', palette.leaf),
          ],
          answerIndex: 2,
        },
      ],
    },
  },
];
