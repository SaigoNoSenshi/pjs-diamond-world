# Roadmap

## MVP (this build) — status

| Phase | Scope                                                                                                    | Status                          |
| ----- | -------------------------------------------------------------------------------------------------------- | ------------------------------- |
| 0     | Architecture, docs, plan                                                                                 | done                            |
| 1     | Project foundation: Expo Router, TypeScript strict, lint, format, tests, folder structure, Replit config | done                            |
| 2     | Design system + original artwork                                                                         | done                            |
| 3     | Splash/intro, Diamond Island home, Jelly, princess                                                       | done                            |
| 4     | Drawing system: brush, crayon, eraser, undo/redo, hold-to-clear, colours, stamps, autosave               | done                            |
| 5     | Local persistence: SQLite repositories, file store, settings store, in-memory fallback                   | done                            |
| 6     | My Diamond Book                                                                                          | done                            |
| 7     | Craft Activity Engine                                                                                    | done                            |
| 8     | PJ's Clay Cup + camera                                                                                   | done                            |
| 9     | Progression engine + My Garden                                                                           | done                            |
| 10    | Music Reef                                                                                               | done                            |
| 11    | Parent Mode + parent gate                                                                                | done                            |
| 12    | Optional Firebase sync architecture + security rules                                                     | done                            |
| 13    | Testing, accessibility, thumbnails, polish                                                               | done (see BUILD_LOG for limits) |

## First device run (do this before anything else)

1. `npm install`, then `npx expo start` and open in Expo Go on an iPad/Android tablet.
2. Walk the Definition of Done path with PJ watching, not helping: intro → Create → draw → save → Book → Clay Cup → photo → save → Garden → Music → Home.
3. Verify the native-only paths that Jest cannot: `FileSystemAssetStore` writes, `CameraView` capture, `expo-speech` voice, `expo-audio` loops, haptics.
4. Tune intro timings and touch-target sizes from what PJ actually does.

## Immediately after MVP

- Replace placeholder WAV loops with commissioned original music (princess theme, island ambience, creative loop); keep `placeholder: false` only for licensed audio.
- Replace on-device TTS with recorded voice prompts (same `AudioPromptService` interface).
- Parent sign-in screen (email → Google/Apple) so cloud backup can actually be enabled; deploy `firebase/*.rules`.
- Sticker decorations and child voice notes in My Diamond Book.
- Second and third crafts (paper crown, leaf print) to prove the engine with content only.
- Optimise bundled PNGs (currently ~5 MB) and consider `expo-sqlite` web support so the web preview persists creations.

## Later

- Colouring pages, shape maker, sticker mode, story drawing, photo decoration, character creator (new creation modes via the registry).
- More garden content: new islands, jellyfish friends, plants, characters, craft stations.
- Parent dashboard, multiple child profiles, custom parent-authored activities, screen-time settings.
- Downloadable content packs (crafts, stamps, music) validated by the content schemas.
- Localisation (child strings in `constants/strings.ts`, parent strings in `constants/parentStrings.ts`).
- Preserve z-order between stamps and later strokes (currently stamps render above strokes); consider Skia behind the `DrawingCanvas` abstraction if long sessions get slow.
- Child-safe AI behind `CreativeAssistantService`: drawing prompts, safe story generation, craft recommendations, difficulty adaptation, narration — always parent-enabled and reviewed against `CHILD_SAFETY.md`.

## Explicitly not planned

- Social features, chat, public sharing, leaderboards, advertising, open web access, unrestricted AI chat for the child.
