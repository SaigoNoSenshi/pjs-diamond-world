/** Time of day for the island scene. Pure, so it is easy to test. */
export type DayPhase = 'morning' | 'day' | 'evening' | 'night';

export function dayPhaseFor(date: Date): DayPhase {
  const h = date.getHours();
  if (h >= 5 && h < 9) return 'morning';
  if (h >= 9 && h < 17) return 'day';
  if (h >= 17 && h < 19) return 'evening';
  return 'night';
}

/** Overlay tint per phase (rgba). Transparent by day. */
export const PHASE_TINT: Record<DayPhase, string> = {
  morning: 'rgba(255, 214, 165, 0.18)',
  day: 'rgba(0,0,0,0)',
  evening: 'rgba(255, 140, 90, 0.22)',
  night: 'rgba(20, 30, 80, 0.42)',
};

export const PHASE_GREETING: Record<DayPhase, string> = {
  morning: 'Good morning! What do you want to do?',
  day: 'What do you want to do?',
  evening: 'Good evening! What do you want to do?',
  night: 'It is night on Diamond Island. What do you want to do?',
};
