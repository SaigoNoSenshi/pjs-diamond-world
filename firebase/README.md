# Optional cloud backup (Firebase)

The app is local-only by default. Cloud backup activates only when **all** of these hold:

1. `EXPO_PUBLIC_FIREBASE_*` variables are set (see `/.env.example`) — use Replit Secrets or a local `.env`; never commit them.
2. A parent enables **Cloud backup** in Parent Mode.
3. A parent is signed in (email/password today via `FirebaseBackend.signInWithEmail`; Google/Apple later). The sign-in screen is a follow-up — see `docs/ROADMAP.md`.

Deploy the rules from this folder with the Firebase CLI:

```bash
cd firebase
firebase deploy --only firestore:rules,storage
```

Data layout: `parents/{uid}`, `childProfiles/{childId}`, `creations/{creationId}`, `gardenStates/{childId}`, `settings/{childId}`; every document carries `ownerId` and the rules check it on read, create and update. Assets are stored under `parents/{uid}/creations/...` (images only, < 10 MB). The parent PIN hash and local file URIs are never uploaded.
