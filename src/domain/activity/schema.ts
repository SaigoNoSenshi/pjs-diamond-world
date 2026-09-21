import { z } from 'zod';

/**
 * Learning-adventure activities. Every activity is DATA validated by these schemas;
 * the player screens are generic engines keyed by `kind`. Adding content never
 * means adding code. All copy is child-facing: short, warm, no pressure.
 *
 * Coordinates for glyphs and layouts are fractions of a unit square (0..1) so the
 * same content fits a phone, a tablet and a desktop window.
 */

export const islandIdSchema = z.enum(['letters', 'numbers', 'art', 'science', 'stories', 'crafts']);
export type IslandId = z.infer<typeof islandIdSchema>;

export const activityKindSchema = z.enum([
  'TRACE',
  'QUIZ',
  'COUNTING',
  'MATCHING',
  'PUZZLE',
  'COLORING',
  'STICKER_SCENE',
  'STORY',
  'MUSIC_MAKER',
  'DRAW',
  'CRAFT',
]);
export type ActivityKind = z.infer<typeof activityKindSchema>;

export const unitPointSchema = z.object({
  x: z.number().min(-0.1).max(1.1),
  y: z.number().min(-0.1).max(1.1),
});
export type UnitPoint = z.infer<typeof unitPointSchema>;

/** A picture the child can recognise: an icon name from the icon set, tinted. */
export const pictureSchema = z.object({
  icon: z.string().min(1),
  color: z.string().min(1).optional(),
  /** Large text instead of / in addition to the icon (letters, numbers). */
  text: z.string().max(4).optional(),
});
export type Picture = z.infer<typeof pictureSchema>;

// ---------- TRACE ----------

export const glyphStrokeSchema = z.object({
  /** Polyline in the unit square; curves are approximated with many points. */
  points: z.array(unitPointSchema).min(2),
});
export type GlyphStroke = z.infer<typeof glyphStrokeSchema>;

export const traceDataSchema = z.object({
  kind: z.literal('TRACE'),
  /** What is being traced, for display: "A", "7", "circle". */
  glyph: z.string().min(1).max(12),
  strokes: z.array(glyphStrokeSchema).min(1),
  /** Spoken when the activity opens: "Big letter A." */
  sayName: z.string().min(1).max(80),
  /** Spoken on completion: "A is for apple!" */
  sayExample: z.string().max(80).optional(),
  examplePicture: pictureSchema.optional(),
  /** Distance (fraction of the square) a finger may stray from the guide. */
  tolerance: z.number().min(0.03).max(0.25).default(0.09),
});
export type TraceData = z.infer<typeof traceDataSchema>;

// ---------- QUIZ ("Jelly asks") ----------

export const quizChoiceSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1).max(40),
  picture: pictureSchema,
});
export type QuizChoice = z.infer<typeof quizChoiceSchema>;

export const quizQuestionSchema = z
  .object({
    id: z.string().min(1),
    prompt: z.string().min(1).max(90),
    /** Spoken version when it differs from the prompt. */
    voice: z.string().max(120).optional(),
    choices: z.array(quizChoiceSchema).min(2).max(4),
    answerId: z.string().min(1),
  })
  .refine((q) => q.choices.some((c) => c.id === q.answerId), 'answerId must be one of the choices');
export type QuizQuestion = z.infer<typeof quizQuestionSchema>;

export const quizDataSchema = z.object({
  kind: z.literal('QUIZ'),
  questions: z.array(quizQuestionSchema).min(1),
  /** How many questions one round asks (random subset). */
  pick: z.number().int().min(1).max(10).default(5),
});
export type QuizData = z.infer<typeof quizDataSchema>;

// ---------- COUNTING ----------

export const countRoundSchema = z
  .object({
    id: z.string().min(1),
    picture: pictureSchema,
    count: z.number().int().min(1).max(20),
    choices: z.array(z.number().int().min(0).max(20)).min(2).max(4),
    prompt: z.string().max(80).optional(),
  })
  .refine((r) => r.choices.includes(r.count), 'choices must include the count');
export type CountRound = z.infer<typeof countRoundSchema>;

export const sortBinSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1).max(30),
  picture: pictureSchema.optional(),
  color: z.string().optional(),
});
export const sortItemSchema = z.object({
  id: z.string().min(1),
  picture: pictureSchema,
  binId: z.string().min(1),
});
export const sortRoundSchema = z
  .object({
    id: z.string().min(1),
    prompt: z.string().min(1).max(80),
    bins: z.array(sortBinSchema).min(2).max(3),
    items: z.array(sortItemSchema).min(2).max(8),
  })
  .refine(
    (r) => r.items.every((i) => r.bins.some((b) => b.id === i.binId)),
    'every item must belong to a bin',
  );
export type SortRound = z.infer<typeof sortRoundSchema>;

export const compareRoundSchema = z.object({
  id: z.string().min(1),
  prompt: z.string().min(1).max(80),
  left: z.object({ picture: pictureSchema, count: z.number().int().min(0).max(12) }),
  right: z.object({ picture: pictureSchema, count: z.number().int().min(0).max(12) }),
  answer: z.enum(['left', 'right', 'same']),
});
export type CompareRound = z.infer<typeof compareRoundSchema>;

export const countingDataSchema = z.discriminatedUnion('mode', [
  z.object({
    kind: z.literal('COUNTING'),
    mode: z.literal('count'),
    rounds: z.array(countRoundSchema).min(1),
  }),
  z.object({
    kind: z.literal('COUNTING'),
    mode: z.literal('sort'),
    rounds: z.array(sortRoundSchema).min(1),
  }),
  z.object({
    kind: z.literal('COUNTING'),
    mode: z.literal('compare'),
    rounds: z.array(compareRoundSchema).min(1),
  }),
]);
export type CountingData = z.infer<typeof countingDataSchema>;

// ---------- MATCHING (memory cards) ----------

export const matchingDataSchema = z.object({
  kind: z.literal('MATCHING'),
  pairs: z
    .array(
      z.object({ id: z.string().min(1), label: z.string().min(1).max(30), picture: pictureSchema }),
    )
    .min(2)
    .max(8),
  /** Card back tint. */
  backColor: z.string().optional(),
});
export type MatchingData = z.infer<typeof matchingDataSchema>;

// ---------- PUZZLE ----------

export const patternRoundSchema = z
  .object({
    id: z.string().min(1),
    /** Sequence with exactly one `null` gap the child fills. */
    sequence: z.array(pictureSchema.nullable()).min(3).max(8),
    choices: z.array(pictureSchema).min(2).max(4),
    answerIndex: z.number().int().nonnegative(),
  })
  .refine((r) => r.sequence.filter((s) => s === null).length === 1, 'exactly one gap')
  .refine((r) => r.answerIndex < r.choices.length, 'answerIndex within choices');
export type PatternRound = z.infer<typeof patternRoundSchema>;

export const puzzleDataSchema = z.discriminatedUnion('mode', [
  z.object({
    kind: z.literal('PUZZLE'),
    mode: z.literal('jigsaw'),
    /** Image registry key. */
    image: z.string().min(1),
    grid: z.union([z.literal(2), z.literal(3)]),
  }),
  z.object({
    kind: z.literal('PUZZLE'),
    mode: z.literal('pattern'),
    rounds: z.array(patternRoundSchema).min(1),
  }),
]);
export type PuzzleData = z.infer<typeof puzzleDataSchema>;

// ---------- COLORING ----------

export const coloringRegionSchema = z.object({
  id: z.string().min(1),
  /** SVG path in the page's viewBox. */
  d: z.string().min(1),
  /** Optional suggested colour for the "help me" hint. */
  suggested: z.string().optional(),
});
export const coloringDataSchema = z.object({
  kind: z.literal('COLORING'),
  viewBox: z.string().default('0 0 100 100'),
  regions: z.array(coloringRegionSchema).min(2),
  /** Decorative outline paths drawn on top (never fillable). */
  outlines: z.array(z.string()).default([]),
});
export type ColoringData = z.infer<typeof coloringDataSchema>;

// ---------- STICKER SCENE ----------

export const stickerSceneDataSchema = z.object({
  kind: z.literal('STICKER_SCENE'),
  background: z.enum(['island', 'sea', 'sky', 'garden']),
  /** Icon names offered in the tray. */
  stickers: z.array(z.string().min(1)).min(4),
});
export type StickerSceneData = z.infer<typeof stickerSceneDataSchema>;

// ---------- STORY (read-along) ----------

export const storyPageSchema = z.object({
  text: z.string().min(1).max(220),
  /** Image registry key. */
  illustration: z.string().min(1),
});
export const storyDataSchema = z.object({
  kind: z.literal('STORY'),
  pages: z.array(storyPageSchema).min(2),
  /** One gentle question at the end (optional). */
  question: quizQuestionSchema.optional(),
});
export type StoryData = z.infer<typeof storyDataSchema>;

// ---------- MUSIC MAKER ----------

export const musicPadSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1).max(12),
  color: z.string().min(1),
  /** Note asset key in the audio registry. */
  sound: z.string().min(1),
});
export const musicMakerDataSchema = z.object({
  kind: z.literal('MUSIC_MAKER'),
  instrument: z.enum(['xylophone', 'drums']),
  pads: z.array(musicPadSchema).min(3).max(10),
  /** A little tune Jelly can play (pad ids). */
  demo: z.array(z.string()).default([]),
});
export type MusicMakerData = z.infer<typeof musicMakerDataSchema>;

// ---------- DRAW / CRAFT (existing engines) ----------

export const drawDataSchema = z.object({
  kind: z.literal('DRAW'),
  /** Optional idea Jelly suggests: "Draw a happy fish." */
  idea: z.string().max(80).optional(),
});
export const craftDataSchema = z.object({ kind: z.literal('CRAFT'), craftId: z.string().min(1) });

export const activityDataSchema = z.union([
  traceDataSchema,
  quizDataSchema,
  countingDataSchema,
  matchingDataSchema,
  puzzleDataSchema,
  coloringDataSchema,
  stickerSceneDataSchema,
  storyDataSchema,
  musicMakerDataSchema,
  drawDataSchema,
  craftDataSchema,
]);
export type ActivityData = z.infer<typeof activityDataSchema>;

export const activityRewardSchema = z.object({
  diamonds: z.number().int().min(1).max(20),
  /** Sticker granted the first time this activity is completed. */
  stickerId: z.string().optional(),
});

export const activityDefinitionSchema = z
  .object({
    id: z.string().regex(/^act_[a-z0-9_]+$/),
    kind: activityKindSchema,
    islandId: islandIdSchema,
    title: z.string().min(1).max(40),
    icon: z.string().min(1),
    color: z.string().min(1),
    /** Spoken by Jelly when the activity opens. */
    voiceIntro: z.string().min(1).max(120),
    /** Short on-screen instruction; also what "Jelly reads it" repeats. */
    instruction: z.string().min(1).max(90),
    reward: activityRewardSchema,
    tags: z.array(z.string()).default([]),
    data: activityDataSchema,
  })
  .refine((a) => a.kind === a.data.kind, 'kind must match data.kind');
export type ActivityDefinition = z.infer<typeof activityDefinitionSchema>;
