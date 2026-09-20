import type { MusicTrack, SoundEffectKey } from '@/services/interfaces';

/**
 * Music Reef playlist. Every track here is an ORIGINAL synthesised placeholder loop
 * (see asset-work notes in docs/BUILD_LOG.md). Replace with commissioned music before
 * any public release; keep `placeholder: false` only for licensed/commissioned audio.
 *
 * MP3 (not WAV): plays natively on iOS, Android and every browser at ~1/4 the size.
 */
export const musicTracks: readonly MusicTrack[] = [
  {
    id: 'princess-waltz',
    title: 'Princess Waltz',
    source: require('@/assets/audio/music/princess-waltz.mp3') as number,
    placeholder: true,
  },
  {
    id: 'sea-breeze',
    title: 'Sea Breeze',
    source: require('@/assets/audio/music/sea-breeze.mp3') as number,
    placeholder: true,
  },
  {
    id: 'creative-jam',
    title: 'Creative Jam',
    source: require('@/assets/audio/music/creative-jam.mp3') as number,
    placeholder: true,
  },
];

/** Short synthesised cues. */
export const soundEffects: Record<SoundEffectKey, number> = {
  tap: require('@/assets/audio/sfx/tap.mp3') as number,
  bubble: require('@/assets/audio/sfx/bubble.mp3') as number,
  sparkle: require('@/assets/audio/sfx/sparkle.mp3') as number,
  grow: require('@/assets/audio/sfx/grow.mp3') as number,
  save: require('@/assets/audio/sfx/save.mp3') as number,
  celebrate: require('@/assets/audio/sfx/celebrate.mp3') as number,
  oops: require('@/assets/audio/sfx/oops.mp3') as number,
};
