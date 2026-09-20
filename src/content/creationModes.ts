import type { IconName } from '@/components/icons/Icon';
import { routes } from '@/constants/routes';
import { strings, voicePrompts } from '@/constants/strings';
import { palette } from '@/theme';

/**
 * Creation-mode registry. The Create hub renders whatever is listed here, so new
 * modes (stickers, colouring pages, shape maker, ...) are one entry each.
 */
export interface CreationMode {
  id: string;
  label: string;
  icon: IconName;
  color: string;
  route: string;
  voicePrompt: string;
  enabled: boolean;
}

export const creationModes: readonly CreationMode[] = [
  {
    id: 'draw',
    label: strings.create.draw,
    icon: 'paintbrush',
    color: palette.sunshine,
    route: routes.draw,
    voicePrompt: voicePrompts.draw,
    enabled: true,
  },
  {
    id: 'craft',
    label: strings.create.craft,
    icon: 'clay',
    color: palette.aqua,
    route: routes.craft('crf_clay_cup'),
    voicePrompt: voicePrompts.craft,
    enabled: true,
  },
];

export const enabledCreationModes = creationModes.filter((m) => m.enabled);
