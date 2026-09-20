import { gardenItemSchema, type GardenItem } from '@/domain/progression/schema';

/**
 * Garden content pack. Every creation grows the island; nothing is competitive.
 * Positions are fractions of the garden stage. Add items = add rows.
 */
const raw: GardenItem[] = [
  {
    id: 'sprout',
    type: 'SPROUT',
    name: 'sprout',
    unlockRequirement: { kind: 'CREATIONS_AT_LEAST', count: 1 },
    asset: 'garden.sprout',
    position: { x: 0.22, y: 0.72 },
    scale: 0.8,
  },
  {
    id: 'flower',
    type: 'FLOWER',
    name: 'flower',
    unlockRequirement: { kind: 'CRAFTS_AT_LEAST', count: 1 },
    asset: 'garden.flower',
    position: { x: 0.5, y: 0.66 },
    scale: 1,
  },
  {
    id: 'tree',
    type: 'TREE',
    name: 'tree',
    unlockRequirement: { kind: 'CREATIONS_AT_LEAST', count: 3 },
    asset: 'garden.tree',
    position: { x: 0.78, y: 0.6 },
    scale: 1.3,
  },
  {
    id: 'diamond',
    type: 'DIAMOND',
    name: 'diamond',
    unlockRequirement: { kind: 'CREATIONS_AT_LEAST', count: 5 },
    asset: 'garden.diamond',
    position: { x: 0.34, y: 0.5 },
    scale: 1,
  },
  {
    id: 'jelly-friend',
    type: 'JELLYFISH',
    name: 'jellyfish friend',
    unlockRequirement: { kind: 'POINTS_AT_LEAST', points: 20 },
    asset: 'character.jelly',
    position: { x: 0.68, y: 0.3 },
    scale: 0.9,
  },
  {
    id: 'second-flower',
    type: 'FLOWER',
    name: 'flower',
    unlockRequirement: { kind: 'DRAWINGS_AT_LEAST', count: 4 },
    asset: 'garden.flower',
    position: { x: 0.12, y: 0.52 },
    scale: 0.8,
  },
  {
    id: 'sparkle-diamond',
    type: 'DIAMOND',
    name: 'sparkly diamond',
    unlockRequirement: { kind: 'CREATIONS_AT_LEAST', count: 10 },
    asset: 'garden.diamond',
    position: { x: 0.86, y: 0.82 },
    scale: 0.7,
  },
];

export const gardenItems: readonly GardenItem[] = raw.map((item) => gardenItemSchema.parse(item));

export function findGardenItem(id: string): GardenItem | undefined {
  return gardenItems.find((i) => i.id === id);
}
