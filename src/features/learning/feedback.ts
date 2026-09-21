import { voicePrompts } from '@/constants/strings';

/** Rotating, never-repeating-twice encouragement lines. */
export function pickLine(lines: readonly string[], previous: string | null): string {
  const options = lines.filter((l) => l !== previous);
  return options[Math.floor(Math.random() * options.length)] ?? lines[0] ?? '';
}

export const correctLine = (prev: string | null) => pickLine(voicePrompts.correct, prev);
export const tryAgainLine = (prev: string | null) => pickLine(voicePrompts.tryAgain, prev);

/** Shuffle (Fisher–Yates) with an injectable random for deterministic tests. */
export function shuffle<T>(items: readonly T[], random: () => number = Math.random): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}
