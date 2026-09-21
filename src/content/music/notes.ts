/**
 * Music Maker sounds: original synthesised xylophone notes (C5–C6) and drum hits.
 * Keys are referenced by MusicMakerData pads.
 */
export const noteSounds = {
  'xylo.c': require('@/assets/audio/notes/xylo-c.mp3') as number,
  'xylo.d': require('@/assets/audio/notes/xylo-d.mp3') as number,
  'xylo.e': require('@/assets/audio/notes/xylo-e.mp3') as number,
  'xylo.f': require('@/assets/audio/notes/xylo-f.mp3') as number,
  'xylo.g': require('@/assets/audio/notes/xylo-g.mp3') as number,
  'xylo.a': require('@/assets/audio/notes/xylo-a.mp3') as number,
  'xylo.b': require('@/assets/audio/notes/xylo-b.mp3') as number,
  'xylo.c2': require('@/assets/audio/notes/xylo-c2.mp3') as number,
  'drum.kick': require('@/assets/audio/notes/drum-kick.mp3') as number,
  'drum.snare': require('@/assets/audio/notes/drum-snare.mp3') as number,
  'drum.hat': require('@/assets/audio/notes/drum-hat.mp3') as number,
  'drum.clap': require('@/assets/audio/notes/drum-clap.mp3') as number,
} as const;

export type NoteKey = keyof typeof noteSounds;

export function isNoteKey(key: string): key is NoteKey {
  return key in noteSounds;
}
