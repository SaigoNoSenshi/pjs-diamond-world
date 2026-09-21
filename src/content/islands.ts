import type { IslandId } from '@/domain/activity/schema';
import { palette } from '@/theme';

/**
 * The six learning islands of Diamond World. Each island is a themed world that
 * grows as PJ completes its activities. Positions are fractions of the home map.
 */
export interface IslandDefinition {
  id: IslandId;
  name: string;
  /** One-line child-friendly subtitle (also spoken by Jelly). */
  tagline: string;
  icon: string;
  color: string;
  /** Position of the island tile on the home map (0..1). */
  position: { x: number; y: number };
  voiceIntro: string;
}

export const islands: readonly IslandDefinition[] = [
  {
    id: 'letters',
    name: 'Letter Lagoon',
    tagline: 'Letters, sounds and tracing',
    icon: 'abc',
    color: palette.blossom,
    position: { x: 0.2, y: 0.28 },
    voiceIntro: 'Welcome to Letter Lagoon! Let’s trace letters and find their sounds.',
  },
  {
    id: 'numbers',
    name: 'Number Cove',
    tagline: 'Counting, shapes and patterns',
    icon: 'numbers',
    color: palette.sea,
    position: { x: 0.5, y: 0.2 },
    voiceIntro: 'Welcome to Number Cove! Let’s count and find shapes.',
  },
  {
    id: 'art',
    name: 'Color & Art Bay',
    tagline: 'Draw, color and make scenes',
    icon: 'palette',
    color: palette.sunshine,
    position: { x: 0.8, y: 0.3 },
    voiceIntro: 'Welcome to Color and Art Bay! Let’s make something beautiful.',
  },
  {
    id: 'science',
    name: 'Science Shore',
    tagline: 'Animals, nature and my body',
    icon: 'flask',
    color: palette.leaf,
    position: { x: 0.22, y: 0.66 },
    voiceIntro: 'Welcome to Science Shore! Let’s explore animals and nature.',
  },
  {
    id: 'stories',
    name: 'Story Reef',
    tagline: 'Read-along stories',
    icon: 'book',
    color: palette.lavender,
    position: { x: 0.5, y: 0.74 },
    voiceIntro: 'Welcome to Story Reef! Let’s read a story together.',
  },
  {
    id: 'crafts',
    name: 'Craft Beach',
    tagline: 'Make real things with your hands',
    icon: 'scissors',
    color: palette.tangerine,
    position: { x: 0.8, y: 0.68 },
    voiceIntro: 'Welcome to Craft Beach! Let’s make a craft.',
  },
];

export function findIsland(id: string): IslandDefinition | undefined {
  return islands.find((i) => i.id === id);
}
