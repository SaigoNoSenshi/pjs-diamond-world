# Running PJ's Diamond World on a tablet, phone or desktop

Three ways, from fastest to most "real app". All of them use the same code.

## 1. Web app (fastest — works today on iPad, Android tablets, phones, desktops)

**PJ's live app: https://saigonosenshi.github.io/pjs-diamond-world/** — deployed automatically from `main` by GitHub Actions. On the tablet: open it in Safari/Chrome → Share (or ⋮ menu) → **Add to Home Screen**.

The web build is a full version of the app that runs in Safari/Chrome and can be added to the home screen like an app. Creations are stored in the browser (IndexedDB) on the device. After the first visit a service worker keeps every file on the device, so the app opens instantly and **works offline** (car, plane, no Wi-Fi).

**Build**

```bash
npm install
npm run export:web      # expo export + 404 fallback + manifest + service worker → ./dist
npm run budget          # fails if the download got heavier than the performance budget
```

If the site will live under a sub-path (a GitHub Pages _project_ site is `https://<user>.github.io/<repo>/`), set the base path before exporting:

```bash
EXPO_PUBLIC_WEB_BASE=/<repo> npm run export:web
```

A root domain or a `<user>.github.io` repository needs no base path.

**GitHub Pages (recommended, free).** Push the repository to GitHub, then in the repo: Settings → Pages → Source: **GitHub Actions**. `.github/workflows/web.yml` runs lint → typecheck → tests → export → budget on every push to `main`/`master` and deploys `dist/`. It computes the base path from the repository name automatically. The URL is shown on the workflow run.

**Any other static host** (Cloudflare Pages, Netlify, Firebase Hosting): upload the contents of `dist/`. Set the SPA fallback to `index.html` (or rely on the generated `404.html`).

**On PJ's tablet:** open the URL in Safari (iPad) or Chrome (Android) → Share / menu → **Add to Home Screen**. It opens full-screen with the Diamond World icon and keeps working without internet.

Limits of the web version: camera capture uses the photo picker (take a photo with the camera app, then choose it); voice uses the browser's built-in speech; nothing leaves the device.

**Performance check on a real device:** open the URL with `?fps=1` appended (e.g. `https://…/?fps=1`). A tiny green frame-rate readout appears top-left; "long" counts frames over 50 ms (what a child feels as lag). Remove `?fps=1` for normal use.

## 2. Expo Go over Wi-Fi (5 minutes, for trying it on a real device while developing)

1. Install **Expo Go** from the App Store / Play Store on the tablet.
2. On your laptop, in this folder: `npm install` then `npx expo start`.
3. Scan the QR code with the tablet camera (iPad) or from inside Expo Go (Android). Laptop and tablet must be on the same Wi-Fi; use `npx expo start --tunnel` if not.

Everything works in Expo Go (camera, speech, audio, SQLite, file storage). The app is gone when Expo Go closes; use option 3 for a real install.

## 3. Installable build with EAS (real app icon, works offline, no laptop needed)

Requires a free Expo account (`npx expo login`) and the EAS CLI (`npm i -g eas-cli`).

```bash
eas build:configure          # once; links the project to your Expo account
eas build --profile preview --platform android   # → .apk you can install directly on Android tablets/phones
eas build --profile preview --platform ios       # → install via TestFlight (needs an Apple Developer account, $99/yr)
```

`eas.json` already defines `development`, `preview` and `production` profiles. Android APKs can be installed by opening the download link on the device (allow "install from this source" once). iOS requires Apple's developer program for any device install; for a single family iPad, the web app (option 1) or Expo Go (option 2) avoids that cost.

## First-run checklist on a real device

Walk this path with PJ watching, not helping:

1. Intro plays (tap the princess) and lands on Diamond Island within ~10 s; second launch shows **Skip**.
2. Create → Draw & Paint: draw with a finger, change colour, stamp a robot and a pig, undo, hold to start over, Save → celebration → My Diamond Book shows the drawing.
3. Create → Craft With Me → PJ's Clay Cup: all seven steps with voice, Take a picture (camera permission prompt), Keep it, Save My Cup → "PJ made a cup!" → Book.
4. My Garden shows the sprout and flower; Music Reef plays/pauses/skips; volume never jumps.
5. Grown-ups → hold 2 s → answer the sum → Parent Mode → back to island.
6. Kill the app, reopen: creations, garden and settings are still there.
7. (Web) Turn Wi-Fi off, reopen from the home screen: the island still loads.

Anything PJ cannot figure out without an adult explaining is a bug — note it in `docs/BUILD_LOG.md`.
