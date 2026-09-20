/**
 * Child-friendly creation titles. PJ never types a filename; we build one from
 * what she made: "PJ's Yellow Star", "PJ's Happy Flower", "My Clay Cup".
 */

export interface FriendlyNameInput {
  nickname: string;
  /** Colour label such as "Yellow" (already human-readable). */
  colorLabel?: string | null;
  /** Noun for the most recent stamp, e.g. "Star". */
  stampNoun?: string | null;
  /** Deterministic pick for tests; defaults to Math.random. */
  random?: () => number;
}

const ADJECTIVES = ['Happy', 'Sparkly', 'Magic', 'Sunny', 'Dreamy', 'Brave', 'Bright', 'Cozy'];
const NOUNS = ['Drawing', 'Picture', 'Masterpiece', 'Painting', 'Doodle'];

function pick<T>(items: readonly T[], random: () => number): T {
  const index = Math.min(items.length - 1, Math.floor(random() * items.length));
  return items[index] as T;
}

export function friendlyDrawingName({
  nickname,
  colorLabel,
  stampNoun,
  random = Math.random,
}: FriendlyNameInput): string {
  const owner = `${nickname}'s`;
  if (colorLabel && stampNoun) return `${owner} ${colorLabel} ${stampNoun}`;
  if (stampNoun) return `${owner} ${pick(ADJECTIVES, random)} ${stampNoun}`;
  if (colorLabel) return `${owner} ${colorLabel} ${pick(NOUNS, random)}`;
  return `${owner} ${pick(ADJECTIVES, random)} ${pick(NOUNS, random)}`;
}

export function friendlyCraftName(craftNoun: string): string {
  const capitalised = craftNoun.charAt(0).toUpperCase() + craftNoun.slice(1);
  return `My ${capitalised}`;
}

/** Ensure a title never exceeds the schema limit. */
export function clampTitle(title: string, max = 60): string {
  return title.length <= max ? title : `${title.slice(0, max - 1)}…`;
}
