import type { IconName } from '@/components/icons/Icon';

/**
 * Stamp packs. The first pack is exactly what PJ asked for (robot and pig because
 * "I'm a robot" / "I'm a pig"). Add a pack = add an entry.
 */
export interface StampDefinition {
  id: string;
  icon: IconName;
  label: string;
  /** Noun used in friendly names: "PJ's Yellow Star". */
  noun: string;
}

export interface StampPack {
  id: string;
  title: string;
  stamps: readonly StampDefinition[];
}

export const stampPacks: readonly StampPack[] = [
  {
    id: 'diamond-island',
    title: 'Diamond Island',
    stamps: [
      { id: 'diamond', icon: 'diamond', label: 'Diamond', noun: 'Diamond' },
      { id: 'flower', icon: 'flower', label: 'Flower', noun: 'Flower' },
      { id: 'leaf', icon: 'leaf', label: 'Leaf', noun: 'Leaf' },
      { id: 'star', icon: 'star', label: 'Star', noun: 'Star' },
      { id: 'jellyfish', icon: 'jellyfish', label: 'Jellyfish', noun: 'Jellyfish' },
      { id: 'crown', icon: 'crown', label: 'Princess crown', noun: 'Crown' },
      { id: 'heart', icon: 'heart', label: 'Heart', noun: 'Heart' },
      { id: 'robot', icon: 'robot', label: 'Robot', noun: 'Robot' },
      { id: 'pig', icon: 'pig', label: 'Pig', noun: 'Pig' },
    ],
  },
];

export const allStamps: readonly StampDefinition[] = stampPacks.flatMap((p) => p.stamps);

export function findStamp(id: string): StampDefinition | undefined {
  return allStamps.find((s) => s.id === id);
}
