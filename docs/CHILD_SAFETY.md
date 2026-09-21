# Child Safety and Privacy

This document is mandatory reading before changing any feature that touches data, networking, media, or content. It is written against the principles of COPPA (US), GDPR-K / UK Age Appropriate Design Code, and general child-first design practice. It is a design commitment, not legal advice.

## 1. Data minimisation

The app never asks for or stores:

- full child name
- home address
- school
- phone number
- email address (child)
- location (coarse or precise)
- birthday (not needed for the MVP)
- contacts, calendars, or other device data

Child profile = `nickname` (default "PJ") + a chosen avatar identifier. Nothing else.

## 2. Local-first storage

All creations (drawings, photos, craft progress, garden state, settings) are stored on the device by default:

- structured metadata → SQLite (`expo-sqlite`)
- binary assets (PNG drawings, JPEG photos, audio) → app-private document directory (`expo-file-system`)
- lightweight settings → AsyncStorage

Nothing leaves the device unless a parent explicitly enables cloud sync in Parent Mode.

## 3. Photos

- Photos are stored locally only, in the app's private document directory, never in the shared camera roll unless the parent exports them.
- No facial recognition. No biometric analysis. No image-content analysis of any kind in the MVP.
- Photos are never used for AI training, never sent to third-party analytics, and never included in crash reports.
- Camera permission is requested only when PJ reaches the "Take a picture" step, with a friendly explanation. If permission is denied the craft still completes without a photo and nothing is lost.

## 4. Networking

- The child experience works fully offline.
- No external links are reachable from any child screen.
- No web views, no open browsing, no app-store links, no "rate us" prompts, no social sharing.
- Cloud sync (`SyncService`) is a no-op unless Parent Mode enables it and Firebase is configured through environment variables. Sync never blocks the UI, and a failed sync never deletes or alters local data.

## 5. No advertising, no tracking

- No advertisements of any kind. No behavioural advertising. No third-party ad or attribution SDKs.
- No advertising identifiers, device fingerprinting, or cross-app tracking.
- Analytics in the MVP is a local, in-memory/disk event log used only for debugging (`services/analytics/LocalAnalytics`). Any future cloud analytics must be off by default, parent-approved, anonymous, contain no personal text, photos or precise location, and be reviewed against this document before shipping.

## 6. Social features

None. No public profiles, no public posting, no messaging, no friends list, no chat, no comments, no leaderboards, no rankings.

## 7. AI

- No AI chatbot is exposed to the child in the MVP.
- `CreativeAssistantService` exists as an interface with a local mock implementation. Any future implementation must run behind a restricted, child-safe interaction layer: fixed prompt templates, no free-text child input to a model, output filtered against an allow-list of content types, and parent control over enablement.
- Child creations and photos are never sent to a model provider without explicit parent enablement and a documented review.

## 8. Parent gate

- Parent Mode is reachable only through a press-and-hold gesture (about 2 seconds) on a visually unremarkable control, followed by an adult challenge (arithmetic) or an optional parent PIN.
- Destructive parent actions (delete, reset) require a second confirmation.
- Cloud-related settings are behind Parent Mode only.

## 9. Content

- All characters, artwork, and music are original. No licensed or trademarked properties.
- Language in the child experience is short, positive, and never shaming. Failure states say things like "Oops! Let's try again."
- No time pressure, timers, or streak mechanics. Progression is additive and can never be lost. Grade levels only ever go up (mastery or a parent), never down.
- **Content updates** (`RemoteContentService`): the app may download new activity packs from **its own site only** (`/content/packs.json` on the same origin that serves the app; on native only from a URL the builder sets at build time). Download only — nothing about the child or the device is sent, no identifiers, no cookies, no third-party hosts. Packs are validated with the same schema as built-in content and invalid entries are dropped; a pack cannot add links, media URLs, or code — only the same data the built-in activities use. Parents can trigger a check from Grown-ups → Learning; the child sees at most a "new things to try" note.

## 10. Accessibility and wellbeing

- Minimum touch target 48×48 logical pixels; primary controls larger.
- State is never communicated by colour alone (icon + shape + label + voice).
- Animations are short, and reduced-motion settings are respected.
- Audio never starts loud; volume respects the device and a parent setting.
- Future: screen-time limits belong in Parent Mode.

## 11. Security

- No credentials in source. Firebase configuration comes from environment variables (`EXPO_PUBLIC_FIREBASE_*`) and is absent by default.
- Firestore and Storage security rules restrict every document to its owning parent account. Client checks are never the only check.
- Technical errors are logged through `services/logging` and never shown to the child.

## 12. Review checklist for new features

Before merging a feature, confirm:

- [ ] It collects no new personal data.
- [ ] It works fully offline.
- [ ] It adds no external links, web views, or third-party SDKs reachable by the child.
- [ ] Any network call is parent-enabled and fails safe.
- [ ] Any new content is original.
- [ ] Any new destructive action is guarded.
- [ ] Voice and icon support exist so no reading is required.
