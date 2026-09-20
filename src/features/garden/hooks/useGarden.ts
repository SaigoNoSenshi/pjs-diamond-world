import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';

import { gardenItems } from '@/content/garden/items';
import type { GardenItem, GardenState } from '@/domain/progression/schema';
import { useAppServices } from '@/hooks/useAppServices';
import { useProfile } from '@/hooks/useProfile';

/** Garden state for the current child + a one-shot "just unlocked" announcement. */
export function useGarden() {
  const { progression, logger } = useAppServices();
  const { profile } = useProfile();
  const [state, setState] = useState<GardenState | null>(null);
  const [justUnlocked, setJustUnlocked] = useState<GardenItem[]>([]);

  const load = useCallback(async () => {
    try {
      await progression.whenIdle();
      setState(await progression.getState(profile.id));
    } catch (error) {
      logger.error('garden load failed', error);
    }
  }, [progression, profile.id, logger]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  useEffect(
    () =>
      progression.onUnlock((unlocked, next) => {
        setState(next);
        setJustUnlocked(unlocked);
      }),
    [progression],
  );

  const unlockedItems = gardenItems.filter((item) => state?.unlockedItems.includes(item.id));

  return {
    state,
    unlockedItems,
    justUnlocked,
    acknowledgeUnlock: useCallback(() => setJustUnlocked([]), []),
  };
}
