/**
 * createPersistMiddleware factory
 * Middleware for automatic state persistence
 */

import type { IStoreAction } from '../store/store.types';
import type { IPersistOptions, PersistMiddleware } from './persistence.types';

export function createPersistMiddleware<T extends Record<string, any>>(
  options: IPersistOptions<T>
): PersistMiddleware<T> {
  const {
    key,
    storage = typeof window !== 'undefined' ? localStorage : undefined,
    serialize = JSON.stringify,
    debounce: debounceMs = 1000,
    whitelist,
    blacklist,
  } = options;

  if (!storage) {
    console.warn('createPersistMiddleware: No storage available');
    return () => (next) => (action) => next(action);
  }

  let timeoutId: NodeJS.Timeout | null = null;

  const saveState = (state: T) => {
    let stateToSave = state;

    // Apply whitelist/blacklist
    if (whitelist) {
      stateToSave = {} as T;
      whitelist.forEach((k) => {
        (stateToSave as any)[k] = state[k];
      });
    } else if (blacklist) {
      stateToSave = { ...state };
      blacklist.forEach((k) => {
        delete (stateToSave as any)[k];
      });
    }

    try {
      const serialized = serialize(stateToSave);
      storage.setItem(key, serialized);
    } catch (error) {
      console.error('Failed to persist state:', error);
    }
  };

  return (store) => (next) => (action: IStoreAction) => {
    next(action);

    // Debounce saves
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      saveState(store.getState());
      timeoutId = null;
    }, debounceMs);
  };
}
