/**
 * Store.prototype.getState
 * Get current state
 */

import type { IStoreInternal } from '../store.types';

export const getState = function <T>(this: IStoreInternal<T>): T {
  return this.state;
};
