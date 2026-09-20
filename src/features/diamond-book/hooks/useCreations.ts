import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import type { Creation, CreationFilter } from '@/domain/creation/schema';
import { useAppServices } from '@/hooks/useAppServices';
import { useProfile } from '@/hooks/useProfile';

export type CreationsStatus = 'loading' | 'ready' | 'error';

/** Lists the child's creations for a filter; refreshes whenever the screen gains focus. */
export function useCreations(filter: CreationFilter) {
  const { repositories, logger } = useAppServices();
  const { profile } = useProfile();
  const [items, setItems] = useState<Creation[]>([]);
  const [status, setStatus] = useState<CreationsStatus>('loading');

  const refresh = useCallback(async () => {
    try {
      const list = await repositories.creations.list(profile.id, filter);
      setItems(list);
      setStatus('ready');
    } catch (error) {
      logger.error('creations load failed', error);
      setStatus('error');
    }
  }, [repositories.creations, profile.id, filter, logger]);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  const toggleFavorite = useCallback(
    async (creation: Creation) => {
      const next = !creation.favorite;
      setItems((list) => list.map((c) => (c.id === creation.id ? { ...c, favorite: next } : c)));
      try {
        await repositories.creations.update(creation.id, { favorite: next });
      } catch (error) {
        logger.error('favorite toggle failed', error);
        void refresh();
      }
    },
    [repositories.creations, logger, refresh],
  );

  return { items, status, refresh, toggleFavorite };
}

/** Loads one creation by id. */
export function useCreation(creationId: string | undefined) {
  const { repositories, logger } = useAppServices();
  const [creation, setCreation] = useState<Creation | null>(null);
  const [status, setStatus] = useState<CreationsStatus>('loading');

  const load = useCallback(async () => {
    if (!creationId) {
      setStatus('error');
      return;
    }
    try {
      const found = await repositories.creations.get(creationId);
      setCreation(found);
      setStatus(found ? 'ready' : 'error');
    } catch (error) {
      logger.error('creation load failed', error);
      setStatus('error');
    }
  }, [repositories.creations, creationId, logger]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  const toggleFavorite = useCallback(async () => {
    if (!creation) return;
    const next = !creation.favorite;
    setCreation({ ...creation, favorite: next });
    try {
      await repositories.creations.update(creation.id, { favorite: next });
    } catch (error) {
      logger.error('favorite toggle failed', error);
      void load();
    }
  }, [creation, repositories.creations, logger, load]);

  return { creation, status, toggleFavorite, reload: load };
}
