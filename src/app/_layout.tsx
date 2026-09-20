import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { FpsMeter, isFpsMeterEnabled } from '@/components/dev/FpsMeter';
import { AppServicesProvider } from '@/hooks/useAppServices';
import { useMusicController } from '@/hooks/useMusic';
import { ParentSessionProvider } from '@/hooks/useParentSession';
import { ProfileProvider } from '@/hooks/useProfile';
import type { AppServices } from '@/services/container';
import { createAppServices } from '@/services/createAppServices';
import { colors } from '@/theme';

SplashScreen.preventAutoHideAsync().catch(() => undefined);

export default function RootLayout() {
  const [services, setServices] = useState<AppServices | null>(null);

  useEffect(() => {
    let mounted = true;
    createAppServices()
      .then((s) => {
        if (mounted) setServices(s);
      })
      .finally(() => SplashScreen.hideAsync().catch(() => undefined));
    return () => {
      mounted = false;
    };
  }, []);

  // Keep the native splash visible until storage is ready (a few ms on device).
  if (!services) return null;

  return (
    <SafeAreaProvider>
      <AppServicesProvider services={services}>
        <ProfileProvider>
          <ParentSessionProvider>
            <MusicController />
            <StatusBar style="dark" />
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: colors.background },
                animation: 'fade',
              }}
            />
            {isFpsMeterEnabled() ? <FpsMeter /> : null}
          </ParentSessionProvider>
        </ProfileProvider>
      </AppServicesProvider>
    </SafeAreaProvider>
  );
}

// Note: no GestureHandlerRootView here on purpose — react-native-gesture-handler adds
// ~50 KB gzip to the first download. Screens that use gestures mount their own root
// inside their lazily-loaded chunk.

/** Applies parent audio settings to the music service. Renders nothing. */
function MusicController() {
  useMusicController();
  return null;
}
