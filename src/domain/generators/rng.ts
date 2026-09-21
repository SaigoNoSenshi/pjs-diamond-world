/** Deterministic PRNG helpers shared by the activity generators. */
export type Rng = () => number;

export function makeRng(seed: string): Rng {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i += 1) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = h >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Integer in [min, max] inclusive. */
export function int(rng: Rng, min: number, max: number): number {
  return min + Math.floor(rng() * (max - min + 1));
}

export function pick<T>(rng: Rng, items: readonly T[]): T {
  return items[Math.floor(rng() * items.length)]!;
}

export function shuffleWith<T>(rng: Rng, items: readonly T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

/**
 * Plausible wrong answers around a correct number: near misses first, never
 * negative unless the generator allows it, always unique and never the answer.
 */
export function distractors(
  rng: Rng,
  answer: number,
  count: number,
  opts: { min?: number; max?: number; step?: number } = {},
): number[] {
  const min = opts.min ?? 0;
  const max = opts.max ?? Math.max(answer * 2, answer + 10);
  const step = opts.step ?? 1;
  const set = new Set<number>();
  const candidates = [
    answer + step,
    answer - step,
    answer + 2 * step,
    answer - 2 * step,
    answer + 10,
    answer - 10,
  ];
  for (const c of shuffleWith(rng, candidates)) {
    if (set.size >= count) break;
    if (c !== answer && c >= min && c <= max) set.add(c);
  }
  let guard = 0;
  while (set.size < count && guard < 200) {
    guard += 1;
    const c = int(rng, min, max);
    if (c !== answer) set.add(c);
  }
  return [...set].slice(0, count);
}
