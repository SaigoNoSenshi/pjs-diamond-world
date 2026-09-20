# Architecture

## 1. Goals

Reliability, simplicity, child safety, maintainability, offline resilience, fast interaction, visual clarity. Protect the child's creations above everything else. Avoid architecture that prevents growth, without building a commercial backend prematurely.

## 2. Stack

| Concern            | Choice                                                                         | Why                                                                                                              |
| ------------------ | ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| Runtime            | Expo SDK 57, React Native 0.86, React 19, TypeScript 6 strict                  | Expo Go compatible, no custom native builds                                                                      |
| Navigation         | Expo Router (file-based, typed routes)                                         | Required; screens live in `src/app`                                                                              |
| Drawing            | `react-native-svg` + `react-native-gesture-handler` + `react-native-view-shot` | Works on iOS, Android and web preview; simple. Behind a `DrawingCanvas` abstraction so Skia can replace it later |
| Animation          | `react-native-reanimated` 4                                                    | Short feedback animations; gated by `useReducedMotion`                                                           |
| Structured storage | `expo-sqlite`                                                                  | Creation metadata, garden state, craft progress, event log                                                       |
| Binary assets      | `expo-file-system` (`File` / `Directory` / `Paths` API)                        | Drawings, photos, thumbnails in the app document directory                                                       |
| Settings           | `@react-native-async-storage/async-storage`                                    | Lightweight key-value settings only                                                                              |
| Audio              | `expo-audio` (music, SFX) + `expo-speech` (placeholder voice)                  | Offline, on-device                                                                                               |
| Camera             | `expo-camera` with `expo-image-picker` fallback                                | Web preview lacks a reliable camera path                                                                         |
| Validation         | `zod`                                                                          | Content packs and stored records are validated at the boundary                                                   |
| Cloud (optional)   | Firebase JS SDK (Auth, Firestore, Storage)                                     | Only when a parent enables sync; configured via env vars                                                         |
| Tests              | `jest-expo`, `@testing-library/react-native`                                   | Unit + component + navigation smoke                                                                              |
| Quality            | TypeScript strict, ESLint (`eslint-config-expo`), Prettier                     | Enforced by `npm run validate`                                                                                   |

Not used: heavy state libraries, LangChain/CrewAI-style frameworks, analytics SDKs, ad SDKs.

## 3. Layering

```
UI (src/app, src/features/*/screens, src/components)
  └─ feature hooks (src/features/*/hooks)  — React state, orchestration
       └─ domain (src/domain/*)             — pure TypeScript, no React, no I/O
       └─ services (src/services/*)         — audio, camera, sync, analytics, logging (I/O, platform)
       └─ repositories (src/repositories/*) — persistence behind interfaces
```

Rules:

- `domain/` imports nothing from React, Expo or repositories. It is unit-tested in isolation.
- `repositories/` expose interfaces (`CreationRepository`, `GardenRepository`, `SettingsRepository`, `CraftProgressRepository`, `AssetStore`). Implementations: SQLite/FileSystem/AsyncStorage for devices, in-memory for tests and web fallback.
- `services/` expose interfaces (`AudioPromptService`, `MusicService`, `SoundEffectService`, `CameraService`, `SyncService`, `AnalyticsService`, `Logger`, `CreativeAssistantService`) with default implementations chosen in `src/services/container.ts`.
- Screens are thin: they compose components and call feature hooks. No screen or component contains persistence or progression logic.
- One React context (`AppServicesProvider`) injects the service container. Feature state uses hooks; no global store.

## 4. Repository structure

```
src/
  app/                      Expo Router routes (thin)
    _layout.tsx             providers, fonts, splash handling
    index.tsx               intro / redirect
    home.tsx                Diamond Island
    create/                 index (hub), draw, craft/[craftId]
    garden.tsx
    music.tsx
    book/                   index, [creationId]
    parent/                 index (gate), settings, creations, privacy
  components/               design-system primitives (BigButton, IconButton, ScreenShell, Card, ...)
  features/
    home/  intro/  drawing/  crafts/  garden/  diamond-book/  music/  parent/
      components/  hooks/  (feature-local UI and orchestration)
  domain/
    creation/               Creation model, schema, friendly-name generator
    craft/                  CraftTemplate schema, CraftEngine (step state machine)
    progression/            events, rules evaluator, GardenState reducer
    profile/                ChildProfile, AppSettings schemas
  services/
    audio/  camera/  sync/  analytics/  logging/  assistant/  container.ts
  repositories/
    interfaces.ts  sqlite/  filesystem/  asyncstorage/  memory/  index.ts
  content/                  data packs: crafts, stamps, garden items, music tracks, colours
  hooks/                    cross-feature hooks (useReducedMotion, useAppServices, useVoice)
  constants/                characters, strings, routes, layout constants
  theme/                    tokens (colours, spacing, radii, typography, shadows)
  utils/                    ids, time, result helpers
  types/                    shared TS types and module declarations
assets/                     images, audio, fonts (all original)
docs/                       BUILD_LOG, ARCHITECTURE, PRODUCT_SPEC, CHILD_SAFETY, ROADMAP
firebase/                   firestore.rules, storage.rules (not deployed by the app)
__tests__/ or *.test.ts     colocated tests
```

## 5. Data model (domain)

All models are zod schemas with inferred TypeScript types (`src/domain/**/schema.ts`). Timestamps are ISO-8601 strings. IDs are prefixed UUIDs (`cre_…`, `crf_…`).

- `ChildProfile { id, nickname, avatar, createdAt, settings }`
- `AppSettings { musicEnabled, soundEffectsEnabled, voiceEnabled, cloudSyncEnabled, reducedMotion, introSeen, parentPinHash? }`
- `Creation { id, childId, type: 'DRAWING'|'CRAFT'|'PHOTO', title, thumbnailUri, assetUri, createdAt, updatedAt, favorite, metadata }`
- `CraftTemplate { id, title, description, icon, difficulty, estimatedMinutes, materials[], steps[], tags[], reward, illustration?, completionAction }`
- `CraftStep { id, order, instruction, illustration, audioPrompt, animation?, kind: 'INSTRUCTION'|'PHOTO'|'SAVE' }`
- `CraftProgress { craftId, childId, currentStepIndex, photoUri?, startedAt, updatedAt }`
- `GardenState { childId, level, creativityPoints, unlockedItems[], counters }`
- `GardenItem { id, type, name, unlockRequirement, asset, position }`
- `ProgressionEvent { type, occurredAt, payload }`

## 6. Key engines

### Craft Activity Engine (`domain/craft`)

Pure state machine: `createCraftSession(template)`, `next(state)`, `back(state)`, `attachPhoto(state, uri)`, `isComplete(state)`. Templates come from `content/crafts/*.ts` and are validated by `craftTemplateSchema` at load time. The `CraftPlayer` component renders any template. Adding a craft = adding a data file.

### Progression Engine (`domain/progression`)

`applyEvent(gardenState, event, rules): { state, unlocked[] }`. Rules are `GardenItem.unlockRequirement` objects (`{ kind: 'CREATIONS_AT_LEAST', count }`, `{ kind: 'CRAFTS_AT_LEAST', count }`, `{ kind: 'EVENT', type }`, `{ kind: 'POINTS_AT_LEAST', points }`). The `ProgressionService` subscribes to the in-process `EventBus`, persists state through `GardenRepository`, and emits `GARDEN_ITEM_UNLOCKED`. Screens dispatch events; they never compute unlocks.

### Content registry (`content/`)

Creation modes, stamp packs, crafts, garden items, music tracks, and colours are typed data arrays. Future packs (stories, puzzles, letters) add a new content type + schema + renderer without touching existing features.

### Drawing (`features/drawing`)

`useDrawing()` holds a stroke/stamp list with undo/redo stacks. `DrawingCanvas` renders strokes as SVG paths (committed strokes are memoised; only the active stroke re-renders). Drafts autosave every 5 s and on blur through `DraftRepository`. Save = capture PNG with view-shot → `AssetStore` → thumbnail → `Creation` → `CREATION_SAVED` + `DRAWING_COMPLETED`.

## 7. Persistence

- SQLite schema versioned in `repositories/sqlite/migrations.ts`.
- `AssetStore` writes to `Paths.document/creations/{id}/` (`asset.png`, `thumb.png`) and photos to `Paths.document/photos/`.
- The web preview uses the in-memory repositories (SQLite on web needs wasm hosting configuration; deferred). Behaviour is identical through the interfaces.
- Writes are never lost on error: the save flow writes the asset first, then metadata; failures surface as "Oops! Let's try again." with the draft intact.

## 8. Sync (optional)

`SyncService` interface: `isEnabled()`, `enqueue(change)`, `flush()`. Default: `NoopSyncService`. `FirebaseSyncService` is implemented behind the same interface and only instantiated when `EXPO_PUBLIC_FIREBASE_*` env vars exist and the parent enabled sync. Firestore layout: `parents/{parentId}`, `childProfiles/{childId}`, `creations/{creationId}`, `gardenStates/{childId}`, `settings/{profileId}`; assets in Storage under `parents/{parentId}/…`. Rules in `firebase/` restrict access to the owning parent.

## 9. Audio

- `MusicService` (expo-audio): playlist of local tracks, play/pause/next/volume; volume clamped, starts at 0.6.
- `SoundEffectService`: short SFX by key.
- `AudioPromptService`: `speak(promptKey | text)`. MVP implementation uses expo-speech; a `RecordedAudioPromptService` can map keys to files later.
- All three respect `AppSettings` flags and are silent on web when unsupported.

## 10. Error handling and logging

`Logger` (console in dev, in-memory ring buffer otherwise). Child-facing failures render `FriendlyError` ("Oops! Let's try again.") with a retry. No technical strings reach the UI.

## 11. Testing strategy

- Domain: exhaustive unit tests (craft engine, progression rules, friendly names, schemas).
- Repositories: in-memory implementations tested against a shared contract test; SQLite implementation tested through the same contract using a mocked driver where feasible.
- Components: BigButton, ColorPalette, CraftPlayer render tests.
- Flows: renderRouter smoke tests for Home → Create → Draw → Save → Book → Garden and the Clay Cup flow using in-memory services.
- `npm run validate` = format check → lint → typecheck → tests → web export.

## 12. Future AI

`CreativeAssistantService` interface (`suggestDrawingPrompt`, `recommendCraft`, `narrate`) with `LocalCreativeAssistant` returning curated content. No provider dependency. Any real provider must sit behind a child-safe layer per `CHILD_SAFETY.md`.

## 13. Known technical risks

1. SVG stroke count in very long sessions → mitigated by memoised committed layers; Skia is the escape hatch.
2. `expo-sqlite` on web → in-memory fallback; persistence on web is not an MVP target.
3. View-shot on web relies on html2canvas-style capture → drawings on web are saved as SVG-rendered PNG best-effort.
4. TTS voice quality varies by device → placeholder only.
5. No device testing in the build environment → first device run should follow the checklist in BUILD_LOG.

## 14. Post-build notes (what actually shipped in the MVP)

- **Testing model.** Domain and services are unit-tested with in-memory repositories; the SQLite repositories run the same contract test against Node's built-in `node:sqlite`. Screens are tested with `renderApp` (`src/test-utils/renderApp.tsx`), which wraps `expo-router/testing-library`'s `renderRouter` in the real providers and **restores real timers** after the initial render (renderRouter switches Jest to fake timers, which stalls real async chains). RNTL 14 is async: every `fireEvent` and `render` is awaited. One `renderRouter` per test file.
- **Service container.** `createTestServices` is also the runtime assembler: `createAppServices` only swaps in device implementations (SQLite/FileSystem/AsyncStorage, expo-camera, expo-audio, expo-speech, thumbnails, Firebase sync). `ProgressionService` is started inside the container so runtime and tests share one wiring.
- **Event bus rule.** Subscribers that publish back to the bus must not return their processing promise to the bus (deadlock). `ProgressionService` fires-and-forgets into an ordered queue and exposes `whenIdle()`.
- **Sync.** `SyncQueueService` (local-first queue, gated on configured + parent-enabled + signed-in) over a tiny `SyncBackend`; `FirebaseBackend` is the only adapter. No parent sign-in UI yet.
- **Thumbnails.** Drawings capture a second 320-px PNG via view-shot; craft photos are resized with `expo-image-manipulator`. Web preview uses the full image.
- **Accessibility.** Post-save actions live inside the `Celebration` modal card (elements behind an `accessibilityViewIsModal` overlay are unreachable). Selection is always ring/check + `accessibilityState`, never colour alone. The parent's reduced-motion override is read by `useReducedMotion`.
- **Not verified here.** iOS/Android native paths (file system, camera, speech, audio, haptics) and Replit's runtime — see ROADMAP "First device run".

## 15. Web build specifics

- Persistence: `repositories/indexeddb` (IndexedDB; memory KV when denied). Assets are data URIs. Settings stay in AsyncStorage/localStorage with an in-memory fallback.
- Save: `services/media/captureDrawing.web.ts` serialises the live SVG canvas and rasterises it with `<canvas>`; native uses view-shot (`captureDrawing.ts`). Metro picks the platform file.
- Audio: `services/audio/userGesture.ts` gates playback/speech on the first user interaction and guards autoplay rejections.
- PWA: `public/manifest.json`, `public/icons/*`, `src/app/+html.tsx`. `scripts/postexport.mjs` (run by `npm run export:web`) adds `404.html`, rewrites the manifest for the base path and generates `sw.js`, a precaching service worker (cache-first for hashed files, network-first for the app shell, cache version = hash of file contents) so repeat launches are instant and offline works.
- Hosting: any static host serving `dist/`. `app.config.js` reads `EXPO_PUBLIC_WEB_BASE` (e.g. `/pjs-diamond-world` for a GitHub Pages project site) into `experiments.baseUrl`; `+html.tsx` and `postexport.mjs` use the same value. `.github/workflows/web.yml` computes it from the repository name. The former single-file test build (`scripts/build-single-file-web.mjs`) was removed in Plan 3/A1: it inlined every asset (10 MB), could not cache or persist inside a sandboxed frame, and is incompatible with lazy chunks. Test builds now go to a real static host.

## 16. Performance model (Plan 3 / A1)

- **Code splitting.** Route files wrap feature screens in `utils/lazyScreen.tsx` (`React.lazy` + `import()`); Metro emits one chunk per lazy screen on web (`DrawScreen-*.js`, `CraftPlayerScreen-*.js`, `CameraCapture-*.js`, `Parent*Screen-*.js`, …). Intro, home and the Create hub stay in the entry. The Firebase SDK is behind `await import()` in `services/sync/index.ts` and is a separate chunk that is never fetched unless a config exists.
- **No gesture-handler in the entry.** `GestureHandlerRootView` is not mounted at the root (≈50 KB gzip); a screen that needs UI-thread gestures mounts its own root inside its lazy chunk.
- **Ambient animations are CSS animations** (`react-native-reanimated`'s `css.keyframes`): `Bounce` and `Sparkle` run on the browser compositor / native UI thread with zero JS per frame. Imperative shared values remain for gesture-driven or one-shot interactions (`BigButton` press).
- **Assets.** Runtime illustrations are WebP (≤ 512 px, 20–47 KB each); audio is MP3 (music 96 kbps, cues 64 kbps). App icons/splash stay PNG (OS requirement). PWA icons are palette-quantised.
- **Budget.** `scripts/check-bundle-budget.mjs` (in `npm run validate` and CI) fails when the entry exceeds 650 KB gzip, all JS 950 KB gzip, assets 1000 KB, or one asset 160 KB. Baseline before A1: 957 KB gzip entry in one chunk, 5.2 MB PNG, 1.1 MB WAV.
- **Instrumentation.** `?fps=1` on web mounts `components/dev/FpsMeter` (frame rate + long-frame count). `perf-lab/` (outside the repo) holds the Playwright measurement harness used in `docs/BUILD_LOG.md`.
- **Known remaining weight.** expo-router + react-native-web + react-dom + reanimated are the floor (~70% of the entry). `zod` classic adds ~90 KB gzip; migrating the schemas to `zod/mini` is the next meaningful cut.
- **Jest note.** `expo-router/testing-library` mocks Reanimated with `react-native-reanimated/mock`, which lacks the `css` API; `jest.config.js` maps that path to `src/test-utils/reanimatedMock.js`.
