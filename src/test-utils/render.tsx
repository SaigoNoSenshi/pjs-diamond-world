import { render, type RenderOptions } from '@testing-library/react-native';
import type { PropsWithChildren, ReactElement } from 'react';

import { AppServicesProvider } from '@/hooks/useAppServices';
import { ProfileProvider } from '@/hooks/useProfile';
import { createTestServices, type AppServices } from '@/services/container';

/** Render with the in-memory service container and profile provider (RNTL v14 async render). */
export async function renderWithServices(
  ui: ReactElement,
  services: AppServices = createTestServices(),
  options?: RenderOptions,
) {
  function Wrapper({ children }: PropsWithChildren) {
    return (
      <AppServicesProvider services={services}>
        <ProfileProvider>{children}</ProfileProvider>
      </AppServicesProvider>
    );
  }
  const result = await render(ui, { wrapper: Wrapper, ...options });
  return { services, ...result };
}
