import type { WordsMode } from '../activity/schema';
import { int, makeRng, pick, shuffleWith, type Rng } from './rng';

/**
 * Word activities built from grade word lists (content/words). Pure and seeded.
 *
 * spell        — letters of a word are scrambled; the child taps them in order.
 * missing      — one letter is hidden; pick the right letter from 4.
 * unscramble   — words of a short sentence are scrambled; tap them in order.
 * synonym      — pick the word that means the same.
 * antonym      — pick the word that means the opposite.
 * partOfSpeech — is this word a noun, verb, adjective…?
 */

export interface WordEntry {
  word: string;
  /** Icon name when a picture helps (early grades). */
  icon?: string;
  /** Short kid-friendly hint / meaning. */
  hint?: string;
}

export interface WordPair {
  word: string;
  match: string;
  /** Wrong options. */
  others: string[];
}

export interface PosEntry {
  word: string;
  pos: 'noun' | 'verb' | 'adjective' | 'adverb' | 'pronoun' | 'preposition';
  sentence?: string;
}

export interface GradeWords {
  grade: number;
  spelling: WordEntry[];
  sentences: string[];
  synonyms: WordPair[];
  antonyms: WordPair[];
  partsOfSpeech: PosEntry[];
}

export type WordsQuestion =
  | { id: string; mode: 'spell'; word: string; letters: string[]; icon?: string; hint?: string }
  | {
      id: string;
      mode: 'missing';
      word: string;
      index: number;
      choices: string[];
      icon?: string;
      hint?: string;
    }
  | { id: string; mode: 'unscramble'; sentence: string; words: string[] }
  | { id: string; mode: 'synonym' | 'antonym'; word: string; answer: string; choices: string[] }
  | {
      id: string;
      mode: 'partOfSpeech';
      word: string;
      sentence?: string;
      answer: string;
      choices: string[];
    };

const POS_CHOICES = ['noun', 'verb', 'adjective', 'adverb', 'pronoun', 'preposition'];

export function wordsAvailable(bank: GradeWords, mode: WordsMode): boolean {
  switch (mode) {
    case 'spell':
    case 'missing':
      return bank.spelling.length >= 4;
    case 'unscramble':
      return bank.sentences.length >= 3;
    case 'synonym':
      return bank.synonyms.length >= 3;
    case 'antonym':
      return bank.antonyms.length >= 3;
    case 'partOfSpeech':
      return bank.partsOfSpeech.length >= 4;
  }
}

export function generateWords(
  bank: GradeWords,
  mode: WordsMode,
  rounds: number,
  seed: string,
): WordsQuestion[] {
  const rng = makeRng(`${mode}|${bank.grade}|${seed}`);
  const out: WordsQuestion[] = [];
  switch (mode) {
    case 'spell': {
      for (const [i, e] of shuffleWith(rng, bank.spelling).slice(0, rounds).entries()) {
        out.push({
          id: `spell-${i}`,
          mode,
          word: e.word,
          letters: scrambleLetters(rng, e.word),
          ...(e.icon ? { icon: e.icon } : {}),
          ...(e.hint ? { hint: e.hint } : {}),
        });
      }
      return out;
    }
    case 'missing': {
      for (const [i, e] of shuffleWith(rng, bank.spelling).slice(0, rounds).entries()) {
        const index = int(rng, 0, e.word.length - 1);
        const correct = e.word[index]!;
        const pool = 'abcdefghijklmnopqrstuvwxyz'
          .split('')
          .filter((l) => l !== correct.toLowerCase());
        const wrong = shuffleWith(rng, pool).slice(0, 3);
        out.push({
          id: `missing-${i}`,
          mode,
          word: e.word,
          index,
          choices: shuffleWith(rng, [correct, ...wrong]),
          ...(e.icon ? { icon: e.icon } : {}),
          ...(e.hint ? { hint: e.hint } : {}),
        });
      }
      return out;
    }
    case 'unscramble': {
      for (const [i, s] of shuffleWith(rng, bank.sentences).slice(0, rounds).entries()) {
        const words = s.split(' ');
        let shuffled = shuffleWith(rng, words);
        if (shuffled.join(' ') === s && words.length > 1)
          shuffled = [...shuffled.slice(1), shuffled[0]!];
        out.push({ id: `unscramble-${i}`, mode, sentence: s, words: shuffled });
      }
      return out;
    }
    case 'synonym':
    case 'antonym': {
      const pairs = mode === 'synonym' ? bank.synonyms : bank.antonyms;
      for (const [i, p] of shuffleWith(rng, pairs).slice(0, rounds).entries()) {
        out.push({
          id: `${mode}-${i}`,
          mode,
          word: p.word,
          answer: p.match,
          choices: shuffleWith(rng, [p.match, ...p.others.slice(0, 3)]),
        });
      }
      return out;
    }
    case 'partOfSpeech': {
      for (const [i, e] of shuffleWith(rng, bank.partsOfSpeech).slice(0, rounds).entries()) {
        const present = new Set(bank.partsOfSpeech.map((x) => x.pos));
        const pool = POS_CHOICES.filter((c) => c !== e.pos && present.has(c as PosEntry['pos']));
        const wrong = shuffleWith(
          rng,
          pool.length >= 2 ? pool : POS_CHOICES.filter((c) => c !== e.pos),
        ).slice(0, 2);
        out.push({
          id: `pos-${i}`,
          mode,
          word: e.word,
          ...(e.sentence ? { sentence: e.sentence } : {}),
          answer: e.pos,
          choices: shuffleWith(rng, [e.pos, ...wrong]),
        });
      }
      return out;
    }
  }
}

/** Scramble letters so the result is never the word itself (for words with ≥2 distinct letters). */
export function scrambleLetters(rng: Rng, word: string): string[] {
  const letters = word.split('');
  let out = shuffleWith(rng, letters);
  let guard = 0;
  while (out.join('') === word && new Set(letters).size > 1 && guard < 10) {
    out = shuffleWith(rng, letters);
    guard += 1;
  }
  if (out.join('') === word && letters.length > 1) out = [...out.slice(1), out[0]!];
  return out;
}

export { pick };
