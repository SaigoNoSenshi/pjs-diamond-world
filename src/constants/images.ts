/**
 * Illustration registry. Content packs reference illustrations by key so data files
 * never `require()` files directly and packs can later be downloaded.
 *
 * All runtime illustrations are WebP (10x smaller than the PNG originals at the same
 * visual quality). App icons/splash stay PNG because the OS requires it.
 */
export const images = {
  'character.jelly': require('@/assets/images/characters/jelly.webp') as number,
  'character.princess': require('@/assets/images/characters/princess.webp') as number,
  'scene.island': require('@/assets/images/island-bg.webp') as number,
  'craft.clayCup.1': require('@/assets/images/crafts/clay-cup-1-log.webp') as number,
  'craft.clayCup.2': require('@/assets/images/crafts/clay-cup-2-connect.webp') as number,
  'craft.clayCup.3': require('@/assets/images/crafts/clay-cup-3-shape.webp') as number,
  'craft.clayCup.4': require('@/assets/images/crafts/clay-cup-4-colors.webp') as number,
  'craft.clayCup.5': require('@/assets/images/crafts/clay-cup-5-handle.webp') as number,
  'craft.clayCup.6': require('@/assets/images/crafts/clay-cup-6-photo.webp') as number,
  'craft.clayCup.7': require('@/assets/images/crafts/clay-cup-7-save.webp') as number,
  'garden.sprout': require('@/assets/images/garden/sprout.webp') as number,
  'garden.flower': require('@/assets/images/garden/flower.webp') as number,
  'garden.tree': require('@/assets/images/garden/tree.webp') as number,
  'garden.diamond': require('@/assets/images/garden/diamond.webp') as number,
  'story.lostDiamond.1': require('@/assets/images/stories/lostDiamond-1.webp') as number,
  'story.lostDiamond.2': require('@/assets/images/stories/lostDiamond-2.webp') as number,
  'story.lostDiamond.3': require('@/assets/images/stories/lostDiamond-3.webp') as number,
  'story.lostDiamond.4': require('@/assets/images/stories/lostDiamond-4.webp') as number,
  'story.lostDiamond.5': require('@/assets/images/stories/lostDiamond-5.webp') as number,
  'story.rainbowFish.1': require('@/assets/images/stories/rainbowFish-1.webp') as number,
  'story.rainbowFish.2': require('@/assets/images/stories/rainbowFish-2.webp') as number,
  'story.rainbowFish.3': require('@/assets/images/stories/rainbowFish-3.webp') as number,
  'story.rainbowFish.4': require('@/assets/images/stories/rainbowFish-4.webp') as number,
  'story.rainbowFish.5': require('@/assets/images/stories/rainbowFish-5.webp') as number,
  'story.robotPig.1': require('@/assets/images/stories/robotPig-1.webp') as number,
  'story.robotPig.2': require('@/assets/images/stories/robotPig-2.webp') as number,
  'story.robotPig.3': require('@/assets/images/stories/robotPig-3.webp') as number,
  'story.robotPig.4': require('@/assets/images/stories/robotPig-4.webp') as number,
  'story.robotPig.5': require('@/assets/images/stories/robotPig-5.webp') as number,
  'craft.paperCrown.1': require('@/assets/images/crafts/paper-crown-1.webp') as number,
  'craft.paperCrown.2': require('@/assets/images/crafts/paper-crown-2.webp') as number,
  'craft.paperCrown.3': require('@/assets/images/crafts/paper-crown-3.webp') as number,
  'craft.paperCrown.4': require('@/assets/images/crafts/paper-crown-4.webp') as number,
  'craft.paperCrown.5': require('@/assets/images/crafts/paper-crown-5.webp') as number,
  'craft.paperCrown.6': require('@/assets/images/crafts/paper-crown-6.webp') as number,
  'craft.paperCrown.7': require('@/assets/images/crafts/paper-crown-7.webp') as number,
  'craft.leafPrint.1': require('@/assets/images/crafts/leaf-print-1.webp') as number,
  'craft.leafPrint.2': require('@/assets/images/crafts/leaf-print-2.webp') as number,
  'craft.leafPrint.3': require('@/assets/images/crafts/leaf-print-3.webp') as number,
  'craft.leafPrint.4': require('@/assets/images/crafts/leaf-print-4.webp') as number,
  'craft.leafPrint.5': require('@/assets/images/crafts/leaf-print-5.webp') as number,
  'craft.leafPrint.6': require('@/assets/images/crafts/leaf-print-6.webp') as number,
  'craft.leafPrint.7': require('@/assets/images/crafts/leaf-print-7.webp') as number,
} as const;

export type ImageKey = keyof typeof images;

export function isImageKey(key: string): key is ImageKey {
  return key in images;
}

export function resolveImage(key: string): number | null {
  return isImageKey(key) ? images[key] : null;
}
