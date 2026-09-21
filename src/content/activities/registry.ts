import {
  activityDefinitionSchema,
  type ActivityDefinition,
  type IslandId,
} from '@/domain/activity/schema';

/**
 * Mutable activity registry. Built-in packs are registered at startup; remote packs
 * (fetched from the app's own site — see services/content) are merged in later and
 * override built-ins with the same id. Screens subscribe through `useActivities()`.
 */
type Listener = () => void;

const byId = new Map<string, ActivityDefinition>();
const sources = new Map<string, string>();
const listeners = new Set<Listener>();
let version = 0;
let cache: ActivityDefinition[] | null = null;

export interface RegisterResult {
  added: number;
  replaced: number;
  rejected: { id: string; error: string }[];
}

/** Validates and registers definitions. Invalid entries are skipped, never thrown at runtime. */
export function registerActivities(
  defs: readonly unknown[],
  source: string,
  options: { strict?: boolean } = {},
): RegisterResult {
  const result: RegisterResult = { added: 0, replaced: 0, rejected: [] };
  for (const raw of defs) {
    const parsed = activityDefinitionSchema.safeParse(raw);
    if (!parsed.success) {
      const id =
        typeof raw === 'object' && raw && 'id' in raw ? String((raw as { id: unknown }).id) : '?';
      if (options.strict)
        throw new Error(`invalid activity ${id} in ${source}: ${parsed.error.message}`);
      result.rejected.push({ id, error: parsed.error.issues[0]?.message ?? 'invalid' });
      continue;
    }
    if (byId.has(parsed.data.id)) result.replaced += 1;
    else result.added += 1;
    byId.set(parsed.data.id, parsed.data);
    sources.set(parsed.data.id, source);
  }
  if (result.added + result.replaced > 0) bump();
  return result;
}

/** Removes everything registered from `source` (used when a remote pack is withdrawn). */
export function unregisterSource(source: string): number {
  let n = 0;
  for (const [id, s] of sources) {
    if (s === source) {
      byId.delete(id);
      sources.delete(id);
      n += 1;
    }
  }
  if (n > 0) bump();
  return n;
}

function bump(): void {
  version += 1;
  cache = null;
  for (const l of listeners) l();
}

export function allActivities(): readonly ActivityDefinition[] {
  if (!cache) cache = [...byId.values()];
  return cache;
}

export function findActivity(id: string): ActivityDefinition | undefined {
  return byId.get(id);
}

export function activitiesForIsland(
  islandId: IslandId,
  grade?: number,
): readonly ActivityDefinition[] {
  return allActivities().filter(
    (a) => a.islandId === islandId && (grade === undefined || a.grades.includes(grade)),
  );
}

export function activitySource(id: string): string | undefined {
  return sources.get(id);
}

export function registryVersion(): number {
  return version;
}

export function subscribeActivities(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Test helper. */
export function resetRegistryForTests(): void {
  byId.clear();
  sources.clear();
  bump();
}
