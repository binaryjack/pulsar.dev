/**
 * createSessionStore factory
 * Convenience function for store with sessionStorage
 */

import type { IStore, IStoreReducer } from '../store/store.types';
import { createPersistentStore } from './create-persistent-store';
import type { IPersistOptions } from './persistence.types';

export function createSessionStore<T extends Record<string, any>>(
  options: {
    initialState: T;
    name?: string;
    persist: Omit<IPersistOptions<T>, 'storage'>;
  },
  reducer: IStoreReducer<T>
): IStore<T> {
  return createPersistentStore(
    {
      ...options,
      persist: {
        ...options.persist,
        storage: typeof window !== 'undefined' ? sessionStorage : undefined,
      },
    },
    reducer
  );
}
