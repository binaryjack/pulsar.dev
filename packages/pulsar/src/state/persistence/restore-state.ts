/**
 * restoreState helper
 * Restore state from storage
 */

import type { IPersistOptions } from './persistence.types';

export function restoreState<T extends Record<string, any>>(
  options: IPersistOptions<T> & { initialState: T }
): T {
  const {
    key,
    storage = typeof window !== 'undefined' ? localStorage : undefined,
    deserialize = JSON.parse,
    initialState,
    version,
    migrate,
    merge,
  } = options;

  if (!storage) {
    return initialState;
  }

  try {
    const item = storage.getItem(key);
    if (!item) {
      return initialState;
    }

    let persisted = deserialize(item);

    // Handle version migration
    if (version && migrate) {
      const storedVersion = (persisted as any).__version || 0;
      if (storedVersion < version) {
        persisted = migrate(persisted, storedVersion);
        // Store new version
        persisted = { ...persisted, __version: version };
      }
    }

    // Merge with initial state
    if (merge) {
      return merge(persisted, initialState);
    }

    return { ...initialState, ...persisted };
  } catch (error) {
    console.error('Failed to restore state:', error);
    return initialState;
  }
}
