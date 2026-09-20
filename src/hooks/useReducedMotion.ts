import { useContext, useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

import { ProfileContext } from './useProfile';

/**
 * Respects the OS reduced-motion preference. Animations read this and shorten or
 * skip themselves. A parent override can be layered on top from settings.
 */
export function useReducedMotion(override?: boolean): boolean {
  const [system, setSystem] = useState(false);

  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((value) => {
        if (mounted) setSystem(value);
      })
      .catch(() => undefined);
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setSystem);
    return () => {
      mounted = false;
      sub.remove();
    };
  }, []);

  // Parent override (Parent Mode → Motion) wins over the OS setting when set.
  const profile = useContext(ProfileContext);
  return override ?? profile?.settings.reducedMotion ?? system;
}
