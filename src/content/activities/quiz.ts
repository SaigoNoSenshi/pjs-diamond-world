import type { ActivityDefinition } from '@/domain/activity/schema';
import { palette } from '@/theme';

/** "Jelly Asks" quiz activities — 8 topics covering phonics, colours, shapes, numbers, animals, body/senses, and living things. */
export const quizActivities: ActivityDefinition[] = [
  // 1. Letter Sounds
  {
    id: 'act_quiz_letter_sounds',
    grades: [1],
    subject: 'english',
    kind: 'QUIZ',
    islandId: 'letters',
    title: 'Jelly Asks: Letter Sounds',
    icon: 'abc',
    color: palette.lavender,
    voiceIntro: 'Jelly has some questions for you! Tap the right picture.',
    instruction: 'Tap the right picture.',
    reward: { diamonds: 4, stickerId: 'stk_bee' },
    tags: ['quiz', 'phonics'],
    data: {
      kind: 'QUIZ',
      pick: 5,
      questions: [
        {
          id: 'ls_q1',
          prompt: 'Which picture starts with B?',
          choices: [
            { id: 'ball', label: 'Ball', picture: { icon: 'ball', color: palette.coral } },
            { id: 'cat', label: 'Cat', picture: { icon: 'cat', color: palette.tangerine } },
            { id: 'fish', label: 'Fish', picture: { icon: 'fish', color: palette.sea } },
          ],
          answerId: 'ball',
        },
        {
          id: 'ls_q2',
          prompt: 'Which picture starts with F?',
          choices: [
            { id: 'dog', label: 'Dog', picture: { icon: 'dog', color: palette.tangerine } },
            { id: 'frog', label: 'Frog', picture: { icon: 'frog', color: palette.leaf } },
            { id: 'bird', label: 'Bird', picture: { icon: 'bird', color: palette.sea } },
          ],
          answerId: 'frog',
        },
        {
          id: 'ls_q3',
          prompt: 'Which picture starts with C?',
          choices: [
            { id: 'cat', label: 'Cat', picture: { icon: 'cat', color: palette.tangerine } },
            { id: 'ball', label: 'Ball', picture: { icon: 'ball', color: palette.coral } },
            { id: 'tree', label: 'Tree', picture: { icon: 'tree', color: palette.leaf } },
          ],
          answerId: 'cat',
        },
        {
          id: 'ls_q4',
          prompt: 'Which picture starts with S?',
          choices: [
            { id: 'apple', label: 'Apple', picture: { icon: 'apple', color: palette.coral } },
            { id: 'star', label: 'Star', picture: { icon: 'star', color: palette.sunshine } },
            { id: 'cloud', label: 'Cloud', picture: { icon: 'cloud', color: palette.sea } },
          ],
          answerId: 'star',
        },
        {
          id: 'ls_q5',
          prompt: 'Which picture starts with M?',
          choices: [
            { id: 'boat', label: 'Boat', picture: { icon: 'boat', color: palette.sea } },
            { id: 'mango', label: 'Mango', picture: { icon: 'mango', color: palette.tangerine } },
            { id: 'leaf', label: 'Leaf', picture: { icon: 'leaf', color: palette.leaf } },
          ],
          answerId: 'mango',
        },
        {
          id: 'ls_q6',
          prompt: 'Which picture starts with T?',
          choices: [
            { id: 'fish', label: 'Fish', picture: { icon: 'fish', color: palette.sea } },
            { id: 'turtle', label: 'Turtle', picture: { icon: 'turtle', color: palette.leaf } },
            { id: 'star', label: 'Star', picture: { icon: 'star', color: palette.sunshine } },
          ],
          answerId: 'turtle',
        },
        {
          id: 'ls_q7',
          prompt: 'Which picture starts with H?',
          choices: [
            { id: 'hat', label: 'Hat', picture: { icon: 'hat', color: palette.blossom } },
            { id: 'cup', label: 'Cup', picture: { icon: 'cup', color: palette.tangerine } },
            { id: 'ball', label: 'Ball', picture: { icon: 'ball', color: palette.coral } },
          ],
          answerId: 'hat',
        },
        {
          id: 'ls_q8',
          prompt: 'Which picture starts with A?',
          choices: [
            { id: 'fish', label: 'Fish', picture: { icon: 'fish', color: palette.sea } },
            { id: 'dog', label: 'Dog', picture: { icon: 'dog', color: palette.tangerine } },
            { id: 'apple', label: 'Apple', picture: { icon: 'apple', color: palette.coral } },
          ],
          answerId: 'apple',
        },
      ],
    },
  },

  // 2. Find the Letter
  {
    id: 'act_quiz_find_letter',
    grades: [1],
    subject: 'english',
    kind: 'QUIZ',
    islandId: 'letters',
    title: 'Jelly Asks: Find the Letter',
    icon: 'abc',
    color: palette.sea,
    voiceIntro: 'Jelly has some questions for you! Tap the right picture.',
    instruction: 'Tap the right picture.',
    reward: { diamonds: 4, stickerId: 'stk_apple' },
    tags: ['quiz', 'letters'],
    data: {
      kind: 'QUIZ',
      pick: 5,
      questions: [
        {
          id: 'fl_q1',
          prompt: 'Find the letter B.',
          choices: [
            { id: 'B', label: 'B', picture: { icon: 'abc', text: 'B' } },
            { id: 'D', label: 'D', picture: { icon: 'abc', text: 'D' } },
            { id: 'P', label: 'P', picture: { icon: 'abc', text: 'P' } },
          ],
          answerId: 'B',
        },
        {
          id: 'fl_q2',
          prompt: 'Find the letter M.',
          choices: [
            { id: 'N', label: 'N', picture: { icon: 'abc', text: 'N' } },
            { id: 'M', label: 'M', picture: { icon: 'abc', text: 'M' } },
            { id: 'W', label: 'W', picture: { icon: 'abc', text: 'W' } },
          ],
          answerId: 'M',
        },
        {
          id: 'fl_q3',
          prompt: 'Find the letter A.',
          choices: [
            { id: 'A', label: 'A', picture: { icon: 'abc', text: 'A' } },
            { id: 'E', label: 'E', picture: { icon: 'abc', text: 'E' } },
            { id: 'O', label: 'O', picture: { icon: 'abc', text: 'O' } },
          ],
          answerId: 'A',
        },
        {
          id: 'fl_q4',
          prompt: 'Find the letter S.',
          choices: [
            { id: 'C', label: 'C', picture: { icon: 'abc', text: 'C' } },
            { id: 'S', label: 'S', picture: { icon: 'abc', text: 'S' } },
            { id: 'Z', label: 'Z', picture: { icon: 'abc', text: 'Z' } },
          ],
          answerId: 'S',
        },
        {
          id: 'fl_q5',
          prompt: 'Find the letter T.',
          choices: [
            { id: 'T', label: 'T', picture: { icon: 'abc', text: 'T' } },
            { id: 'L', label: 'L', picture: { icon: 'abc', text: 'L' } },
            { id: 'F', label: 'F', picture: { icon: 'abc', text: 'F' } },
          ],
          answerId: 'T',
        },
        {
          id: 'fl_q6',
          prompt: 'Find the letter H.',
          choices: [
            { id: 'K', label: 'K', picture: { icon: 'abc', text: 'K' } },
            { id: 'N', label: 'N', picture: { icon: 'abc', text: 'N' } },
            { id: 'H', label: 'H', picture: { icon: 'abc', text: 'H' } },
          ],
          answerId: 'H',
        },
        {
          id: 'fl_q7',
          prompt: 'Find the letter R.',
          choices: [
            { id: 'P', label: 'P', picture: { icon: 'abc', text: 'P' } },
            { id: 'R', label: 'R', picture: { icon: 'abc', text: 'R' } },
            { id: 'B', label: 'B', picture: { icon: 'abc', text: 'B' } },
          ],
          answerId: 'R',
        },
      ],
    },
  },

  // 3. Colors
  {
    id: 'act_quiz_colors',
    grades: [1],
    subject: 'art',
    kind: 'QUIZ',
    islandId: 'art',
    title: 'Jelly Asks: Colors',
    icon: 'paintbrush',
    color: palette.blossom,
    voiceIntro: 'Jelly has some questions for you! Tap the right picture.',
    instruction: 'Tap the right picture.',
    reward: { diamonds: 4, stickerId: 'stk_sun' },
    tags: ['quiz', 'colors'],
    data: {
      kind: 'QUIZ',
      pick: 5,
      questions: [
        {
          id: 'col_q1',
          prompt: 'Which one is red?',
          choices: [
            { id: 'red', label: 'Red', picture: { icon: 'star', color: palette.coral } },
            { id: 'blue', label: 'Blue', picture: { icon: 'star', color: palette.sea } },
            { id: 'green', label: 'Green', picture: { icon: 'star', color: palette.leaf } },
          ],
          answerId: 'red',
        },
        {
          id: 'col_q2',
          prompt: 'Which one is pula? (red)',
          voice: 'Which one is pula? Pula means red.',
          choices: [
            { id: 'red', label: 'Red', picture: { icon: 'circle', color: palette.coral } },
            { id: 'purple', label: 'Purple', picture: { icon: 'circle', color: palette.lavender } },
            { id: 'yellow', label: 'Yellow', picture: { icon: 'circle', color: palette.sunshine } },
          ],
          answerId: 'red',
        },
        {
          id: 'col_q3',
          prompt: 'Which one is blue?',
          choices: [
            { id: 'red', label: 'Red', picture: { icon: 'heart', color: palette.coral } },
            { id: 'blue', label: 'Blue', picture: { icon: 'heart', color: palette.sea } },
            { id: 'yellow', label: 'Yellow', picture: { icon: 'heart', color: palette.sunshine } },
          ],
          answerId: 'blue',
        },
        {
          id: 'col_q4',
          prompt: 'Which one is asul? (blue)',
          voice: 'Which one is asul? Asul means blue.',
          choices: [
            { id: 'blue', label: 'Blue', picture: { icon: 'boat', color: palette.sea } },
            { id: 'orange', label: 'Orange', picture: { icon: 'boat', color: palette.tangerine } },
            { id: 'pink', label: 'Pink', picture: { icon: 'boat', color: palette.blossom } },
          ],
          answerId: 'blue',
        },
        {
          id: 'col_q5',
          prompt: 'Which one is yellow?',
          choices: [
            { id: 'pink', label: 'Pink', picture: { icon: 'flower', color: palette.blossom } },
            { id: 'blue', label: 'Blue', picture: { icon: 'flower', color: palette.sea } },
            { id: 'yellow', label: 'Yellow', picture: { icon: 'flower', color: palette.sunshine } },
          ],
          answerId: 'yellow',
        },
        {
          id: 'col_q6',
          prompt: 'Which one is dilaw? (yellow)',
          voice: 'Which one is dilaw? Dilaw means yellow.',
          choices: [
            { id: 'yellow', label: 'Yellow', picture: { icon: 'bird', color: palette.sunshine } },
            { id: 'red', label: 'Red', picture: { icon: 'bird', color: palette.coral } },
            { id: 'green', label: 'Green', picture: { icon: 'bird', color: palette.leaf } },
          ],
          answerId: 'yellow',
        },
        {
          id: 'col_q7',
          prompt: 'Which one is green?',
          choices: [
            { id: 'red', label: 'Red', picture: { icon: 'tree', color: palette.coral } },
            { id: 'green', label: 'Green', picture: { icon: 'tree', color: palette.leaf } },
            { id: 'blue', label: 'Blue', picture: { icon: 'tree', color: palette.sea } },
          ],
          answerId: 'green',
        },
        {
          id: 'col_q8',
          prompt: 'Which one is berde? (green)',
          voice: 'Which one is berde? Berde means green.',
          choices: [
            { id: 'pink', label: 'Pink', picture: { icon: 'frog', color: palette.blossom } },
            { id: 'green', label: 'Green', picture: { icon: 'frog', color: palette.leaf } },
            { id: 'yellow', label: 'Yellow', picture: { icon: 'frog', color: palette.sunshine } },
          ],
          answerId: 'green',
        },
      ],
    },
  },

  // 4. Shapes
  {
    id: 'act_quiz_shapes',
    grades: [1, 2],
    subject: 'math',
    kind: 'QUIZ',
    islandId: 'numbers',
    title: 'Jelly Asks: Shapes',
    icon: 'triangle',
    color: palette.tangerine,
    voiceIntro: 'Jelly has some questions for you! Tap the right picture.',
    instruction: 'Tap the right picture.',
    reward: { diamonds: 4, stickerId: 'stk_butterfly' },
    tags: ['quiz', 'shapes'],
    data: {
      kind: 'QUIZ',
      pick: 5,
      questions: [
        {
          id: 'sh_q1',
          prompt: 'Which shape has three sides?',
          choices: [
            {
              id: 'triangle',
              label: 'Triangle',
              picture: { icon: 'triangle', color: palette.coral },
            },
            { id: 'circle', label: 'Circle', picture: { icon: 'circle', color: palette.sea } },
            { id: 'square', label: 'Square', picture: { icon: 'square', color: palette.leaf } },
          ],
          answerId: 'triangle',
        },
        {
          id: 'sh_q2',
          prompt: 'Which shape has four equal sides?',
          choices: [
            { id: 'square', label: 'Square', picture: { icon: 'square', color: palette.sea } },
            {
              id: 'triangle',
              label: 'Triangle',
              picture: { icon: 'triangle', color: palette.coral },
            },
            { id: 'oval', label: 'Oval', picture: { icon: 'oval', color: palette.sunshine } },
          ],
          answerId: 'square',
        },
        {
          id: 'sh_q3',
          prompt: 'Which shape is round like a ball?',
          choices: [
            { id: 'square', label: 'Square', picture: { icon: 'square', color: palette.leaf } },
            { id: 'circle', label: 'Circle', picture: { icon: 'circle', color: palette.lavender } },
            {
              id: 'rectangle',
              label: 'Rectangle',
              picture: { icon: 'rectangle', color: palette.tangerine },
            },
          ],
          answerId: 'circle',
        },
        {
          id: 'sh_q4',
          prompt: 'Which shape looks like an egg?',
          choices: [
            { id: 'oval', label: 'Oval', picture: { icon: 'oval', color: palette.blossom } },
            {
              id: 'triangle',
              label: 'Triangle',
              picture: { icon: 'triangle', color: palette.coral },
            },
            {
              id: 'rectangle',
              label: 'Rectangle',
              picture: { icon: 'rectangle', color: palette.sea },
            },
          ],
          answerId: 'oval',
        },
        {
          id: 'sh_q5',
          prompt: 'Which shape has six sides?',
          choices: [
            { id: 'circle', label: 'Circle', picture: { icon: 'circle', color: palette.sea } },
            {
              id: 'hexagon',
              label: 'Hexagon',
              picture: { icon: 'hexagon', color: palette.sunshine },
            },
            { id: 'square', label: 'Square', picture: { icon: 'square', color: palette.leaf } },
          ],
          answerId: 'hexagon',
        },
        {
          id: 'sh_q6',
          prompt: 'Which shape is long with four sides?',
          choices: [
            {
              id: 'rectangle',
              label: 'Rectangle',
              picture: { icon: 'rectangle', color: palette.tangerine },
            },
            { id: 'circle', label: 'Circle', picture: { icon: 'circle', color: palette.lavender } },
            {
              id: 'triangle',
              label: 'Triangle',
              picture: { icon: 'triangle', color: palette.coral },
            },
          ],
          answerId: 'rectangle',
        },
        {
          id: 'sh_q7',
          prompt: 'Which shape has four sides but is NOT a square?',
          choices: [
            {
              id: 'triangle',
              label: 'Triangle',
              picture: { icon: 'triangle', color: palette.coral },
            },
            {
              id: 'rectangle',
              label: 'Rectangle',
              picture: { icon: 'rectangle', color: palette.sea },
            },
            { id: 'oval', label: 'Oval', picture: { icon: 'oval', color: palette.blossom } },
          ],
          answerId: 'rectangle',
        },
      ],
    },
  },

  // 5. Numbers
  {
    id: 'act_quiz_numbers',
    grades: [1, 2],
    subject: 'math',
    kind: 'QUIZ',
    islandId: 'numbers',
    title: 'Jelly Asks: Numbers',
    icon: 'numbers',
    color: palette.sea,
    voiceIntro: 'Jelly has some questions for you! Tap the right picture.',
    instruction: 'Tap the right picture.',
    reward: { diamonds: 4, stickerId: 'stk_cat' },
    tags: ['quiz', 'numbers'],
    data: {
      kind: 'QUIZ',
      pick: 5,
      questions: [
        {
          id: 'num_q1',
          prompt: 'Which number is 8?',
          choices: [
            { id: 'n3', label: 'Three', picture: { icon: 'numbers', text: '3' } },
            { id: 'n8', label: 'Eight', picture: { icon: 'numbers', text: '8' } },
            { id: 'n6', label: 'Six', picture: { icon: 'numbers', text: '6' } },
          ],
          answerId: 'n8',
        },
        {
          id: 'num_q2',
          prompt: 'Which number is 5?',
          choices: [
            { id: 'n5', label: 'Five', picture: { icon: 'numbers', text: '5' } },
            { id: 'n9', label: 'Nine', picture: { icon: 'numbers', text: '9' } },
            { id: 'n2', label: 'Two', picture: { icon: 'numbers', text: '2' } },
          ],
          answerId: 'n5',
        },
        {
          id: 'num_q3',
          prompt: 'What comes after 4?',
          choices: [
            { id: 'n3', label: 'Three', picture: { icon: 'numbers', text: '3' } },
            { id: 'n5', label: 'Five', picture: { icon: 'numbers', text: '5' } },
            { id: 'n7', label: 'Seven', picture: { icon: 'numbers', text: '7' } },
          ],
          answerId: 'n5',
        },
        {
          id: 'num_q4',
          prompt: 'What comes before 9?',
          choices: [
            { id: 'n8', label: 'Eight', picture: { icon: 'numbers', text: '8' } },
            { id: 'n10', label: 'Ten', picture: { icon: 'numbers', text: '10' } },
            { id: 'n6', label: 'Six', picture: { icon: 'numbers', text: '6' } },
          ],
          answerId: 'n8',
        },
        {
          id: 'num_q5',
          prompt: 'Which number is 10?',
          choices: [
            { id: 'n1', label: 'One', picture: { icon: 'numbers', text: '1' } },
            { id: 'n7', label: 'Seven', picture: { icon: 'numbers', text: '7' } },
            { id: 'n10', label: 'Ten', picture: { icon: 'numbers', text: '10' } },
          ],
          answerId: 'n10',
        },
        {
          id: 'num_q6',
          prompt: 'What comes after 7?',
          choices: [
            { id: 'n6', label: 'Six', picture: { icon: 'numbers', text: '6' } },
            { id: 'n8', label: 'Eight', picture: { icon: 'numbers', text: '8' } },
            { id: 'n9', label: 'Nine', picture: { icon: 'numbers', text: '9' } },
          ],
          answerId: 'n8',
        },
        {
          id: 'num_q7',
          prompt: 'Which number is 3?',
          choices: [
            { id: 'n8', label: 'Eight', picture: { icon: 'numbers', text: '8' } },
            { id: 'n5', label: 'Five', picture: { icon: 'numbers', text: '5' } },
            { id: 'n3', label: 'Three', picture: { icon: 'numbers', text: '3' } },
          ],
          answerId: 'n3',
        },
        {
          id: 'num_q8',
          prompt: 'What comes before 6?',
          choices: [
            { id: 'n7', label: 'Seven', picture: { icon: 'numbers', text: '7' } },
            { id: 'n4', label: 'Four', picture: { icon: 'numbers', text: '4' } },
            { id: 'n5', label: 'Five', picture: { icon: 'numbers', text: '5' } },
          ],
          answerId: 'n5',
        },
      ],
    },
  },

  // 6. Animals
  {
    id: 'act_quiz_animals',
    grades: [1, 2],
    subject: 'science',
    kind: 'QUIZ',
    islandId: 'science',
    title: 'Jelly Asks: Animals',
    icon: 'fish',
    color: palette.leaf,
    voiceIntro: 'Jelly has some questions for you! Tap the right picture.',
    instruction: 'Tap the right picture.',
    reward: { diamonds: 4, stickerId: 'stk_dog' },
    tags: ['quiz', 'animals', 'science'],
    data: {
      kind: 'QUIZ',
      pick: 5,
      questions: [
        {
          id: 'ani_q1',
          prompt: 'Which animal lives in the sea?',
          choices: [
            { id: 'fish', label: 'Fish', picture: { icon: 'fish', color: palette.sea } },
            { id: 'dog', label: 'Dog', picture: { icon: 'dog', color: palette.tangerine } },
            {
              id: 'butterfly',
              label: 'Butterfly',
              picture: { icon: 'butterfly', color: palette.blossom },
            },
          ],
          answerId: 'fish',
        },
        {
          id: 'ani_q2',
          prompt: 'Which one has wings and can fly?',
          choices: [
            { id: 'frog', label: 'Frog', picture: { icon: 'frog', color: palette.leaf } },
            { id: 'bird', label: 'Bird', picture: { icon: 'bird', color: palette.sea } },
            { id: 'cat', label: 'Cat', picture: { icon: 'cat', color: palette.tangerine } },
          ],
          answerId: 'bird',
        },
        {
          id: 'ani_q3',
          prompt: 'Which one is isda? (fish)',
          voice: 'Which one is isda? Isda means fish.',
          choices: [
            { id: 'crab', label: 'Crab', picture: { icon: 'crab', color: palette.coral } },
            { id: 'fish', label: 'Fish', picture: { icon: 'fish', color: palette.sea } },
            { id: 'turtle', label: 'Turtle', picture: { icon: 'turtle', color: palette.leaf } },
          ],
          answerId: 'fish',
        },
        {
          id: 'ani_q4',
          prompt: 'Which one is pusa? (cat)',
          voice: 'Which one is pusa? Pusa means cat.',
          choices: [
            { id: 'cat', label: 'Cat', picture: { icon: 'cat', color: palette.tangerine } },
            { id: 'dog', label: 'Dog', picture: { icon: 'dog', color: palette.coral } },
            { id: 'bird', label: 'Bird', picture: { icon: 'bird', color: palette.sea } },
          ],
          answerId: 'cat',
        },
        {
          id: 'ani_q5',
          prompt: 'Which one is aso? (dog)',
          voice: 'Which one is aso? Aso means dog.',
          choices: [
            { id: 'cat', label: 'Cat', picture: { icon: 'cat', color: palette.tangerine } },
            { id: 'dog', label: 'Dog', picture: { icon: 'dog', color: palette.coral } },
            { id: 'frog', label: 'Frog', picture: { icon: 'frog', color: palette.leaf } },
          ],
          answerId: 'dog',
        },
        {
          id: 'ani_q6',
          prompt: 'Which one is ibon? (bird)',
          voice: 'Which one is ibon? Ibon means bird.',
          choices: [
            { id: 'fish', label: 'Fish', picture: { icon: 'fish', color: palette.sea } },
            { id: 'bee', label: 'Bee', picture: { icon: 'bee', color: palette.sunshine } },
            { id: 'bird', label: 'Bird', picture: { icon: 'bird', color: palette.sea } },
          ],
          answerId: 'bird',
        },
        {
          id: 'ani_q7',
          prompt: 'Which one makes honey?',
          choices: [
            { id: 'cat', label: 'Cat', picture: { icon: 'cat', color: palette.tangerine } },
            { id: 'bee', label: 'Bee', picture: { icon: 'bee', color: palette.sunshine } },
            { id: 'bird', label: 'Bird', picture: { icon: 'bird', color: palette.sea } },
          ],
          answerId: 'bee',
        },
        {
          id: 'ani_q8',
          prompt: 'Which one hops on lily pads?',
          choices: [
            { id: 'frog', label: 'Frog', picture: { icon: 'frog', color: palette.leaf } },
            { id: 'fish', label: 'Fish', picture: { icon: 'fish', color: palette.sea } },
            { id: 'dog', label: 'Dog', picture: { icon: 'dog', color: palette.tangerine } },
          ],
          answerId: 'frog',
        },
      ],
    },
  },

  // 7. Body and Senses
  {
    id: 'act_quiz_body_senses',
    grades: [1, 2],
    subject: 'science',
    kind: 'QUIZ',
    islandId: 'science',
    title: 'Jelly Asks: Body and Senses',
    icon: 'eye',
    color: palette.coral,
    voiceIntro: 'Jelly has some questions for you! Tap the right picture.',
    instruction: 'Tap the right picture.',
    reward: { diamonds: 4, stickerId: 'stk_bird' },
    tags: ['quiz', 'body', 'senses', 'science'],
    data: {
      kind: 'QUIZ',
      pick: 5,
      questions: [
        {
          id: 'body_q1',
          prompt: 'Which one do we see with?',
          choices: [
            { id: 'eye', label: 'Eye', picture: { icon: 'eye', color: palette.sea } },
            { id: 'ear', label: 'Ear', picture: { icon: 'ear', color: palette.blossom } },
            { id: 'hand', label: 'Hand', picture: { icon: 'hand', color: palette.tangerine } },
          ],
          answerId: 'eye',
        },
        {
          id: 'body_q2',
          prompt: 'Which one do we hear with?',
          choices: [
            { id: 'nose', label: 'Nose', picture: { icon: 'nose', color: palette.tangerine } },
            { id: 'ear', label: 'Ear', picture: { icon: 'ear', color: palette.blossom } },
            { id: 'foot', label: 'Foot', picture: { icon: 'foot', color: palette.coral } },
          ],
          answerId: 'ear',
        },
        {
          id: 'body_q3',
          prompt: 'Which one do we smell with?',
          choices: [
            { id: 'mouth', label: 'Mouth', picture: { icon: 'mouth', color: palette.coral } },
            { id: 'nose', label: 'Nose', picture: { icon: 'nose', color: palette.tangerine } },
            { id: 'eye', label: 'Eye', picture: { icon: 'eye', color: palette.sea } },
          ],
          answerId: 'nose',
        },
        {
          id: 'body_q4',
          prompt: 'Which one do we taste food with?',
          choices: [
            { id: 'ear', label: 'Ear', picture: { icon: 'ear', color: palette.blossom } },
            { id: 'mouth', label: 'Mouth', picture: { icon: 'mouth', color: palette.coral } },
            { id: 'foot', label: 'Foot', picture: { icon: 'foot', color: palette.leaf } },
          ],
          answerId: 'mouth',
        },
        {
          id: 'body_q5',
          prompt: 'Which one do we touch things with?',
          choices: [
            { id: 'hand', label: 'Hand', picture: { icon: 'hand', color: palette.tangerine } },
            { id: 'eye', label: 'Eye', picture: { icon: 'eye', color: palette.sea } },
            { id: 'nose', label: 'Nose', picture: { icon: 'nose', color: palette.blossom } },
          ],
          answerId: 'hand',
        },
        {
          id: 'body_q6',
          prompt: 'Which one do we walk with?',
          choices: [
            { id: 'hand', label: 'Hand', picture: { icon: 'hand', color: palette.tangerine } },
            { id: 'ear', label: 'Ear', picture: { icon: 'ear', color: palette.blossom } },
            { id: 'foot', label: 'Foot', picture: { icon: 'foot', color: palette.leaf } },
          ],
          answerId: 'foot',
        },
        {
          id: 'body_q7',
          prompt: 'Which body part do we use to wave hello?',
          choices: [
            { id: 'hand', label: 'Hand', picture: { icon: 'hand', color: palette.sunshine } },
            { id: 'nose', label: 'Nose', picture: { icon: 'nose', color: palette.tangerine } },
            { id: 'ear', label: 'Ear', picture: { icon: 'ear', color: palette.blossom } },
          ],
          answerId: 'hand',
        },
      ],
    },
  },

  // 8. Living Things and Weather
  {
    id: 'act_quiz_living_weather',
    grades: [1, 2],
    subject: 'science',
    kind: 'QUIZ',
    islandId: 'science',
    title: 'Jelly Asks: Living Things',
    icon: 'sun',
    color: palette.sunshine,
    voiceIntro: 'Jelly has some questions for you! Tap the right picture.',
    instruction: 'Tap the right picture.',
    reward: { diamonds: 4, stickerId: 'stk_frog' },
    tags: ['quiz', 'science', 'weather', 'living-things'],
    data: {
      kind: 'QUIZ',
      pick: 5,
      questions: [
        {
          id: 'lw_q1',
          prompt: 'Which one is alive?',
          choices: [
            { id: 'rock', label: 'Rock', picture: { icon: 'rock', color: palette.ink } },
            { id: 'tree', label: 'Tree', picture: { icon: 'tree', color: palette.leaf } },
            { id: 'chair', label: 'Chair', picture: { icon: 'chair', color: palette.tangerine } },
          ],
          answerId: 'tree',
        },
        {
          id: 'lw_q2',
          prompt: 'Which one is NOT alive?',
          choices: [
            { id: 'rock', label: 'Rock', picture: { icon: 'rock', color: palette.ink } },
            { id: 'tree', label: 'Tree', picture: { icon: 'tree', color: palette.leaf } },
            { id: 'fish', label: 'Fish', picture: { icon: 'fish', color: palette.sea } },
          ],
          answerId: 'rock',
        },
        {
          id: 'lw_q3',
          prompt: 'Which one is a living thing?',
          choices: [
            { id: 'fish', label: 'Fish', picture: { icon: 'fish', color: palette.sea } },
            { id: 'boat', label: 'Boat', picture: { icon: 'boat', color: palette.tangerine } },
            { id: 'cup', label: 'Cup', picture: { icon: 'cup', color: palette.lavender } },
          ],
          answerId: 'fish',
        },
        {
          id: 'lw_q4',
          prompt: 'Which one can grow and have babies?',
          choices: [
            { id: 'rock', label: 'Rock', picture: { icon: 'rock', color: palette.ink } },
            { id: 'bird', label: 'Bird', picture: { icon: 'bird', color: palette.sea } },
            { id: 'chair', label: 'Chair', picture: { icon: 'chair', color: palette.tangerine } },
          ],
          answerId: 'bird',
        },
        {
          id: 'lw_q5',
          prompt: 'What do we see on a rainy day?',
          choices: [
            { id: 'sun', label: 'Sun', picture: { icon: 'sun', color: palette.sunshine } },
            { id: 'rain', label: 'Rain', picture: { icon: 'rain', color: palette.sea } },
            { id: 'star', label: 'Star', picture: { icon: 'star', color: palette.lavender } },
          ],
          answerId: 'rain',
        },
        {
          id: 'lw_q6',
          prompt: 'What do we see in the sky on a cloudy day?',
          choices: [
            { id: 'sun', label: 'Sun', picture: { icon: 'sun', color: palette.sunshine } },
            { id: 'cloud', label: 'Cloud', picture: { icon: 'cloud', color: palette.sea } },
            { id: 'moon', label: 'Moon', picture: { icon: 'moon', color: palette.lavender } },
          ],
          answerId: 'cloud',
        },
        {
          id: 'lw_q7',
          prompt: 'What do we need to stay cool on a sunny day?',
          choices: [
            { id: 'hat', label: 'Hat', picture: { icon: 'hat', color: palette.blossom } },
            { id: 'cloud', label: 'Cloud', picture: { icon: 'cloud', color: palette.sea } },
            { id: 'rain', label: 'Rain', picture: { icon: 'rain', color: palette.lavender } },
          ],
          answerId: 'hat',
        },
        {
          id: 'lw_q8',
          prompt: 'What do we see in the sky at night?',
          choices: [
            { id: 'sun', label: 'Sun', picture: { icon: 'sun', color: palette.sunshine } },
            { id: 'cloud', label: 'Cloud', picture: { icon: 'cloud', color: palette.sea } },
            { id: 'moon', label: 'Moon', picture: { icon: 'moon', color: palette.lavender } },
          ],
          answerId: 'moon',
        },
      ],
    },
  },
];
