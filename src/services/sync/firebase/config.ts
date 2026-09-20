/**
 * Firebase configuration comes ONLY from environment variables (Replit Secrets /
 * .env). Nothing here is committed. When any value is missing, cloud sync is simply
 * unavailable and the app stays local-only.
 */
export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  appId: string;
}

export function readFirebaseConfig(
  env: Record<string, string | undefined> = process.env,
): FirebaseConfig | null {
  const config = {
    apiKey: env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    appId: env.EXPO_PUBLIC_FIREBASE_APP_ID,
  };
  const values = Object.values(config);
  if (values.some((v) => !v || v.trim() === '')) return null;
  return config as FirebaseConfig;
}
