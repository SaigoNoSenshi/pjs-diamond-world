import { gradeWords, wordsForGrade } from '@/content/words';
import { generateWords, wordsAvailable } from '@/domain/generators/words';
import type { GradeWords, WordsQuestion } from '@/domain/generators/words';

const ALLOWED_ICONS = new Set([
  'fish',
  'crab',
  'turtle',
  'octopus',
  'starfish',
  'whale',
  'seahorse',
  'sun',
  'moon',
  'cloud',
  'rain',
  'tree',
  'house',
  'boat',
  'apple',
  'banana',
  'mango',
  'coconut',
  'carrot',
  'rice',
  'cat',
  'dog',
  'bird',
  'frog',
  'butterfly',
  'bee',
  'ball',
  'cup',
  'chair',
  'rock',
  'spoon',
  'jeepney',
  'eye',
  'ear',
  'hand',
  'nose',
  'mouth',
  'foot',
  'hat',
  'shirt',
  'gift',
  'flower',
  'leaf',
  'star',
  'heart',
  'diamond',
  'crown',
  'robot',
  'pig',
  'shell',
  'book',
]);

const VALID_POS = new Set<string>([
  'noun',
  'verb',
  'adjective',
  'adverb',
  'pronoun',
  'preposition',
]);

const SYNONYM_ANTONYM_COUNTS: Record<number, number> = {
  1: 6,
  2: 6,
  3: 12,
  4: 15,
  5: 15,
  6: 15,
};

const POS_COUNTS: Record<number, number> = {
  1: 8,
  2: 8,
  3: 12,
  4: 15,
  5: 18,
  6: 18,
};

const WORDS_MODES = [
  'spell',
  'missing',
  'unscramble',
  'synonym',
  'antonym',
  'partOfSpeech',
] as const;

describe('gradeWords content bank', () => {
  for (let grade = 1; grade <= 6; grade++) {
    describe(`Grade ${grade}`, () => {
      const bank: GradeWords = gradeWords[grade] as GradeWords;

      it('has correct grade value', () => {
        expect(bank.grade).toBe(grade);
      });

      it('has exactly 30 spelling words', () => {
        expect(bank.spelling).toHaveLength(30);
      });

      it('has exactly 12 sentences', () => {
        expect(bank.sentences).toHaveLength(12);
      });

      it(`has ${SYNONYM_ANTONYM_COUNTS[grade]} synonym pairs`, () => {
        expect(bank.synonyms).toHaveLength(SYNONYM_ANTONYM_COUNTS[grade]!);
      });

      it(`has ${SYNONYM_ANTONYM_COUNTS[grade]} antonym pairs`, () => {
        expect(bank.antonyms).toHaveLength(SYNONYM_ANTONYM_COUNTS[grade]!);
      });

      it(`has ${POS_COUNTS[grade]} partsOfSpeech entries`, () => {
        expect(bank.partsOfSpeech).toHaveLength(POS_COUNTS[grade]!);
      });

      it('all spelling words match /^[a-z]{3,11}$/', () => {
        for (const entry of bank.spelling) {
          expect(entry.word).toMatch(/^[a-z]{3,11}$/);
        }
      });

      it('all icons are from the allowed list', () => {
        for (const entry of bank.spelling) {
          if (entry.icon !== undefined) {
            expect(ALLOWED_ICONS.has(entry.icon)).toBe(true);
          }
        }
      });

      it('synonym others arrays each have 3 entries and none equal match', () => {
        for (const pair of bank.synonyms) {
          expect(pair.others).toHaveLength(3);
          for (const other of pair.others) {
            expect(other).not.toBe(pair.match);
          }
        }
      });

      it('antonym others arrays each have 3 entries and none equal match', () => {
        for (const pair of bank.antonyms) {
          expect(pair.others).toHaveLength(3);
          for (const other of pair.others) {
            expect(other).not.toBe(pair.match);
          }
        }
      });

      it('all pos values are valid', () => {
        for (const entry of bank.partsOfSpeech) {
          expect(VALID_POS.has(entry.pos)).toBe(true);
        }
      });

      it('no duplicate spelling words within grade', () => {
        const words = bank.spelling.map((e) => e.word);
        const unique = new Set(words);
        expect(unique.size).toBe(words.length);
      });

      it('generateWords returns 6 questions for each available mode', () => {
        for (const mode of WORDS_MODES) {
          if (wordsAvailable(bank, mode)) {
            const questions: WordsQuestion[] = generateWords(bank, mode, 6, 'seed');
            expect(questions).toHaveLength(6);
          }
        }
      });
    });
  }

  describe('wordsForGrade', () => {
    it('clamps to grade 1 for values below 1', () => {
      expect(wordsForGrade(0).grade).toBe(1);
      expect(wordsForGrade(-5).grade).toBe(1);
    });

    it('clamps to grade 6 for values above 6', () => {
      expect(wordsForGrade(7).grade).toBe(6);
      expect(wordsForGrade(100).grade).toBe(6);
    });

    it('returns correct grade for valid grades 1–6', () => {
      for (let g = 1; g <= 6; g++) {
        expect(wordsForGrade(g).grade).toBe(g);
      }
    });
  });
});
