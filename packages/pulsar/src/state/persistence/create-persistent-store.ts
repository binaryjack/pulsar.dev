/**
 * createPersistentStore factory
 * Convenience function for store with persistence
 */

import { createStore } from '../store/create-store';
import type { IStore, IStoreOptions, IStoreReducer } from '../store/store.types';
import { createPersistMiddleware } from './create-persist-middleware';
import type { IPersistOptions } from './persistence.types';
import { restoreState } from './restore-state';

export function createPersistentStore<T extends Record<string, any>>(
  options: {
    initialState: T;
    name?: string;
    persist: IPersistOptions<T>;
  },
  reducer: IStoreReducer<T>
): IStore<T> {
  const persistMiddleware = createPersistMiddleware(options.persist);

  const restoredState = restoreState({
    ...options.persist,
    initialState: options.initialState,
  });

  const storeOptions: IStoreOptions = {
    name: options.name,
    devtools: false,
  };

  return createStore(restoredState, reducer, [persistMiddleware], storeOptions);
}
