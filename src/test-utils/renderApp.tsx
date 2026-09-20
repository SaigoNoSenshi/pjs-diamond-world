import { renderRouter } from 'expo-router/testing-library';
import type { ComponentType, PropsWithChildren } from 'react';

import { AppServicesProvider } from '@/hooks/useAppServices';
import { ParentSessionProvider } from '@/hooks/useParentSession';
import { ProfileProvider } from '@/hooks/useProfile';
import { createTestServices, type AppServices } from '@/services/container';

type RouteMap = Record<string, ComponentType<unknown>>;

/**
 * Renders a route map inside the real providers with in-memory services.
 *
 * `renderRouter` switches Jest to fake timers (for React Navigation's async state);
 * RNTL's `waitFor` copes, but any real async chain in app code (pickers, storage,
 * autosave) silently stalls. We restore real timers right after the initial render so
 * tests behave like the app. One `renderRouter` per test file (a known limitation).
 */
export async function renderApp(
  routes: RouteMap,
  { initialUrl, services = createTestServices() }: { initialUrl: string; services?: AppServices },
) {
  function Wrapper({ children }: PropsWithChildren) {
    return (
      <AppServicesProvider services={services}>
        <ProfileProvider>
          <ParentSessionProvider>{children}</ParentSessionProvider>
        </ProfileProvider>
      </AppServicesProvider>
    );
  }
  const app = renderRouter(routes, { initialUrl, wrapper: Wrapper });
  jest.useRealTimers();
  const q = await app;
  return { app, q, services };
}
