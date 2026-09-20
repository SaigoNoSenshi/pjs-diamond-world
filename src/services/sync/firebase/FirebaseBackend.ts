import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut, type Auth } from 'firebase/auth';
import {
  deleteDoc,
  doc,
  getFirestore,
  serverTimestamp,
  setDoc,
  type Firestore,
} from 'firebase/firestore';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  type FirebaseStorage,
} from 'firebase/storage';

import type { Creation } from '@/domain/creation/schema';
import type { ChildProfile } from '@/domain/profile/schema';
import type { GardenState } from '@/domain/progression/schema';

import type { Logger } from '../../logging/logger';
import type { SyncBackend } from '../SyncQueueService';
import type { FirebaseConfig } from './config';

/**
 * Thin Firebase adapter. Layout (all top-level, every document carries `ownerId` =
 * the parent's uid, which the security rules check):
 *   parents/{uid}
 *   childProfiles/{childId}
 *   creations/{creationId}
 *   gardenStates/{childId}
 *   settings/{childId}
 * Assets: Storage at `parents/{uid}/...`.
 *
 * Only ever instantiated when `readFirebaseConfig()` returns a config. Parent sign-in
 * UI is a follow-up; `signInWithEmail` exists so Parent Mode can wire it later.
 */
export class FirebaseBackend implements SyncBackend {
  private readonly app: FirebaseApp;
  private readonly auth: Auth;
  private readonly db: Firestore;
  private readonly storage: FirebaseStorage;

  constructor(
    config: FirebaseConfig,
    private readonly logger: Logger,
  ) {
    this.app = getApps().length > 0 ? getApp() : initializeApp(config);
    this.auth = getAuth(this.app);
    this.db = getFirestore(this.app);
    this.storage = getStorage(this.app);
  }

  isConfigured(): boolean {
    return true;
  }

  isSignedIn(): boolean {
    return this.auth.currentUser !== null;
  }

  private uid(): string {
    const user = this.auth.currentUser;
    if (!user) throw new Error('not signed in');
    return user.uid;
  }

  async signInWithEmail(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(this.auth, email, password);
    await setDoc(
      doc(this.db, 'parents', this.uid()),
      { ownerId: this.uid(), updatedAt: serverTimestamp() },
      { merge: true },
    );
  }

  async signOutParent(): Promise<void> {
    await signOut(this.auth);
  }

  async uploadAsset(localUri: string, remotePath: string): Promise<string> {
    const response = await fetch(localUri);
    const bytes = await response.blob();
    const target = ref(this.storage, `parents/${this.uid()}/${remotePath}`);
    await uploadBytes(target, bytes);
    return getDownloadURL(target);
  }

  async upsertCreation(creation: Creation, remoteAssetUrl: string | null): Promise<void> {
    await setDoc(
      doc(this.db, 'creations', creation.id),
      {
        ownerId: this.uid(),
        childId: creation.childId,
        type: creation.type,
        title: creation.title,
        favorite: creation.favorite,
        createdAt: creation.createdAt,
        updatedAt: creation.updatedAt,
        remoteAssetUrl,
        // Local-only fields (assetUri/thumbnailUri) intentionally not synced.
        metadata: {
          craftId: creation.metadata.craftId ?? null,
          dominantColor: creation.metadata.dominantColor ?? null,
        },
        syncedAt: serverTimestamp(),
      },
      { merge: true },
    );
    this.logger.debug('synced creation', { id: creation.id });
  }

  async deleteCreation(creationId: string): Promise<void> {
    await deleteDoc(doc(this.db, 'creations', creationId));
  }

  async upsertGardenState(state: GardenState): Promise<void> {
    await setDoc(
      doc(this.db, 'gardenStates', state.childId),
      { ownerId: this.uid(), ...state, syncedAt: serverTimestamp() },
      { merge: true },
    );
  }

  async upsertProfile(profile: ChildProfile): Promise<void> {
    const uid = this.uid();
    await setDoc(
      doc(this.db, 'childProfiles', profile.id),
      {
        ownerId: uid,
        nickname: profile.nickname,
        avatar: profile.avatar,
        createdAt: profile.createdAt,
        syncedAt: serverTimestamp(),
      },
      { merge: true },
    );
    const { parentPinHash: _omit, ...settings } = profile.settings;
    await setDoc(
      doc(this.db, 'settings', profile.id),
      { ownerId: uid, ...settings, syncedAt: serverTimestamp() },
      { merge: true },
    );
  }
}
