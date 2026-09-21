import { makeRng } from '../rng';
import { generateWords, scrambleLetters, type GradeWords } from '../words';

const bank: GradeWords = {
  grade: 1,
  spelling: [
    { word: 'cat', icon: 'cat', hint: 'A pet that says meow.' },
    { word: 'sun', icon: 'sun' },
    { word: 'fish', icon: 'fish' },
    { word: 'ball' },
    { word: 'mango' },
  ],
  sentences: ['The cat is big.', 'I see a fish.', 'We like mango.'],
  synonyms: [
    { word: 'big', match: 'large', others: ['small', 'red', 'cold'] },
    { word: 'happy', match: 'glad', others: ['sad', 'tall', 'wet'] },
    { word: 'fast', match: 'quick', others: ['slow', 'blue', 'soft'] },
  ],
  antonyms: [
    { word: 'hot', match: 'cold', others: ['warm', 'big', 'red'] },
    { word: 'up', match: 'down', others: ['over', 'near', 'left'] },
    { word: 'big', match: 'small', others: ['large', 'huge', 'tall'] },
  ],
  partsOfSpeech: [
    { word: 'dog', pos: 'noun', sentence: 'The dog runs.' },
    { word: 'runs', pos: 'verb', sentence: 'The dog runs.' },
    { word: 'red', pos: 'adjective' },
    { word: 'jumps', pos: 'verb' },
  ],
};

describe('word generators', () => {
  it('scramble never returns the original word', () => {
    const rng = makeRng('x');
    for (const w of ['cat', 'mango', 'ab', 'book'])
      expect(scrambleLetters(rng, w).join('')).not.toBe(w);
    expect(scrambleLetters(rng, 'aaa').join('')).toBe('aaa'); // only one arrangement exists
  });

  it('spell: letters are a permutation of the word', () => {
    for (const q of generateWords(bank, 'spell', 5, 's')) {
      if (q.mode !== 'spell') throw new Error('mode');
      expect([...q.letters].sort().join('')).toBe([...q.word].sort().join(''));
    }
  });

  it('missing: the hidden letter is among the choices exactly once', () => {
    for (const q of generateWords(bank, 'missing', 5, 's')) {
      if (q.mode !== 'missing') throw new Error('mode');
      const letter = q.word[q.index]!;
      expect(q.choices.filter((c) => c === letter)).toHaveLength(1);
      expect(q.choices).toHaveLength(4);
    }
  });

  it('unscramble: words are a permutation and never already in order', () => {
    for (const q of generateWords(bank, 'unscramble', 3, 's')) {
      if (q.mode !== 'unscramble') throw new Error('mode');
      expect([...q.words].sort()).toEqual(q.sentence.split(' ').sort());
      expect(q.words.join(' ')).not.toBe(q.sentence);
    }
  });

  it('synonym/antonym/partOfSpeech: answer is in choices, choices unique', () => {
    for (const mode of ['synonym', 'antonym', 'partOfSpeech'] as const) {
      const qs = generateWords(bank, mode, 3, 's');
      expect(qs.length).toBe(3);
      for (const q of qs) {
        if (q.mode === 'spell' || q.mode === 'missing' || q.mode === 'unscramble')
          throw new Error('mode');
        expect(q.choices).toContain(q.answer);
        expect(new Set(q.choices).size).toBe(q.choices.length);
      }
    }
  });

  it('is deterministic per seed', () => {
    expect(generateWords(bank, 'spell', 4, 'k')).toEqual(generateWords(bank, 'spell', 4, 'k'));
  });
});
