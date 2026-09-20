import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';

interface ParentSessionValue {
  unlocked: boolean;
  unlock(): void;
  lock(): void;
}

const ParentSessionContext = createContext<ParentSessionValue | null>(null);

/** In-memory "grown-up is here" flag. Cleared on exit and on every cold start. */
export function ParentSessionProvider({ children }: PropsWithChildren) {
  const [unlocked, setUnlocked] = useState(false);
  const unlock = useCallback(() => setUnlocked(true), []);
  const lock = useCallback(() => setUnlocked(false), []);
  const value = useMemo(() => ({ unlocked, unlock, lock }), [unlocked, unlock, lock]);
  return <ParentSessionContext.Provider value={value}>{children}</ParentSessionContext.Provider>;
}

export function useParentSession(): ParentSessionValue {
  const value = useContext(ParentSessionContext);
  if (!value) throw new Error('useParentSession must be used inside ParentSessionProvider');
  return value;
}
