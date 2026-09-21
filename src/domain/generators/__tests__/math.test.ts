import { mathGeneratorIdSchema } from '@/domain/activity/schema';

import { generateMath, generatorSpec, MATH_GENERATORS, simplify } from '../math';

/** Independent evaluator for arithmetic prompts of the form "a op b = ?". */
function evalPrompt(prompt: string): number | null {
  const m = /^(\(?-?\d+\)?) ([+−×÷]) (\(?-?\d+\)?) = \?$/.exec(prompt);
  if (!m) return null;
  const a = Number(m[1]!.replace(/[()]/g, ''));
  const b = Number(m[3]!.replace(/[()]/g, ''));
  switch (m[2]) {
    case '+':
      return a + b;
    case '−':
      return a - b;
    case '×':
      return a * b;
    case '÷':
      return a / b;
  }
  return null;
}

describe('math generators', () => {
  it('cover every generator id in the schema', () => {
    expect(MATH_GENERATORS.map((g) => g.id).sort()).toEqual(
      [...mathGeneratorIdSchema.options].sort(),
    );
  });

  it('are deterministic per seed and produce the requested rounds for every grade', () => {
    for (const spec of MATH_GENERATORS) {
      for (const grade of spec.grades) {
        const a = generateMath(spec.id, grade, 6, 'seed-1');
        const b = generateMath(spec.id, grade, 6, 'seed-1');
        const c = generateMath(spec.id, grade, 6, 'seed-2');
        expect(a).toEqual(b);
        expect(a).toHaveLength(6);
        expect(a.map((q) => q.prompt)).not.toEqual(c.map((q) => q.prompt));
        for (const q of a) {
          expect(q.answer.length).toBeGreaterThan(0);
          if (q.choices) {
            expect(q.choices).toContain(q.answer);
            expect(new Set(q.choices).size).toBe(q.choices.length);
            expect(q.choices.length).toBeGreaterThanOrEqual(2);
          }
        }
      }
    }
  });

  it('arithmetic answers are correct (independent evaluation)', () => {
    for (const id of [
      'addition',
      'subtraction',
      'multiplication',
      'division',
      'integers',
    ] as const) {
      for (const grade of generatorSpec(id).grades) {
        for (const q of generateMath(id, grade, 8, `check-${grade}`)) {
          const expected = evalPrompt(q.prompt);
          expect(expected).not.toBeNull();
          expect(Number(q.answer)).toBe(expected);
        }
      }
    }
  });

  it('uses choices for early grades and a keypad from grade 3 for arithmetic', () => {
    expect(generateMath('addition', 1, 3, 's').every((q) => q.choices)).toBe(true);
    expect(generateMath('addition', 3, 3, 's').every((q) => !q.choices)).toBe(true);
    expect(generateMath('addition', 3, 3, 's', 'choice').every((q) => q.choices)).toBe(true);
    // Compare/fractions/time always show choices regardless of grade.
    expect(generateMath('fractions', 5, 3, 's').every((q) => q.choices)).toBe(true);
  });

  it('keeps grade 1 numbers small and grade 6 exponents right', () => {
    for (const q of generateMath('addition', 1, 10, 'g1'))
      expect(Number(q.answer)).toBeLessThanOrEqual(20);
    for (const q of generateMath('exponents', 6, 6, 'g6')) {
      const m = /^(\d+)\^(\d+) = \?$/.exec(q.prompt)!;
      expect(Number(q.answer)).toBe(Number(m[1]) ** Number(m[2]));
    }
    for (const q of generateMath('percent', 5, 6, 'p')) {
      const m = /^(\d+)% of (\d+) = \?$/.exec(q.prompt)!;
      expect(Number(q.answer)).toBe((Number(m[1]) * Number(m[2])) / 100);
    }
  });

  it('simplifies fractions', () => {
    expect(simplify(6, 8)).toBe('3/4');
    expect(simplify(4, 4)).toBe('1');
    expect(simplify(3, 5)).toBe('3/5');
  });
});
