/**
 * Tiny promise wrapper over IndexedDB for the web build. One database, one object
 * store per table, string keys. Kept dependency-free; ~100 lines is all we need.
 */
export const IDB_NAME = 'pjs-diamond-world';
export const IDB_VERSION = 1;
export const STORES = [
  'creations',
  'gardenStates',
  'events',
  'craftProgress',
  'drafts',
  'assets',
] as const;
export type StoreName = (typeof STORES)[number];

export interface KeyValueStore {
  get<T>(store: StoreName, key: string): Promise<T | undefined>;
  getAll<T>(store: StoreName): Promise<T[]>;
  put<T>(store: StoreName, key: string, value: T): Promise<void>;
  delete(store: StoreName, key: string): Promise<void>;
  clear(store: StoreName): Promise<void>;
}

export function isIndexedDbAvailable(): boolean {
  try {
    return typeof indexedDB !== 'undefined' && indexedDB !== null;
  } catch {
    return false;
  }
}

function request<T>(req: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error('IndexedDB request failed'));
  });
}

export async function openIndexedDb(
  name = IDB_NAME,
  version = IDB_VERSION,
): Promise<KeyValueStore> {
  const db = await new Promise<IDBDatabase>((resolve, reject) => {
    const req = indexedDB.open(name, version);
    req.onupgradeneeded = () => {
      for (const store of STORES) {
        if (!req.result.objectStoreNames.contains(store)) req.result.createObjectStore(store);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error('IndexedDB open failed'));
    req.onblocked = () => reject(new Error('IndexedDB open blocked'));
  });

  const tx = (store: StoreName, mode: IDBTransactionMode) =>
    db.transaction(store, mode).objectStore(store);

  return {
    get: (store, key) => request(tx(store, 'readonly').get(key)),
    getAll: (store) => request(tx(store, 'readonly').getAll()),
    put: async (store, key, value) => {
      await request(tx(store, 'readwrite').put(value, key));
    },
    delete: async (store, key) => {
      await request(tx(store, 'readwrite').delete(key));
    },
    clear: async (store) => {
      await request(tx(store, 'readwrite').clear());
    },
  };
}

/** In-memory KeyValueStore with the same contract (used when IndexedDB is denied, e.g. sandboxed iframes). */
export function createMemoryKeyValueStore(): KeyValueStore {
  const data = new Map<StoreName, Map<string, unknown>>();
  const table = (s: StoreName) => {
    let t = data.get(s);
    if (!t) {
      t = new Map();
      data.set(s, t);
    }
    return t;
  };
  return {
    async get<T>(store: StoreName, key: string) {
      return table(store).get(key) as T | undefined;
    },
    async getAll<T>(store: StoreName) {
      return [...table(store).values()] as T[];
    },
    async put(store, key, value) {
      table(store).set(key, value);
    },
    async delete(store, key) {
      table(store).delete(key);
    },
    async clear(store) {
      table(store).clear();
    },
  };
}
