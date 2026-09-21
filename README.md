# PJ's Diamond World

**Live app (web):** https://saigonosenshi.github.io/pjs-diamond-world/ — open on the tablet, then Share → Add to Home Screen.

A child-first creative and learning world for a kindergartner (Philippines Grade 1 level): six learning islands — **Letter Lagoon** (tracing, phonics), **Number Cove** (counting, sorting, shapes, patterns), **Color & Art Bay** (drawing, coloring pages, sticker scenes, puzzles, music maker), **Science Shore** (animals, body, weather), **Story Reef** (read-along stories), **Craft Beach** (real crafts with a camera) — a **Daily Quest** with a treasure chest, diamonds and a 36-sticker album, plus **My Garden**, **Music Reef** and **My Diamond Book**. 79 original activities in the first wave; every activity is data, so the list keeps growing. Guided by **Jelly**, an original yellow jellyfish.

Built with Expo SDK 57, Expo Router, React Native, and TypeScript strict. Offline-first, local-only by default, no accounts, no ads, no tracking. See `docs/CHILD_SAFETY.md`.

## Run on a device

See `docs/RUN_ON_DEVICE.md` — web app (add to home screen, works offline), Expo Go over Wi-Fi, or an installable EAS build. `.github/workflows/web.yml` deploys the web app to GitHub Pages on every push to `main`/`master` (Settings → Pages → Source: GitHub Actions); the base path is computed from the repository name. `npm run export:web` builds `dist/` with the 404 fallback, manifest and service worker; `npm run budget` enforces the performance budget.

## Run locally

```bash
npm install
npm run web        # web (IndexedDB storage in the browser)
npm run ios        # Expo Go / simulator
npm run android    # Expo Go / emulator
```

In Replit, the included `.replit` runs `npm run web`.

## Quality gate

```bash
npm run validate   # prettier check → eslint → tsc → jest → expo export (web)
```

Individual steps: `npm run format`, `npm run lint`, `npm run typecheck`, `npm test`.

## Project layout

```
src/app            Expo Router routes (thin)
src/components     design system
src/features       home, intro, drawing, crafts, garden, diamond-book, music, parent
src/domain         pure TypeScript models + engines (craft, progression, creation, profile)
src/services       audio, camera, sync, analytics, logging, assistant + container
src/repositories   persistence behind interfaces (sqlite, filesystem, asyncstorage, memory)
src/content        data packs: crafts, stamps, garden items, music
docs/              PRODUCT_SPEC, ARCHITECTURE, CHILD_SAFETY, ROADMAP, BUILD_LOG
firebase/          Firestore + Storage security rules (optional cloud sync)
```

## Optional cloud sync

Disabled unless a parent turns it on in Parent Mode **and** Firebase is configured through environment variables (`EXPO_PUBLIC_FIREBASE_*`, see `.env.example`). Never commit credentials.

## Docs

- `docs/PRODUCT_SPEC.md` — what the product is and PJ's original ideas
- `docs/ARCHITECTURE.md` — layers, data model, engines, risks
- `docs/CHILD_SAFETY.md` — mandatory privacy and safety rules
- `docs/ROADMAP.md` — phases and what comes next
- `docs/BUILD_LOG.md` — what was built, validated, and known limitations per phase (Phase 14 = real-browser test matrix)
- `docs/RUN_ON_DEVICE.md` — tablet / phone / desktop setup
