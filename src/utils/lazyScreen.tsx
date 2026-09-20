import { lazy, Suspense, type ComponentType } from 'react';

import { ScreenLoading } from '@/components/ScreenLoading';

/**
 * Code-splits a feature screen behind a route. Metro turns the `import()` inside
 * `load` into a separate chunk on web, so the home screen only downloads the code it
 * needs; the drawing canvas, camera, parent mode etc. arrive when first opened.
 * On native the import resolves from the same bundle (no cost, no behaviour change).
 *
 * Usage in a route file:
 *   const DrawScreen = lazyScreen(() => import('@/features/drawing/DrawScreen').then((m) => m.DrawScreen));
 */
export function lazyScreen<P extends object>(
  load: () => Promise<ComponentType<P>>,
): ComponentType<P> {
  const Lazy = lazy(async () => ({ default: await load() }));
  function LazyScreen(props: P) {
    return (
      <Suspense fallback={<ScreenLoading />}>
        <Lazy {...props} />
      </Suspense>
    );
  }
  return LazyScreen;
}
