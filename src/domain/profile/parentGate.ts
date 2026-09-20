/**
 * Parent gate logic (pure). Two layers: a press-and-hold (UI) followed by either an
 * arithmetic challenge a five-year-old cannot pass reliably, or an optional PIN.
 *
 * The PIN hash is a salted FNV-1a — a deterrent for a child, NOT a security boundary.
 * Nothing sensitive is protected by it (see docs/CHILD_SAFETY.md §8).
 */

export interface ArithmeticChallenge {
  a: number;
  b: number;
  answer: number;
  /** Four large-button options including the answer, shuffled. */
  options: number[];
}

export function createChallenge(random: () => number = Math.random): ArithmeticChallenge {
  const a = 6 + Math.floor(random() * 4); // 6..9
  const b = 5 + Math.floor(random() * 5); // 5..9
  const answer = a + b; // 11..18
  const options = new Set<number>([answer]);
  while (options.size < 4) {
    const delta = 1 + Math.floor(random() * 4);
    const candidate = random() < 0.5 ? answer - delta : answer + delta;
    if (candidate > 0) options.add(candidate);
  }
  const shuffled = [...options];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
  }
  return { a, b, answer, options: shuffled };
}

export const PIN_LENGTH = 4;
const PIN_SALT = 'pjs-diamond-world';

export function isValidPin(pin: string): boolean {
  return new RegExp(`^\\d{${PIN_LENGTH}}$`).test(pin);
}

export function hashPin(pin: string): string {
  const input = `${PIN_SALT}:${pin}`;
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return `fnv1a:${hash.toString(16).padStart(8, '0')}`;
}

export function verifyPin(pin: string, storedHash: string | undefined): boolean {
  if (!storedHash || !isValidPin(pin)) return false;
  return hashPin(pin) === storedHash;
}
