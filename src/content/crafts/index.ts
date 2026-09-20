import { craftTemplateSchema, type CraftTemplate } from '@/domain/craft/schema';

import { clayCup } from './clayCup';

/**
 * Craft registry. Every template is validated at load time so a malformed content
 * file fails fast in development instead of breaking a step for PJ.
 * Adding a craft = add a data file and list it here (or, later, load a pack).
 */
const raw: readonly CraftTemplate[] = [clayCup];

export const crafts: readonly CraftTemplate[] = raw.map((template) =>
  craftTemplateSchema.parse(template),
);

export function findCraft(id: string): CraftTemplate | undefined {
  return crafts.find((c) => c.id === id);
}
