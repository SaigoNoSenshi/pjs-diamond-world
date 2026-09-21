import type { MathGeneratorId } from '../activity/schema';
import { distractors, int, makeRng, pick, shuffleWith, type Rng } from './rng';

/**
 * Procedural math for Grades 1–6 (DepEd K-12 scope, simplified). Pure functions:
 * same seed → same questions, so a round is reproducible and testable.
 *
 * Every question carries the correct answer as a number (or a short string for
 * fractions/time), optional multiple-choice values, and child-friendly prompt + voice.
 */

export interface MathQuestion {
  id: string;
  prompt: string;
  voice?: string;
  /** Canonical answer as text ("7", "3/4", "2:30"). */
  answer: string;
  /** When present the engine shows cards; otherwise a keypad. */
  choices?: string[];
  /** Small visual hint: repeat an icon n times (counting-style), when useful. */
  visual?: { icon: string; count: number } | undefined;
}

export interface GeneratorSpec {
  id: MathGeneratorId;
  title: string;
  /** Grades this generator is meaningful for. */
  grades: readonly number[];
  /** True when answers are best typed on a keypad from this grade up. */
  keypadFrom: number;
}

export const MATH_GENERATORS: readonly GeneratorSpec[] = [
  { id: 'addition', title: 'Adding', grades: [1, 2, 3, 4], keypadFrom: 3 },
  { id: 'subtraction', title: 'Taking Away', grades: [1, 2, 3, 4], keypadFrom: 3 },
  { id: 'compare', title: 'Bigger or Smaller?', grades: [1, 2, 3], keypadFrom: 9 },
  { id: 'skipCount', title: 'Skip Counting', grades: [1, 2, 3], keypadFrom: 3 },
  { id: 'placeValue', title: 'Tens and Ones', grades: [1, 2, 3, 4], keypadFrom: 3 },
  { id: 'multiplication', title: 'Times Tables', grades: [2, 3, 4, 5], keypadFrom: 3 },
  { id: 'division', title: 'Sharing Equally', grades: [3, 4, 5], keypadFrom: 3 },
  { id: 'fractions', title: 'Fractions', grades: [2, 3, 4, 5, 6], keypadFrom: 9 },
  { id: 'time', title: 'Telling Time', grades: [1, 2, 3], keypadFrom: 9 },
  { id: 'money', title: 'Peso Money', grades: [1, 2, 3, 4], keypadFrom: 3 },
  { id: 'decimals', title: 'Decimals', grades: [4, 5, 6], keypadFrom: 9 },
  { id: 'percent', title: 'Percent', grades: [5, 6], keypadFrom: 5 },
  { id: 'areaPerimeter', title: 'Area and Perimeter', grades: [3, 4, 5, 6], keypadFrom: 3 },
  { id: 'integers', title: 'Positive and Negative', grades: [6], keypadFrom: 9 },
  { id: 'orderOfOps', title: 'Order of Operations', grades: [5, 6], keypadFrom: 5 },
  { id: 'ratios', title: 'Ratios', grades: [5, 6], keypadFrom: 9 },
  { id: 'exponents', title: 'Powers', grades: [6], keypadFrom: 6 },
  { id: 'volume', title: 'Volume', grades: [5, 6], keypadFrom: 5 },
  { id: 'wordProblem', title: 'Story Problems', grades: [1, 2, 3, 4, 5, 6], keypadFrom: 3 },
];

export function generatorSpec(id: MathGeneratorId): GeneratorSpec {
  return MATH_GENERATORS.find((g) => g.id === id)!;
}

const COUNT_ICONS = ['fish', 'star', 'shell', 'apple', 'mango', 'flower'];

/** Unique answer cards: the answer plus up to three distinct wrong options (fillers used when needed). */
function pickChoices(
  rng: Rng,
  answer: string,
  wrong: readonly string[],
  fillers: readonly string[] = [],
): string[] {
  const set = new Set<string>();
  for (const w of wrong) if (w !== answer) set.add(w);
  for (const f of fillers) {
    if (set.size >= 3) break;
    if (f !== answer) set.add(f);
  }
  return shuffleWith(rng, [answer, ...[...set].slice(0, 3)]);
}

function choiceSet(
  rng: Rng,
  answer: number,
  opts?: { min?: number; max?: number; step?: number },
): string[] {
  return shuffleWith(rng, [answer, ...distractors(rng, answer, 3, opts)]).map(String);
}

function withChoices(
  q: Omit<MathQuestion, 'choices'>,
  rng: Rng,
  useChoices: boolean,
  opts?: { min?: number; max?: number; step?: number },
): MathQuestion {
  if (!useChoices) return q;
  return { ...q, choices: choiceSet(rng, Number(q.answer), opts) };
}

export function generateMath(
  generator: MathGeneratorId,
  grade: number,
  rounds: number,
  seed: string,
  input: 'choice' | 'keypad' | 'auto' = 'auto',
): MathQuestion[] {
  const rng = makeRng(`${generator}|${grade}|${seed}`);
  const spec = generatorSpec(generator);
  const useChoices = input === 'choice' || (input === 'auto' && grade < spec.keypadFrom);
  const out: MathQuestion[] = [];
  const seen = new Set<string>();
  let guard = 0;
  while (out.length < rounds && guard < rounds * 20) {
    guard += 1;
    const q = one(generator, grade, rng, useChoices, `${generator}-${out.length}`);
    if (seen.has(q.prompt)) continue;
    seen.add(q.prompt);
    out.push(q);
  }
  // Tiny pools (e.g. halves and quarters in Grade 2) legitimately repeat.
  while (out.length < rounds) {
    out.push(one(generator, grade, rng, useChoices, `${generator}-${out.length}`));
  }
  return out;
}

function one(
  g: MathGeneratorId,
  grade: number,
  rng: Rng,
  choices: boolean,
  id: string,
): MathQuestion {
  switch (g) {
    case 'addition': {
      const max = grade === 1 ? 10 : grade === 2 ? 20 : grade === 3 ? 100 : 1000;
      const a = int(rng, grade === 1 ? 1 : 2, max);
      const b = int(rng, 1, Math.max(1, max - a));
      const visual =
        grade === 1 && a + b <= 10 ? { icon: pick(rng, COUNT_ICONS), count: a + b } : undefined;
      return withChoices(
        {
          id,
          prompt: `${a} + ${b} = ?`,
          voice: `What is ${a} plus ${b}?`,
          answer: String(a + b),
          visual,
        },
        rng,
        choices,
        { min: 0, max: max * 2 },
      );
    }
    case 'subtraction': {
      const max = grade === 1 ? 10 : grade === 2 ? 20 : grade === 3 ? 100 : 1000;
      const a = int(rng, 2, max);
      const b = int(rng, 1, a);
      return withChoices(
        { id, prompt: `${a} − ${b} = ?`, voice: `What is ${a} minus ${b}?`, answer: String(a - b) },
        rng,
        choices,
        { min: 0, max },
      );
    }
    case 'compare': {
      const max = grade === 1 ? 20 : grade === 2 ? 100 : 1000;
      let a = int(rng, 0, max);
      let b = int(rng, 0, max);
      if (a === b) b = Math.min(max, a + 1);
      const bigger = Math.max(a, b);
      const q = {
        id,
        prompt: `Which is bigger: ${a} or ${b}?`,
        voice: `Which number is bigger, ${a} or ${b}?`,
        answer: String(bigger),
      };
      return { ...q, choices: shuffleWith(rng, [String(a), String(b)]) };
    }
    case 'skipCount': {
      const step =
        grade === 1
          ? pick(rng, [1, 2, 10])
          : grade === 2
            ? pick(rng, [2, 5, 10])
            : pick(rng, [3, 4, 5, 25, 50]);
      const start = step * int(rng, 0, grade === 1 ? 4 : 10);
      const seq = [start, start + step, start + 2 * step, start + 3 * step];
      return withChoices(
        {
          id,
          prompt: `${seq.slice(0, 3).join(', ')}, ?`,
          voice: `${seq.slice(0, 3).join(', ')}. What comes next?`,
          answer: String(seq[3]),
        },
        rng,
        choices,
        { min: 0, step, max: seq[3]! + step * 3 },
      );
    }
    case 'placeValue': {
      if (grade <= 2) {
        const tens = int(rng, 1, 9);
        const ones = int(rng, 0, 9);
        const n = tens * 10 + ones;
        const askTens = rng() < 0.5;
        return withChoices(
          {
            id,
            prompt: `In ${n}, how many ${askTens ? 'tens' : 'ones'}?`,
            voice: `In the number ${n}, how many ${askTens ? 'tens' : 'ones'} are there?`,
            answer: String(askTens ? tens : ones),
          },
          rng,
          choices,
          { min: 0, max: 9 },
        );
      }
      const n = int(rng, 100, grade === 3 ? 999 : 99999);
      const places = ['ones', 'tens', 'hundreds', 'thousands', 'ten thousands'];
      const digits = String(n).split('').reverse();
      const pi = int(rng, 0, digits.length - 1);
      return withChoices(
        {
          id,
          prompt: `What digit is in the ${places[pi]} place of ${n}?`,
          voice: `Which digit is in the ${places[pi]} place of ${n}?`,
          answer: digits[pi]!,
        },
        rng,
        choices,
        { min: 0, max: 9 },
      );
    }
    case 'multiplication': {
      const maxFactor = grade === 2 ? 5 : grade === 3 ? 10 : 12;
      const a = int(rng, grade === 2 ? 2 : 2, maxFactor);
      const b = grade === 2 ? pick(rng, [2, 5, 10]) : int(rng, 2, maxFactor);
      if (grade >= 5 && rng() < 0.4) {
        const big = int(rng, 12, 99);
        const small = int(rng, 3, 12);
        return withChoices(
          {
            id,
            prompt: `${big} × ${small} = ?`,
            voice: `What is ${big} times ${small}?`,
            answer: String(big * small),
          },
          rng,
          choices,
          { min: 0, max: big * small * 2 },
        );
      }
      return withChoices(
        { id, prompt: `${a} × ${b} = ?`, voice: `What is ${a} times ${b}?`, answer: String(a * b) },
        rng,
        choices,
        { min: 0, max: maxFactor * maxFactor + 10 },
      );
    }
    case 'division': {
      const maxFactor = grade === 3 ? 10 : 12;
      const b = int(rng, 2, maxFactor);
      const q = int(rng, 1, grade >= 5 ? 25 : maxFactor);
      return withChoices(
        {
          id,
          prompt: `${b * q} ÷ ${b} = ?`,
          voice: `What is ${b * q} divided by ${b}?`,
          answer: String(q),
        },
        rng,
        choices,
        { min: 0, max: 30 },
      );
    }
    case 'fractions': {
      if (grade <= 3) {
        const den = pick(rng, grade === 2 ? [2, 4] : [2, 3, 4, 6, 8]);
        const num = int(rng, 1, den - 1);
        const wrong = [
          `${num}/${den + 2}`,
          `${den - num}/${den}`,
          `${Math.min(den, num + 1)}/${den}`,
          `${num}/${Math.max(2, den - 1)}`,
        ];
        return {
          id,
          prompt: `${num} out of ${den} parts are shaded. Which fraction is that?`,
          voice: `${num} out of ${den} equal parts are shaded. Which fraction is that?`,
          answer: `${num}/${den}`,
          choices: pickChoices(rng, `${num}/${den}`, wrong, [
            `1/${den + 1}`,
            `${num + 2}/${den + 3}`,
            `2/${den + 4}`,
          ]),
          visual: { icon: 'circle', count: den },
        };
      }
      if (grade === 4) {
        const den = pick(rng, [2, 3, 4, 5]);
        const k = pick(rng, [2, 3]);
        const num = int(rng, 1, den - 1);
        const ans = `${num * k}/${den * k}`;
        const wrong = [
          `${num * k}/${den}`,
          `${num}/${den * k}`,
          `${num * k + 1}/${den * k}`,
          `${num * k}/${den * k + 1}`,
        ];
        return {
          id,
          prompt: `Which fraction equals ${num}/${den}?`,
          voice: `Which fraction is equal to ${num} over ${den}?`,
          answer: ans,
          choices: pickChoices(rng, ans, wrong),
        };
      }
      // Grades 5–6: add / subtract like denominators or simplify.
      const den = pick(rng, [4, 5, 6, 8, 10, 12]);
      const a = int(rng, 1, den - 1);
      const b = int(rng, 1, den - a);
      const sum = a + b;
      const ans = simplify(sum, den);
      const wrong = [`${sum}/${den * 2}`, `${sum + 1}/${den}`, `${a}/${den}`, `${sum}/${den + 1}`];
      return {
        id,
        prompt: `${a}/${den} + ${b}/${den} = ? (simplest form)`,
        voice: `${a} over ${den} plus ${b} over ${den}. Give the answer in simplest form.`,
        answer: ans,
        choices: pickChoices(rng, ans, wrong),
      };
    }
    case 'time': {
      const h = int(rng, 1, 12);
      const m = grade === 1 ? 0 : grade === 2 ? pick(rng, [0, 30]) : pick(rng, [0, 15, 30, 45]);
      const fmt = (hh: number, mm: number) => `${hh}:${String(mm).padStart(2, '0')}`;
      const ans = fmt(h, m);
      const wrong = [
        fmt((h % 12) + 1, m),
        fmt(h, (m + 30) % 60),
        fmt(((h + 5) % 12) + 1, m),
      ].filter((w) => w !== ans);
      const words =
        m === 0
          ? `${h} o'clock`
          : m === 30
            ? `half past ${h}`
            : m === 15
              ? `quarter past ${h}`
              : `quarter to ${(h % 12) + 1}`;
      return {
        id,
        prompt: `The clock says ${words}. Which time is it?`,
        voice: `The clock says ${words}. Which time is it?`,
        answer: ans,
        choices: pickChoices(rng, ans, wrong),
      };
    }
    case 'money': {
      const coins =
        grade === 1 ? [1, 5, 10] : grade === 2 ? [1, 5, 10, 20] : [1, 5, 10, 20, 50, 100];
      const n = int(rng, 2, grade === 1 ? 3 : 4);
      const picked = Array.from({ length: n }, () => pick(rng, coins));
      const total = picked.reduce((s, c) => s + c, 0);
      const list = picked.map((c) => `₱${c}`).join(' + ');
      return withChoices(
        {
          id,
          prompt: `${list} = ₱?`,
          voice: `You have ${picked.map((c) => `${c} pesos`).join(', ')}. How many pesos in all?`,
          answer: String(total),
        },
        rng,
        choices,
        { min: 0, max: total * 2, step: 5 },
      );
    }
    case 'decimals': {
      if (grade === 4) {
        const tenths = int(rng, 1, 9);
        const whole = int(rng, 0, 9);
        const ans = `${whole}.${tenths}`;
        const wrong = [
          `${whole}.${(tenths + 1) % 10}`,
          `${tenths}.${whole}`,
          `${whole}${tenths}`,
          `${whole + 1}.${tenths}`,
          `${whole}.${(tenths + 2) % 10}`,
        ];
        return {
          id,
          prompt: `${whole} and ${tenths} tenths as a decimal?`,
          voice: `${whole} and ${tenths} tenths. Write it as a decimal.`,
          answer: ans,
          choices: pickChoices(rng, ans, wrong),
        };
      }
      const a = int(rng, 1, 99) / 10;
      const b = int(rng, 1, 99) / 10;
      const ans = (Math.round((a + b) * 10) / 10).toFixed(1);
      const wrong = [
        (Math.round((a + b + 1) * 10) / 10).toFixed(1),
        (Math.round((a + b - 0.1) * 10) / 10).toFixed(1),
        (Math.round(a * b * 10) / 10).toFixed(1),
        (Math.round((a + b + 0.2) * 10) / 10).toFixed(1),
      ];
      return {
        id,
        prompt: `${a.toFixed(1)} + ${b.toFixed(1)} = ?`,
        voice: `${a.toFixed(1)} plus ${b.toFixed(1)}?`,
        answer: ans,
        choices: pickChoices(rng, ans, wrong),
      };
    }
    case 'percent': {
      const pct = pick(rng, [10, 20, 25, 50, 75]);
      const base = pick(rng, [20, 40, 60, 80, 100, 200]);
      const ans = (pct * base) / 100;
      return withChoices(
        {
          id,
          prompt: `${pct}% of ${base} = ?`,
          voice: `What is ${pct} percent of ${base}?`,
          answer: String(ans),
        },
        rng,
        choices,
        { min: 0, max: base },
      );
    }
    case 'areaPerimeter': {
      const w = int(rng, 2, grade <= 4 ? 9 : 15);
      const h = int(rng, 2, grade <= 4 ? 9 : 15);
      const area = rng() < 0.5 || grade === 3;
      const ans = area ? w * h : 2 * (w + h);
      return withChoices(
        {
          id,
          prompt: `A rectangle is ${w} by ${h}. ${area ? 'Area' : 'Perimeter'} = ?`,
          voice: `A rectangle is ${w} by ${h}. What is its ${area ? 'area' : 'perimeter'}?`,
          answer: String(ans),
        },
        rng,
        choices,
        { min: 0, max: ans * 2 },
      );
    }
    case 'integers': {
      const a = int(rng, -20, 20);
      const b = int(rng, -20, 20);
      const add = rng() < 0.5;
      const ans = add ? a + b : a - b;
      const show = (n: number) => (n < 0 ? `(${n})` : String(n));
      return withChoices(
        {
          id,
          prompt: `${show(a)} ${add ? '+' : '−'} ${show(b)} = ?`,
          voice: `${a} ${add ? 'plus' : 'minus'} ${b < 0 ? 'negative ' + -b : b}?`,
          answer: String(ans),
        },
        rng,
        choices,
        { min: -40, max: 40 },
      );
    }
    case 'orderOfOps': {
      const a = int(rng, 2, 9);
      const b = int(rng, 2, 9);
      const c = int(rng, 2, 9);
      const form = int(rng, 0, 2);
      const expr =
        form === 0
          ? `${a} + ${b} × ${c}`
          : form === 1
            ? `(${a} + ${b}) × ${c}`
            : `${a} × ${b} − ${c}`;
      const ans = form === 0 ? a + b * c : form === 1 ? (a + b) * c : a * b - c;
      return withChoices(
        {
          id,
          prompt: `${expr} = ?`,
          voice: `${expr.replace('×', 'times').replace('−', 'minus')}?`,
          answer: String(ans),
        },
        rng,
        choices,
        { min: 0, max: ans * 2 + 10 },
      );
    }
    case 'ratios': {
      const a = int(rng, 1, 6);
      const b = int(rng, 1, 6);
      const k = int(rng, 2, 5);
      const ans = `${a * k}:${b * k}`;
      const wrong = [
        `${a * k}:${b}`,
        `${a}:${b * k}`,
        `${a * k + 1}:${b * k}`,
        `${a * k}:${b * k + 1}`,
      ];
      return {
        id,
        prompt: `Which ratio equals ${a}:${b}?`,
        voice: `Which ratio is the same as ${a} to ${b}?`,
        answer: ans,
        choices: pickChoices(rng, ans, wrong),
      };
    }
    case 'exponents': {
      const base = int(rng, 2, 10);
      const exp = int(rng, 2, base <= 3 ? 4 : 3);
      const ans = base ** exp;
      return withChoices(
        {
          id,
          prompt: `${base}^${exp} = ?`,
          voice: `${base} to the power of ${exp}?`,
          answer: String(ans),
        },
        rng,
        choices,
        { min: 0, max: ans * 2 },
      );
    }
    case 'volume': {
      const l = int(rng, 2, 8);
      const w = int(rng, 2, 8);
      const h = int(rng, 2, 8);
      return withChoices(
        {
          id,
          prompt: `A box is ${l} × ${w} × ${h}. Volume = ?`,
          voice: `A box is ${l} by ${w} by ${h}. What is its volume?`,
          answer: String(l * w * h),
        },
        rng,
        choices,
        { min: 0, max: l * w * h * 2 },
      );
    }
    case 'wordProblem': {
      const names = ['PJ', 'Jelly', 'the Princess', 'Lola', 'Kuya', 'Ate'];
      const things = ['shells', 'mangoes', 'stickers', 'diamonds', 'stars', 'fish'];
      const who = pick(rng, names);
      const thing = pick(rng, things);
      if (grade <= 2) {
        const a = int(rng, 2, grade === 1 ? 8 : 15);
        const b = int(rng, 1, grade === 1 ? 10 - a : 20 - a);
        const more = rng() < 0.6;
        const ans = more ? a + b : Math.max(0, a - Math.min(b, a));
        const bb = more ? b : Math.min(b, a);
        const prompt = more
          ? `${who} has ${a} ${thing} and finds ${bb} more. How many now?`
          : `${who} has ${a} ${thing} and gives away ${bb}. How many are left?`;
        return withChoices(
          {
            id,
            prompt,
            voice: prompt,
            answer: String(ans),
            visual: grade === 1 ? { icon: pick(rng, COUNT_ICONS), count: a } : undefined,
          },
          rng,
          choices,
          { min: 0, max: 20 },
        );
      }
      if (grade <= 4) {
        const groups = int(rng, 2, 9);
        const each = int(rng, 2, 9);
        const prompt = `${who} has ${groups} bags with ${each} ${thing} in each. How many ${thing} in all?`;
        return withChoices(
          { id, prompt, voice: prompt, answer: String(groups * each) },
          rng,
          choices,
          { min: 0, max: 100 },
        );
      }
      const total = int(rng, 20, 200);
      const people = pick(rng, [2, 4, 5, 10]);
      const share = Math.floor(total / people) * people;
      const prompt = `${share} ${thing} are shared equally among ${people} friends. How many does each get?`;
      return withChoices(
        { id, prompt, voice: prompt, answer: String(share / people) },
        rng,
        choices,
        { min: 0, max: 100 },
      );
    }
  }
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

export function simplify(num: number, den: number): string {
  const g = gcd(num, den);
  const n = num / g;
  const d = den / g;
  return d === 1 ? String(n) : `${n}/${d}`;
}
