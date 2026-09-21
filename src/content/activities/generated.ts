import type { ActivityDefinition, WordsMode } from '@/domain/activity/schema';
import { MATH_GENERATORS } from '@/domain/generators/math';
import { wordsAvailable } from '@/domain/generators/words';
import { palette } from '@/theme';

import { wordsForGrade } from '../words';

/**
 * Procedurally generated activities: one MATH activity per (generator × grade) and one
 * WORDS activity per (mode × grade) where the grade's word bank supports it. Endless
 * practice — every play is a fresh, seeded set of questions.
 */
const MATH_ICON: Record<string, string> = {
  addition: 'numbers',
  subtraction: 'numbers',
  compare: 'starfish',
  skipCount: 'sparkle',
  placeValue: 'chest',
  multiplication: 'numbers',
  division: 'spoon',
  fractions: 'circle',
  time: 'sun',
  money: 'gift',
  decimals: 'diamond',
  percent: 'rainbow',
  areaPerimeter: 'square',
  integers: 'moon',
  orderOfOps: 'flask',
  ratios: 'ball',
  exponents: 'star',
  volume: 'cup',
  wordProblem: 'book',
};

const MATH_COLORS = [
  palette.sea,
  palette.aqua,
  palette.leaf,
  palette.lavender,
  palette.tangerine,
  palette.blossom,
];

const WORD_MODES: {
  mode: WordsMode;
  title: string;
  icon: string;
  voice: string;
  instruction: string;
}[] = [
  {
    mode: 'spell',
    title: 'Spell It',
    icon: 'abc',
    voice: 'Tap the letters in order to spell the word.',
    instruction: 'Tap the letters in order.',
  },
  {
    mode: 'missing',
    title: 'Missing Letter',
    icon: 'abc',
    voice: 'One letter is hiding! Tap the letter that is missing.',
    instruction: 'Tap the missing letter.',
  },
  {
    mode: 'unscramble',
    title: 'Fix the Sentence',
    icon: 'book',
    voice: 'The words are mixed up! Tap them in the right order.',
    instruction: 'Tap the words in order.',
  },
  {
    mode: 'synonym',
    title: 'Same Meaning',
    icon: 'heart',
    voice: 'Which word means the same? Tap it!',
    instruction: 'Tap the word that means the same.',
  },
  {
    mode: 'antonym',
    title: 'Opposites',
    icon: 'moon',
    voice: 'Which word means the opposite? Tap it!',
    instruction: 'Tap the opposite.',
  },
  {
    mode: 'partOfSpeech',
    title: 'Word Kinds',
    icon: 'abc',
    voice: 'Is it a noun, a verb, or something else? Tap the kind of word.',
    instruction: 'Tap the kind of word.',
  },
];

const WORD_COLORS = [
  palette.blossom,
  palette.lavender,
  palette.aqua,
  palette.sunshine,
  palette.leaf,
  palette.tangerine,
];

function buildMath(): ActivityDefinition[] {
  const out: ActivityDefinition[] = [];
  for (const spec of MATH_GENERATORS) {
    for (const grade of spec.grades) {
      out.push({
        id: `act_math_${spec.id.toLowerCase()}_g${grade}`,
        kind: 'MATH',
        islandId: 'numbers',
        subject: 'math',
        grades: [grade],
        title: `${spec.title}`,
        icon: MATH_ICON[spec.id] ?? 'numbers',
        color: MATH_COLORS[(grade - 1) % MATH_COLORS.length]!,
        voiceIntro: `Let's practise ${spec.title.toLowerCase()}! Every round is new.`,
        instruction:
          grade < spec.keypadFrom ? 'Tap the right answer.' : 'Type the answer, then tap Check.',
        reward: { diamonds: Math.min(8, 3 + grade) },
        tags: ['math', spec.id, `grade-${grade}`, 'generated'],
        data: { kind: 'MATH', generator: spec.id, grade, rounds: 6, input: 'auto' },
      });
    }
  }
  return out;
}

function buildWords(): ActivityDefinition[] {
  const out: ActivityDefinition[] = [];
  for (let grade = 1; grade <= 6; grade += 1) {
    const bank = wordsForGrade(grade);
    for (const [i, m] of WORD_MODES.entries()) {
      if (!wordsAvailable(bank, m.mode)) continue;
      out.push({
        id: `act_words_${m.mode.toLowerCase()}_g${grade}`,
        kind: 'WORDS',
        islandId: 'letters',
        subject: 'english',
        grades: [grade],
        title: m.title,
        icon: m.icon,
        color: WORD_COLORS[i % WORD_COLORS.length]!,
        voiceIntro: m.voice,
        instruction: m.instruction,
        reward: { diamonds: Math.min(8, 3 + grade) },
        tags: ['english', m.mode, `grade-${grade}`, 'generated'],
        data: { kind: 'WORDS', mode: m.mode, grade, rounds: 6 },
      });
    }
  }
  return out;
}

export const generatedActivities: ActivityDefinition[] = [...buildMath(), ...buildWords()];
