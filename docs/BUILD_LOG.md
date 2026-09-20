# Build Log

Environment note: this MVP is built in a sandboxed Linux container (Node 24, npm 11), not in Replit. A `.replit` file is included so the repo opens in Replit with `npm run web`. iOS/Android were not executed in this environment; native paths are covered by unit tests, jest-expo mocks, and the web preview.

---

## Phase 0 — Architecture and plan

**Built**

- `docs/PRODUCT_SPEC.md`, `docs/ARCHITECTURE.md`, `docs/CHILD_SAFETY.md`, `docs/ROADMAP.md`, this log.

**Decisions**

- Expo SDK 57 default template (already `src/`-based, Expo Router, TypeScript) as the foundation; template demo screens/components removed.
- SVG drawing canvas behind an abstraction (Skia deferred).
- SQLite + FileSystem + AsyncStorage behind repository interfaces, with in-memory implementations for tests and the web preview.
- expo-speech as the placeholder `AudioPromptService`; synthesized placeholder loops for Music Reef.
- Firebase optional, no-op by default, env-var configured, rules shipped as files.

**Assumptions (unblocked by choosing the simplest safe option)**

- Drawing engine: SVG (recommended, not confirmed by owner).
- Delivery: zipped git repository in the thread.

**Risks identified**
See `ARCHITECTURE.md` §13.

**Next**: Phase 1 — project foundation.

---

## Phase 1 — Project foundation

**Built**

- Expo SDK 57 / Expo Router / React Native 0.86 / React 19 / TypeScript 6 strict (`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitReturns`, `noUnusedLocals`).
- Template demo code removed (`@expo/ui`, `expo-glass-effect`, `expo-symbols`, `expo-web-browser`, demo screens/components/assets).
- Dependencies via `npx expo install` for SDK-matched versions: `react-native-svg`, `react-native-view-shot`, `expo-sqlite`, `expo-file-system`, `@react-native-async-storage/async-storage`, `expo-audio`, `expo-speech`, `expo-camera`, `expo-image-picker`, `expo-haptics`, `expo-sharing`, `zod`; dev: `jest-expo`, `jest`, `@testing-library/react-native`, `@types/jest`, `eslint`, `eslint-config-expo`, `eslint-config-prettier`, `prettier`.
- Tooling: `eslint.config.js` (Expo flat config + prettier; `src/domain` forbidden from importing React/Expo/services/repositories), `.prettierrc`, `jest.config.js` + `jest.setup.ts` (mocks for speech, haptics, view-shot, expo-audio), `npm run validate` gate, `.replit`, `.env.example`.
- Feature-oriented `src/` tree (`app`, `components`, `features/*`, `domain/*`, `services/*`, `repositories/*`, `content/*`, `hooks`, `constants`, `theme`, `utils`, `types`).
- Theme tokens (`src/theme/tokens.ts`): palette, semantic colours, the nine drawing colours, spacing, radii, touch targets (48 min / 96 primary / 140 hero), typography, shadows, motion durations.
- Constants: character registry (Jelly / Princess renameable), every child-facing string and voice prompt, route table, layout timings.
- Domain schemas (zod 4) with inferred types: `ChildProfile`/`AppSettings`, `Creation`/filters, `CraftTemplate`/`CraftStep`/`CraftProgress` (with ordering and single-final-SAVE-step invariants), progression events / `GardenState` / `GardenItem` / data-driven `UnlockRequirement`, drawing `Stroke`/`StampPlacement`/`DrawingDraft`.
- Repository interfaces + complete in-memory implementations; shared repository contract test.
- Service interfaces (voice, music, SFX, camera, sync, analytics, assistant, event bus, logger) with silent/no-op defaults, `AppServices` container, `AppServicesProvider`/`useAppServices`, `useReducedMotion`.
- Routes: root layout with providers, `/` → `/home` redirect, scaffold Home with four primary tiles + parent entry, placeholder screens for Create / Garden / Music / Book / Parent so no route is blank.

**Architecture decisions**

- Zod 4 (`z.iso.datetime`) for all boundary validation; timestamps are ISO strings.
- Runtime container is a singleton created in `services/createAppServices.ts`; Phase 5/10 swap implementations there only.
- TypeScript 6 no longer auto-includes `@types/*`; `types: ["jest"]` is declared explicitly.
- `expo-status-bar` no longer accepts `backgroundColor` (edge-to-edge in SDK 57).

**Tests performed**

- `prettier --check`: pass. `expo lint`: 0 errors, 0 warnings. `tsc --noEmit`: pass. `jest`: 4 suites / 16 tests pass. `expo export --platform web`: 9 static routes exported, no errors.
- App launch verified via static web export (routes `/`, `/home`, `/create`, `/garden`, `/music`, `/book`, `/parent` resolve).

**Known limitations**

- Not run on iOS/Android hardware in this environment.
- Web preview uses in-memory storage (by design until Phase 5).

**Next**: Phase 2 — design system.

---

## Phase 2 — Design system and original art

**Built**

- Components: `BigButton` (icon-first, voice-on-press, SFX + haptic, spring press animation, 96/140 px), `IconButton` (round, ring for selected state), `HoldButton` (press-and-hold with progress ring), `ScreenShell` (safe-area frame with one obvious Home button), `Card`, `FriendlyError` ("Oops! Let's try again."), `Celebration` (gentle overlay), animations `Bounce` and `Sparkle` (both respect reduced motion), and a 39-glyph original hand-authored SVG `Icon` set that doubles as the stamp library.
- Hooks: `ProfileProvider`/`useProfile` (loads the local child profile + settings, optimistic updates), `useVoice` (gated by `voiceEnabled`), `useSfx` (gated by `soundEffectsEnabled`, light haptics off-web).
- Test utilities: `renderWithServices` (RNTL v14 async render with in-memory services), first component test.
- Original artwork generated in one consistent soft/bright sticker style and chroma-keyed to transparent PNGs with a pure-PIL pipeline (`asset-work/chroma.py`, kept outside the repo): Jelly, the Princess, Diamond Island background, seven Clay Cup step cards, four garden items (sprout, flower, tree, diamond cluster). App icon, favicon, splash icon and Android adaptive/monochrome icons derived from them.

**Architecture decisions**

- Reanimated shared values use `.get()`/`.set()` (React Compiler `react-hooks/immutability` rule rejects `.value =` writes in callbacks).
- Jest uses `react-native-worklets/jest/resolver` + `setUpTests()` + gesture-handler `jestSetup` so Reanimated components render under test.
- `StyleSheet.absoluteFillObject` no longer exists in RN 0.86; explicit absolute positioning is used.
- Selected state is never colour-only (ring + accessibilityState).

**Tests performed**

- `prettier --check`, `expo lint` (0/0), `tsc --noEmit`, `jest` 5 suites / 18 tests — all green.

**Known limitations**

- Generated art is placeholder-quality for a personal MVP; a professional illustrator pass is recommended before any wider release. Icon PNGs are unoptimised (~5 MB total assets).

**Next**: Phase 3 — intro + Diamond Island home.

---

## Phase 3 — Intro and Diamond Island home

**Built**

- `IntroScreen`: logo (1.4 s) → island → "Tap the princess!" (voice) → tap (or 6 s auto-advance) → sprout, flower and diamond zoom in with sparkles and a chime → Jelly appears with "Hi! I'm Jelly!" and the spoken welcome → home. Marks `introSeen`; returning users get a large SKIP. Whole sequence lands in ~6–9 s.
- `HomeScreen`: full-bleed island scene, four hero `BigButton`s (Create / My Garden / Music Reef / My Diamond Book) sized to orientation, Jelly bouncing in the corner (tap repeats the hint), quiet lock control for grown-ups. Speaks "What do you want to do?" on open.
- `CreateHubScreen` driven by `content/creationModes.ts` (Draw & Paint, Craft With Me); adding a mode is one registry entry.
- `JellyGuide` + `SpeechBubble` character components; `constants/images.ts` illustration registry (content refers to images by key).
- Placeholder routes for `/create/draw` and `/create/craft/[craftId]` so no navigation dead-ends.
- Router smoke test with `expo-router/testing-library`: Home renders all four areas, speaks its hint, navigates to Create and on to Draw.

**Decisions**

- `renderRouter` returns a thenable whose pathname helpers live on the thenable while queries live on the awaited result; tests hold both.
- Jest `moduleNameMapper` maps `@/assets/*` to the repo `assets/` folder; `standard-navigation` added to the transform allow-list.

**Tests performed**: prettier, lint (0/0), tsc, jest 6 suites / 19 tests — green.

**Known limitations**

- `renderRouter` under RNTL 14 logs "overlapping act() calls" warnings; tests pass. Tracked for cleanup in Phase 13.
- The intro cannot be visually verified in this environment; timings follow the spec and should be tuned on a device with PJ.

**Next**: Phase 4 — drawing system.

---

## Phase 4 — Drawing system

**Built**

- Pure domain: `drawingReducer` (begin/extend/end stroke, stamps, undo/redo with 50-step history, clear, load; eraser paints background colour; sub-1.5 px samples dropped), `pointsToSvgPath` (quadratic smoothing), `summarizeDrawing` (dominant colour by ink, stamp list), `friendlyDrawingName`/`friendlyCraftName` ("PJ's Yellow Star", "My Cup"), `createProgressionEvent`.
- Content: `content/stamps.ts` — the nine stamps PJ asked for (diamond, flower, leaf, star, jellyfish, crown, heart, robot, pig) as a pack; icons tint with the chosen colour.
- `saveDrawing` use-case: asset → creation (auto-title, metadata) → `DRAWING_COMPLETED` + `CREATION_SAVED` events → clear draft; any failure returns `Result.err` and leaves the draft intact.
- `useDrawing` hook: tool/colour/stamp selection, reducer, draft restore on mount, autosave every 5 s, on app background and on unmount.
- UI: `DrawingCanvas` (SVG paths via PanResponder — touch and mouse; committed strokes memoised; stamps as tinted icons in the capture container), `ColorPalette` (nine 64 px circles, ring + check for selection), `StampTray`, `DrawingToolbar` (brush/crayon/eraser/stamps, undo always visible, redo, hold-to-clear, big green save), `DrawScreen` (canvas fills the screen, tools on the side in landscape, colours along the bottom, celebration + "Draw again / My Diamond Book" after save, friendly error with retry).
- Tests: reducer, path/analysis, friendly names, save use-case (success + storage failure keeps draft).

**Decisions**

- Stamps render above strokes (z-order between stamps and later strokes is not preserved) — acceptable for MVP, noted in ROADMAP.
- Full image doubles as thumbnail until Phase 13 adds downscaling.
- React Compiler lint: refs are never written during render; the PanResponder is derived from the callback props.

**Tests performed**: prettier, lint (0/0), tsc, jest 10 suites / 33 tests — green.

**Known limitations**: canvas capture on web uses base64 via view-shot's DOM path — verify in the web preview; device rendering performance not measured here.

**Next**: Phase 5 — local persistence.

---

## Phase 5 — Local persistence

**Built**

- `SqlExecutor` interface (exec/run/getAll/getFirst) so repositories are driver-agnostic; `openExpoDatabase` adapts `expo-sqlite` (WAL, migrations via `PRAGMA user_version`).
- Versioned `MIGRATIONS` (v1: creations, garden_states, progression_events, craft_progress, drawing_drafts + indexes).
- `SqliteCreationRepository`, `SqliteGardenRepository`, `SqliteCraftProgressRepository`, `SqliteDraftRepository` — every read is validated through the zod schemas; JSON columns for nested state.
- `FileSystemAssetStore` on the SDK 57 `File`/`Directory`/`Paths` API under `Paths.document/pjs-diamond-world/{creations,photos,thumbnails}`; base64 decoder without Buffer.
- `AsyncStorageSettingsRepository` (nickname + settings; forward-compatible defaults; corrupt data → defaults).
- `createDeviceRepositories`: SQLite + FileSystem + AsyncStorage on iOS/Android; memory + AsyncStorage on web; loud fallback to memory if SQLite fails to open.
- `createAppServices` is now async; root layout keeps the native splash until storage is ready.
- Tests: repository contract now runs against **both** memory and real SQLite (`node:sqlite` adapter, Node 24 built-in), migration idempotency, settings repository, base64 decoder.

**Decisions**

- Web preview keeps creations in memory (expo-sqlite on web needs wasm hosting configuration — deferred; documented in ARCHITECTURE §7). Settings persist on web via localStorage.
- The official AsyncStorage Jest mock is registered globally.

**Tests performed**: prettier, lint (0/0), tsc, jest 13 suites / 42 tests — green.

**Known limitations**: `FileSystemAssetStore` is not exercised in Jest (expo-file-system is mocked); it follows the documented SDK 57 API and must be verified on the first device run.

**Next**: Phase 6 — My Diamond Book.

---

## Phase 6 — My Diamond Book

**Built**

- `useCreations` / `useCreation` hooks (focus-refresh, optimistic favourite toggle with rollback).
- `CreationCard` (big picture, type badge, heart badge), `FilterBar` (ALL / DRAWINGS / CRAFTS / FAVORITES as large icon pills, spoken on tap), `DiamondBookScreen` (2-column portrait / 3-column landscape `FlatList`, lazy rendering, Jelly empty-state hint), `CreationDetailScreen` (full-screen image over deep-sea background, big favourite heart).
- Routes `/book` and `/book/[creationId]`.
- Router test: lists, filters (CRAFTS, FAVORITES → empty state), opens detail, toggles favourite and verifies persistence.

**Decisions / findings**

- RNTL 14's `fireEvent.press` is asynchronous; every press in tests is now awaited. This also removed the "overlapping act()" warnings noted in Phase 3.
- Thumbnails come from `thumbnailUri` (currently the full asset); `expo-image` handles caching/recycling.

**Tests performed**: prettier, lint (0/0), tsc, jest 14 suites / 43 tests — green.

**Next**: Phase 7 — Craft Activity Engine.

---

## Phase 7 — Craft Activity Engine

**Built**

- `domain/craft/craftEngine.ts`: pure session machine — `createCraftSession` (resumes unfinished progress, ignores completed), `nextStep`/`previousStep` (clamped), `attachPhoto`, `canComplete` (SAVE step; photo encouraged, never required), `progressRatio`, `toCraftProgress`.
- `content/crafts/`: registry validated with `craftTemplateSchema` at load; first data file `clayCup.ts` (PJ's seven steps, voice prompts, illustration keys, reward → flower).
- `saveCraft` use-case: photo → app storage, or `asset://<imageKey>` bundled illustration when there is no photo; creation "My Cup"; events `CRAFT_COMPLETED`, (`PHOTO_SAVED`), `CREATION_SAVED`, `ACTIVITY_COMPLETED`; clears progress; failure keeps progress.
- `useCraftSession` (resume + persist every step change), `StepDots` (non-textual progress), `CraftStepView` (huge illustration, few words, spoken prompt on arrival, BACK + very large NEXT, per-step animation hint), `PhotoStep` (take / no picture today / keep / try again), generic `CraftPlayer` + `CraftPlayerScreen` (camera UI injected via `renderCamera` so the player stays platform-agnostic), route `/create/craft/[craftId]`.
- Tests: engine, content validity (every step illustration exists; PJ's seven steps in order), save use-case with and without photo.

**Decisions**

- Inner-component pitfall avoided: `CraftPlayer` is a top-level component (an inline definition would remount and lose the session on every render).
- Bundled illustrations are addressed with an `asset://` URI scheme so creations without photos still render in the Book.

**Tests performed**: prettier, lint (0/0), tsc, jest 17 suites / 51 tests — green.

**Next**: Phase 8 — PJ's Clay Cup camera capture and end-to-end flow.

---

## Phase 8 — PJ's Clay Cup: camera and end-to-end flow

**Built**

- `ExpoCameraService` (live camera on device, `expo-image-picker` fallback on web/no camera; permission asked in the moment; errors logged, never shown).
- `CameraCapture`: full-screen `CameraView` with one hero shutter, cancel, and a friendly permission screen ("Yes" / "No picture today"). Captures stay in cache until `saveCraft` copies them into app storage.
- Route `/create/craft/[craftId]` injects `CameraCapture` via `renderCamera`; `createAppServices` wires the camera service.
- `domain/creation/assetUri.ts` + `utils/imageSource.ts`: `asset://` bundled illustrations render in the Book card and detail.
- `Celebration` now hosts action buttons _inside_ the modal card (Draw: "Draw & Paint" / "My Diamond Book"; Craft: Book / Garden / Home).
- `renderApp` test helper (providers + `renderRouter` + **real timers restored**).
- Tests: full Clay Cup flow with a picked photo (progress persisted at step 6, events in order, progress cleared, navigation to Book) and the no-photo path (bundled illustration).

**Findings**

- `expo-router/testing-library`'s `renderRouter` calls `jest.useFakeTimers()`; real async chains in app code stalled under it. `renderApp` restores real timers after the initial render. One `renderRouter` per test file.
- Accessibility bug caught by the test: buttons rendered _behind_ an `accessibilityViewIsModal` overlay are unreachable — moved into the celebration card.

**Tests performed**: prettier, lint (0/0), tsc, jest 19 suites / 53 tests — green.

**Known limitations**: live camera path (`CameraView`, `takePictureAsync`) is mocked in Jest and must be verified on a device.

**Next**: Phase 9 — progression engine and My Garden.

---

## Phase 9 — Progression engine and My Garden

**Built**

- `domain/progression/engine.ts`: pure `applyCounters` / `evaluateRequirement` / `applyEvent` / `replayEvents`; points per event (creation +1, drawing +1, craft +reward, photo +1), gentle levels (`1 + points/10`), unlocks only ever added.
- `content/garden/items.ts`: seven data-defined items — sprout (1 creation), flower (1 craft), tree (3), diamond (5), jellyfish friend (20 points), second flower (4 drawings), sparkly diamond (10) — validated at load.
- `ProgressionService`: subscribes to the event bus, serialises events through a queue, persists state + event log, announces unlocks to listeners and publishes `GARDEN_ITEM_UNLOCKED`. Started inside the service container so runtime and tests share one wiring.
- `useGarden` hook (focus refresh, live unlock announcements) and `GardenScreen` (island scene, unlocked items placed by fractional position with gentle bounce, ambient sparkles scale with points, Jelly hint when empty, "A sprout appeared!" celebration with Done).
- Tests: engine (sprout/flower/tree/diamond ladder, idempotence, replay), service (ordered queue, persistence, announcements, stop), Garden screen (empty hint → unlock → item rendered).

**Findings**

- Fixed a deadlock: a bus subscriber must not return the processing-queue promise when the handler itself publishes to the bus. Subscribers fire-and-forget into the queue; `whenIdle()` waits until the queue stops growing.

**Tests performed**: prettier, lint (0/0), tsc, jest 22 suites / 60 tests — green.

**Next**: Phase 10 — Music Reef.

---

## Phase 10 — Music Reef

**Built**

- Placeholder audio, synthesised in pure Python (`wave` module) and committed as WAV: three original loops ("Princess Waltz" 3/4 arpeggio, "Sea Breeze" pad + filtered wave noise, "Creative Jam" pentatonic) and seven short cues (tap, bubble, sparkle, grow, save, celebrate, oops). All flagged `placeholder: true` in `content/music/tracks.ts`.
- `ExpoMusicService` (expo-audio, looping, volume clamped to 0.85, never throws), `ExpoSoundEffectService` (one lazy player per cue, restarts from 0), `ExpoSpeechPromptService` (expo-speech, short prompts interrupt each other). Wired in `createAppServices`; the test container's `SilentMusicService` now carries the real playlist.
- `useMusic` (`useSyncExternalStore` over the service; settings-aware toggle; volume persisted to settings) and `useMusicController` mounted at the root (pauses when the parent disables music, syncs volume).
- `MusicReefScreen`: Jelly dances with sparkles while playing, big Play/Pause hero button, Next, three volume sizes (quiet/medium/loud — size and ring, not colour alone), track title live region.
- Tests: play/pause/next/volume persistence; music cannot start when the parent disabled it.

**Decisions**

- Music keeps playing across screens until paused; the parent toggle pauses it immediately.
- WAV chosen over MP3 for zero-dependency generation; ~1 MB total, acceptable for MVP. Replace with commissioned, compressed originals before release.

**Tests performed**: prettier, lint (0/0), tsc, jest 23 suites / 62 tests — green.

**Next**: Phase 11 — Parent Mode.

---

## Phase 11 — Parent Mode

**Built**

- `domain/profile/parentGate.ts`: arithmetic challenge (two-digit sums, four unique big-button options) and salted FNV-1a PIN hash (a child deterrent, explicitly not a security boundary).
- `ParentSessionProvider` (in-memory unlock flag; cleared on exit and cold start) mounted at the root; `ParentShell` redirects to the gate whenever locked, so deep links cannot bypass it.
- `ParentGateScreen`: press-and-hold (2 s) → arithmetic question, or the 4-digit `PinPad` when a PIN is set; wrong answers show "Not quite" and a fresh question.
- `ParentHomeScreen` (Settings / Creations / Privacy & storage / Exit), `ParentSettingsScreen` (music, SFX, voice, reduced-motion override, nickname — nickname only, PIN set/remove, replay intro, cloud backup toggle with honest "not configured" hint), `ParentCreationsScreen` (rename, export via `expo-sharing` for real files, delete with confirmation), `ParentPrivacyScreen` (plain-language privacy facts, storage usage, delete everything, technical log viewer).
- Routes `/parent`, `/parent/home`, `/parent/settings`, `/parent/creations`, `/parent/privacy`.
- Tests: gate logic; full parent flow (locked deep-link bounce, hold, wrong then right answer, settings persistence, rename, delete); PIN gate flow.

**Decisions**

- Parent UI uses adult typography/density (`parentStrings`) — it is not for the child and should not look inviting.
- Confirmations use native `Alert` on device and skip on web/tests (documented in code).

**Tests performed**: prettier, lint (0/0), tsc, jest 26 suites / 66 tests — green.

**Next**: Phase 12 — optional Firebase sync architecture.

---

## Phase 12 — Optional Firebase sync architecture

**Built**

- `SyncBackend` contract (tiny: configured/signedIn, uploadAsset, upsert/delete creation, upsert garden/profile) and `SyncQueueService`: local-first queue, latest-change-per-record, delete supersedes upsert, flushes only when configured **and** parent-enabled **and** signed in, failures stay queued, local data never touched, never blocks UI.
- `FirebaseBackend` (firebase JS SDK 12): Auth (email/password sign-in method for the future parent UI), Firestore top-level collections with `ownerId`, Storage under `parents/{uid}/…`; local file URIs and the PIN hash are never uploaded.
- `readFirebaseConfig` from `EXPO_PUBLIC_FIREBASE_*` only; `createSyncService` returns the no-op service when anything is missing.
- Wiring: save use-cases and `ProgressionService` enqueue + fire-and-forget flush; `SyncService.isConfigured()` added; Parent settings shows honest state (not configured / off / on).
- `firebase/firestore.rules`, `firebase/storage.rules` (owner-only, images < 10 MB, default deny), `firebase.json`, `firebase/README.md`.
- Tests: queue semantics against a fake backend (off → queued only; on → uploads + upserts, bundled assets not uploaded; failure retry; delete supersedes; gating), config reader.

**Known limitations**

- No parent sign-in screen yet (method exists on the backend; UI is on the roadmap). Without sign-in, sync stays disabled even when configured — by design.
- `FirebaseBackend` is not exercised in Jest (SDK untested here); the queue logic that matters is.

**Tests performed**: prettier, lint (0/0), tsc, jest 27 suites / 71 tests — green.

**Next**: Phase 13 — testing, accessibility, optimisation, polish.

---

## Phase 13 — Testing, accessibility, optimisation, polish

**Built**

- Real thumbnails: drawings capture a second 320-px PNG via view-shot; craft photos are resized to 320-px JPEG with `expo-image-manipulator` (`services/media/thumbnails.ts`). Both fall back to the full image on failure/web.
- `useReducedMotion` honours the parent's override from settings (Parent Mode → Motion) over the OS preference.
- Web export fixed: `expoDatabase.web.ts` keeps the SQLite driver out of the web bundle; `metro.config.js` registers `.wasm` as an asset for a future SQLite-on-web setup.
- Docs finalised: ROADMAP statuses + "First device run" checklist, ARCHITECTURE §14 post-build notes, this log.

**Final validation (`npm run validate`)**

- `prettier --check` ✓ · `expo lint` 0 errors / 0 warnings ✓ · `tsc --noEmit` (strict + noUncheckedIndexedAccess + exactOptionalPropertyTypes) ✓ · `jest` 27 suites / 71 tests ✓ · `expo export --platform web` 16 static routes ✓.
- Critical workflows covered by router tests: Home → Create → Draw; draw save use-case → Book → Garden progression; Home → Create → Craft With Me → Clay Cup (7 steps) → photo → save → Book; Garden unlock; Music Reef; Parent gate → settings → creations.

**Known issues / limitations (honest list)**

1. Not executed on iOS/Android hardware or in Replit in this environment. File system, camera, speech, audio and haptics are covered by mocks/contract tests only.
2. Music loops and voice are placeholders (synthesised WAV, on-device TTS). Replace before any release.
3. Illustrations are AI-generated originals in one style; an illustrator pass is recommended for a wider audience.
4. Web preview stores creations in memory only (settings persist).
5. No parent sign-in UI yet → cloud backup cannot be turned on in practice even when configured.
6. Stamps render above later strokes (z-order simplification).
7. `npm audit` reports advisories in transitive dependencies; review with `npm audit` before publishing.

---

## Phase 14 — Real-browser verification, web persistence, PWA, device readiness

**Why.** Phases 0–13 were validated by static checks and Jest only. This phase ran the actual app in a real Chromium browser (hosted single-file build) at three viewports and fixed everything found. iOS/Android still require a device run (see `docs/RUN_ON_DEVICE.md`).

**Built**

- `repositories/indexeddb/*`: IndexedDB-backed repositories (creations, garden, events, craft progress, drafts, data-URI asset store) behind the existing interfaces; memory key-value fallback when storage is denied. Contract test runs against `fake-indexeddb` and the memory store.
- `AsyncStorageSettingsRepository` never fails when storage is denied (sandboxed iframes) — falls back to in-memory cache.
- PWA: `public/manifest.json`, icons (192/512/maskable/apple-touch), `src/app/+html.tsx` with standalone/home-screen meta, overscroll and text-selection disabled while drawing.
- `services/media/captureDrawing(.web).ts`: web save no longer relies on `react-native-view-shot` (unreliable for SVG in browsers); the stroke layer + stamp SVGs are serialised from the DOM and rasterised to PNG via `<canvas>`, including a 320-px thumbnail. Native keeps view-shot.
- `services/audio/userGesture.ts`: on web, audio/speech wait for the first user interaction (browser autoplay policy) and autoplay rejections are downgraded to a log instead of unhandled promise errors.
- `eas.json` (development / preview APK / production), `expo-asset` peer dependency (expo-doctor 21/21 after fix), `.github/workflows/web.yml` (lint → typecheck → test → export → GitHub Pages), `docs/RUN_ON_DEVICE.md`, `scripts/build-single-file-web.mjs` (test hosting only).
- Web debug hook: `window.__pjsLogger` exposes the technical ring-buffer log in browser builds.

**Bugs found in the browser and fixed**

| #   | Found                                                                                                               | Fix                                                                                      |
| --- | ------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| 1   | Save on web showed "Oops" (view-shot cannot capture the SVG canvas)                                                 | Own SVG→canvas rasteriser on web                                                         |
| 2   | Craft step illustration invisible when the step animates (Bounce wrapper had no height → flex child collapsed to 0) | Bounce fills the stage                                                                   |
| 3   | Landscape tablet: vertical toolbar overflowed; Save button clipped behind the palette                               | Compact, scrollable vertical toolbar                                                     |
| 4   | Home tiles uneven (two-line label grew one tile)                                                                    | BigButton fills its box; labels auto-fit                                                 |
| 5   | Phone portrait: toolbar Start-over/Save and the black colour off-screen; "No picture today" overflowed              | Wrapping toolbar rows, wrapping colour rows (56 px on phones), wrapping craft button row |
| 6   | Unhandled `play()` rejections before first interaction (web autoplay policy)                                        | User-gesture gate + rejection guard                                                      |
| 7   | Draft restore could overwrite strokes drawn before the async restore resolved                                       | Restore only applies while the canvas is empty                                           |
| 8   | "Save My cup" capitalisation                                                                                        | Capitalised noun                                                                         |
| 9   | expo-doctor: missing `expo-asset` peer dependency (would crash outside Expo Go)                                     | Installed + config plugin                                                                |

**Browser test matrix (Chromium, hosted build, all with 0 uncaught errors after fixes)**

| Viewport                | Intro → Home | Draw (mouse) | Draw (touch) | Stamps/undo/redo | Save → Book card | Book detail + favourite | Clay Cup 7 steps | Skip photo → Save → celebration | Garden unlocks     | Music play/pause/next/volume | Parent gate hold + sum | Layout fits          |
| ----------------------- | ------------ | ------------ | ------------ | ---------------- | ---------------- | ----------------------- | ---------------- | ------------------------------- | ------------------ | ---------------------------- | ---------------------- | -------------------- |
| iPad landscape 1024×768 | ✓            | ✓            | ✓            | ✓                | ✓                | ✓                       | ✓                | ✓                               | ✓ (sprout, flower) | ✓                            | ✓                      | ✓ (after fixes 3, 4) |
| Phone portrait 390×844  | ✓            | —            | ✓            | —                | ✓                | —                       | ✓                | ✓                               | ✓                  | ✓ (fits)                     | —                      | ✓ (after fix 5)      |
| Desktop 1440×900        | ✓            | ✓            | —            | —                | ✓                | —                       | —                | —                               | —                  | —                            | —                      | ✓                    |

**Known limitations (honest)**

- The hosted _test_ build lives on a sandboxed static host that denies IndexedDB/localStorage: it demonstrates the app but does not keep creations between reloads and replays the intro every time. Real web use needs normal static hosting (GitHub Pages via the included workflow, or any host) — then IndexedDB persistence and the Skip button work.
- iOS/Android not executed here. `eas.json` + `RUN_ON_DEVICE.md` make the first device run a 5-minute task with Expo Go.
- The photo step on web uses the picker (no live camera); the live camera path is native-only and mocked in Jest.
- Music/voice remain placeholders.

**Tests performed**: prettier, lint 0/0, tsc strict, jest 28 suites / 82 tests, `expo export --platform web` 16 routes, `expo-doctor` 21/21, plus the browser matrix above.

### Phase 14 follow-up — iOS Safari "Unmatched Route" (reported by JP, 2026-09-14 21:17)

**Symptom:** opening the hosted test build on an iPhone showed Expo Router's "Unmatched Route — Page could not be found" for `/p/<id>?v=4`.
**Cause:** the single-file build normalised the host path with `history.replaceState` before boot. WebKit throws `SecurityError` for history APIs inside a sandboxed iframe (opaque origin); Chromium allows them, which is why the desktop/tablet/phone Chromium passes were green. The router then read `/p/<id>` as a route.
**Fix:**

- `src/app/[...unmatched].tsx` — catch-all route that redirects any unknown URL to the intro. Correct on every host (Pages, Replit, sandbox); a child never sees a dead-end screen. Router test added (`src/app/__tests__/unmatched.test.tsx`).
- Boot script: when history APIs throw, they are replaced with no-ops so in-app navigation keeps working through router state. `?nohistory=1` reproduces the Safari condition in any browser.
  **Verified:** Chromium with `?nohistory=1` → intro → home → Create → Draw → Home, URL unchanged, 0 errors. Gate: lint 0/0, tsc, 29 suites / 83 tests, export 17 routes.
  **Still true:** this host denies storage, so nothing persists between visits; GitHub Pages (or any static host) is the real destination.

## Plan 3 — "make it fast, make it a learning adventure" (approved by JP 2026-09-19)

JP's feedback on the MVP (2026-09-18): "laggy" on every device, features "lame"; wants a far more interactive, creative _and_ educational app (Philippines Grade 1 level: letters/phonics/tracing, numbers/counting/shapes, stories/read-along, science/animals/nature). Plan: A1 performance → A2 fast canvas → B1 world + daily quest + collections → B2/B3 activity engines → B4 content wave → deploy to GitHub Pages.

### Phase 15 (A1) — Performance baseline and quick wins (2026-09-19)

**Baseline measured first** (`expo export --platform web --source-maps`, package breakdown from the source map):

- One JS bundle for all 17 routes: **4.20 MB raw / 957 KB gzip**. Inside: `@firebase/*` ≈ 1.9 MB of source loaded eagerly although sync is off by default, `expo-router` 1.2 MB, `zod` 0.8 MB, `react-native-reanimated` 0.74 MB, `react-native-web` 0.72 MB, `react-dom` 0.53 MB, `react-native-gesture-handler` 0.44 MB (only for the root wrapper).
- Assets: **5.2 MB PNG** (768-px characters at ~400 KB each, 640-px craft steps at ~300 KB) + **1.1 MB WAV**; PWA icons 255 KB + 171 KB.
- The link JP tested was additionally the 10 MB single-file build inside a sandboxed iframe with storage denied (no caching, no persistence) — that build is no longer on any delivery path.

**Changes**

| Area              | Change                                                                                                                                                                                                                                 | Effect                                                                          |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Firebase          | `services/sync/index.ts` loads `FirebaseBackend` with `await import()`; `createSyncService` is async                                                                                                                                   | Own chunk (235 KB gz) never fetched unless a Firebase config exists             |
| Code splitting    | `utils/lazyScreen.tsx` (`React.lazy` + Suspense + quiet `ScreenLoading`); route files for draw, craft + camera, book ×2, garden, music, parent ×5 are lazy. Intro/home/create hub stay in the entry                                    | 17 chunks; Draw chunk 26 KB, Camera 26 KB, parent screens 3–8 KB                |
| Gesture handler   | `GestureHandlerRootView` removed from the root layout (experiment proved nothing else imports RNGH)                                                                                                                                    | −53 KB gz from the entry; A2 mounts its own root inside the Draw chunk          |
| Images            | Runtime illustrations → WebP (characters 512 px, crafts 512 px, garden 384 px, island 1280 px; q80–85). App icon/splash/adaptive icons stay PNG (OS requirement). PWA icons palette-quantised                                          | 3.85 MB → 396 KB; icon-512 255 KB → 31 KB                                       |
| Audio             | WAV → MP3 (music 96 kbps, cues 64 kbps) — plays natively on iOS, Android and all browsers                                                                                                                                              | 1.1 MB → 300 KB                                                                 |
| Animations        | `Bounce` and `Sparkle` → Reanimated CSS animations (`css.keyframes`): compositor on web, UI thread on native, zero JS per frame                                                                                                        | Idle screens no longer spend JS time animating                                  |
| Offline / repeat  | `scripts/postexport.mjs` (in `npm run export:web`): `404.html`, manifest base path, generated `sw.js` precaching every file (cache-first for hashed files, network-first app shell, cache version = hash of contents)                  | Second launch from cache; works with no network                                 |
| Hosting base path | `app.config.js` reads `EXPO_PUBLIC_WEB_BASE` → `experiments.baseUrl`; `+html.tsx` and the manifest/SW use the same base; `.github/workflows/web.yml` computes it from the repo name and runs on `main`/`master`, then `npm run budget` | GitHub Pages project sites (`/<repo>/`) work; previously only a root domain did |
| Budget            | `scripts/check-bundle-budget.mjs` in `validate` and CI: entry ≤ 650 KB gz, all JS ≤ 950 KB gz, assets ≤ 1000 KB, single asset ≤ 160 KB                                                                                                 | Regressions fail the gate                                                       |
| Instrumentation   | `components/dev/FpsMeter` mounted only with `?fps=1` on web; `_sitemap` route disabled                                                                                                                                                 | Frame rate + long-frame count on a real device                                  |
| Tests             | `expo-router/testing-library` mocks Reanimated with `react-native-reanimated/mock`, which lacks the `css` API → `jest.config.js` maps it to `src/test-utils/reanimatedMock.js`. New `lazyScreen` test                                  | 30 suites / 84 tests                                                            |

**Result:** entry **2.69 MB raw / 606 KB gzip** (−37% gzip), total `dist/` **10 MB → 4.6 MB**, assets 772 KB. Budget passes with ~7% headroom.

**Measured (Playwright, headless Chromium, `perf-lab/measure.mjs`, 4× CPU slowdown, old commit `b253258` built in a worktree and served identically with gzip)**

| Condition                      | Build | Cold → intro visible | Idle / drawing fps (long frames) | Open Draw (first time) | Repeat launch   | Offline | Errors |
| ------------------------------ | ----- | -------------------- | -------------------------------- | ---------------------- | --------------- | ------- | ------ |
| localhost (no network cost)    | old   | 1.50–1.53 s          | 59–60 (0–1)                      | 0.23–0.28 s            | 0.78–0.82 s     | no      | 0      |
|                                | new   | 1.40–1.54 s          | 60 (0)                           | 0.54–0.56 s            | 0.52–0.62 s     | **yes** | 0      |
| Fast 3G (1.6 Mbps, 150 ms RTT) | old   | **6.3–6.5 s**        | 58–60 (0–1)                      | 0.25–0.28 s            | 1.00–1.19 s     | no      | 0      |
|                                | new   | **4.5–4.6 s**        | 60–61 (0)                        | 0.50–0.55 s            | **0.53–0.57 s** | **yes** | 0      |

Tablet 1180×820, phone 390×844 and desktop 1440×900 all within the ranges above. Offline proof (`perf-lab/offline.mjs`): 67 files precached; with the network cut, `/home` renders in 129 ms with every resource served by the worker (transferSize 0) and in-app navigation works.

**Honest reading.** On a fast local connection the old build was not slow in Chromium either — the lag JP felt came from the network (10 MB inlined test build, 5 MB of PNG), zero caching in the sandboxed frame, and real-device GPU/CPU that headless Chromium cannot reproduce. What this phase changed for certain: 30% faster cold start on a slow network, 50% faster repeat launch, offline, 40% fewer bytes, and a lazy first open of Draw that costs ~0.3 s more once. What it did not change: the framework floor (expo-router + react-native-web + react-dom + reanimated ≈ 70% of the entry) and `zod` (~90 KB gz, `zod/mini` migration is the next cut). Drawing smoothness on a real finger is A2's job (canvas rewrite), not this phase's. Real-device numbers still need JP's tablet with `?fps=1`.

**Gate:** prettier ✓, lint 0/0, tsc strict ✓, jest 30 suites / 84 tests ✓, export 17 chunks / 16 routes ✓, budget ✓.

**Lazy-route smoke (`perf-lab/smoke.mjs`, tablet, 4× CPU):** `/home`, `/create`, `/create/draw`, `/create/craft/crf_clay_cup`, `/garden`, `/music`, `/book`, `/parent`, unknown URL → intro — all render their screen with the loader gone, 0 console/page errors, 0.3–1.2 s each cold.
