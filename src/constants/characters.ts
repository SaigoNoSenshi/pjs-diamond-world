/**
 * Character registry. Names are configuration, not code — rename here and every
 * screen, voice prompt and celebration updates.
 */
export interface CharacterDefinition {
  id: string;
  /** Display name used in UI and voice prompts. */
  name: string;
  /** Short description for docs and future character screens. */
  description: string;
  /** Primary colour, used for accents around the character. */
  color: string;
}

export const characters = {
  guide: {
    id: 'jelly',
    name: 'Jelly',
    description:
      'An original, friendly yellow jellyfish who guides PJ with animation, icons and short cheerful sounds.',
    color: '#FFD93D',
  },
  princess: {
    id: 'princess',
    name: 'the Princess',
    description:
      'An original friendly princess who lives on Diamond Island and makes magical plants grow.',
    color: '#FF7BAC',
  },
} satisfies Record<string, CharacterDefinition>;

export const GUIDE = characters.guide;
export const PRINCESS = characters.princess;
