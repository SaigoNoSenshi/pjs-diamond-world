import { Redirect } from 'expo-router';

import { routes } from '@/constants/routes';

/**
 * Catch-all: any URL that is not one of our screens (a hosting path prefix, a stale
 * link, a typo) lands on the intro instead of a "Page could not be found" screen.
 * A five-year-old must never see a dead end.
 */
export default function UnmatchedRoute() {
  return <Redirect href={routes.intro} />;
}
