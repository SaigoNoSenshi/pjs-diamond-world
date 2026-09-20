import { useCallback, useEffect, useState } from 'react';

import {
  attachPhoto,
  createCraftSession,
  nextStep,
  previousStep,
  toCraftProgress,
  type CraftSession,
} from '@/domain/craft/craftEngine';
import type { CraftTemplate } from '@/domain/craft/schema';
import { useAppServices } from '@/hooks/useAppServices';
import { useProfile } from '@/hooks/useProfile';
import { nowIso } from '@/utils/time';

/**
 * Owns one craft session: resumes saved progress, persists every step change so an
 * interrupted craft picks up where PJ left it.
 */
export function useCraftSession(template: CraftTemplate) {
  const { repositories, logger } = useAppServices();
  const { profile } = useProfile();
  const [session, setSession] = useState<CraftSession | null>(null);

  useEffect(() => {
    let mounted = true;
    repositories.craftProgress
      .get(profile.id, template.id)
      .catch((error: unknown) => {
        logger.warn('craft progress load failed', { error: String(error) });
        return null;
      })
      .then((progress) => {
        if (mounted) setSession(createCraftSession(template, nowIso(), progress));
      });
    return () => {
      mounted = false;
    };
  }, [repositories.craftProgress, profile.id, template, logger]);

  const persist = useCallback(
    (next: CraftSession) => {
      repositories.craftProgress
        .save(toCraftProgress(next, profile.id, nowIso()))
        .catch((error: unknown) =>
          logger.warn('craft progress save failed', { error: String(error) }),
        );
    },
    [repositories.craftProgress, profile.id, logger],
  );

  const update = useCallback(
    (fn: (s: CraftSession) => CraftSession) => {
      setSession((current) => {
        if (!current) return current;
        const next = fn(current);
        if (next !== current) persist(next);
        return next;
      });
    },
    [persist],
  );

  return {
    session,
    next: useCallback(() => update(nextStep), [update]),
    back: useCallback(() => update(previousStep), [update]),
    setPhoto: useCallback((uri: string | null) => update((s) => attachPhoto(s, uri)), [update]),
    /** Start over after completion. */
    restart: useCallback(() => setSession(createCraftSession(template, nowIso())), [template]),
  };
}
