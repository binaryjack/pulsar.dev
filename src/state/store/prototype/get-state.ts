/**
 * Store.prototype.getState
 * Get current state
 */

import type { IStoreInternal } from '../store.types';

export const getState = function <T>(this: IStoreInternal<T>): T {
  // Reactive tracked read — any effect / component that calls getState()
  // will automatically re-run when dispatch() changes state.
  return this._stateSignal.read();
};
