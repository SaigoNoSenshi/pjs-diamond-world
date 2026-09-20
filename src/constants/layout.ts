/** Layout constants shared across features. */
export const layout = {
  /** Intro auto-advances after this many ms if PJ does not tap. */
  introAutoAdvanceMs: 6000,
  /** Drawing draft autosave interval. */
  draftAutosaveMs: 5000,
  /** Press-and-hold duration for destructive or gated actions. */
  holdToConfirmMs: 1200,
  /** Press-and-hold duration for the parent gate. */
  parentGateHoldMs: 2000,
  /** Thumbnail size in logical pixels. */
  thumbnailSize: 320,
} as const;
