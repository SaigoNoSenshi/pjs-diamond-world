import { palette } from '@/theme';

/**
 * Sticker catalogue for the collection album. Stickers are earned by completing
 * activities (each activity names its sticker) and from the Daily Quest chest.
 * All original icon art; no brands.
 */
export interface StickerDefinition {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export const stickers: readonly StickerDefinition[] = [
  { id: 'stk_star', name: 'Gold Star', icon: 'star', color: palette.sunshine },
  { id: 'stk_diamond', name: 'Diamond', icon: 'diamond', color: palette.aqua },
  { id: 'stk_heart', name: 'Heart', icon: 'heart', color: palette.blossom },
  { id: 'stk_crown', name: 'Crown', icon: 'crown', color: palette.sunshine },
  { id: 'stk_jelly', name: 'Jelly', icon: 'jellyfish', color: palette.sunshine },
  { id: 'stk_flower', name: 'Flower', icon: 'flower', color: palette.blossom },
  { id: 'stk_leaf', name: 'Leaf', icon: 'leaf', color: palette.leaf },
  { id: 'stk_rainbow', name: 'Rainbow', icon: 'rainbow', color: palette.coral },
  { id: 'stk_robot', name: 'Robot', icon: 'robot', color: palette.sea },
  { id: 'stk_pig', name: 'Pig', icon: 'pig', color: palette.blossom },
  { id: 'stk_shell', name: 'Seashell', icon: 'shell', color: palette.tangerine },
  { id: 'stk_music', name: 'Music Note', icon: 'music', color: palette.lavender },
  { id: 'stk_fish', name: 'Fish', icon: 'fish', color: palette.tangerine },
  { id: 'stk_crab', name: 'Crab', icon: 'crab', color: palette.coral },
  { id: 'stk_turtle', name: 'Turtle', icon: 'turtle', color: palette.leaf },
  { id: 'stk_octopus', name: 'Octopus', icon: 'octopus', color: palette.lavender },
  { id: 'stk_starfish', name: 'Starfish', icon: 'starfish', color: palette.tangerine },
  { id: 'stk_whale', name: 'Whale', icon: 'whale', color: palette.sea },
  { id: 'stk_seahorse', name: 'Seahorse', icon: 'seahorse', color: palette.aqua },
  { id: 'stk_sun', name: 'Sun', icon: 'sun', color: palette.sunshine },
  { id: 'stk_moon', name: 'Moon', icon: 'moon', color: palette.mist },
  { id: 'stk_cloud', name: 'Cloud', icon: 'cloud', color: palette.white },
  { id: 'stk_tree', name: 'Tree', icon: 'tree', color: palette.leaf },
  { id: 'stk_house', name: 'House', icon: 'house', color: palette.coral },
  { id: 'stk_boat', name: 'Boat', icon: 'boat', color: palette.sea },
  { id: 'stk_apple', name: 'Apple', icon: 'apple', color: palette.coral },
  { id: 'stk_mango', name: 'Mango', icon: 'mango', color: palette.sunshine },
  { id: 'stk_cat', name: 'Cat', icon: 'cat', color: palette.tangerine },
  { id: 'stk_dog', name: 'Dog', icon: 'dog', color: palette.tangerine },
  { id: 'stk_bird', name: 'Bird', icon: 'bird', color: palette.sea },
  { id: 'stk_frog', name: 'Frog', icon: 'frog', color: palette.leaf },
  { id: 'stk_butterfly', name: 'Butterfly', icon: 'butterfly', color: palette.lavender },
  { id: 'stk_bee', name: 'Bee', icon: 'bee', color: palette.sunshine },
  { id: 'stk_ball', name: 'Ball', icon: 'ball', color: palette.coral },
  { id: 'stk_chest', name: 'Treasure Chest', icon: 'chest', color: palette.tangerine },
  { id: 'stk_palette', name: 'Paint Palette', icon: 'palette', color: palette.blossom },
];

export const stickerIds: readonly string[] = stickers.map((s) => s.id);

export function findSticker(id: string): StickerDefinition | undefined {
  return stickers.find((s) => s.id === id);
}
