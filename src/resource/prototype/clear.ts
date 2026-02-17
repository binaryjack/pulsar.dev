/**
 * Resource Clear Method
 *
 * Resets resource to idle state, clearing data and errors.
 */

import { IResourceInternal } from '../resource.types';

export const clear = function <T>(this: IResourceInternal<T>): void {
  // Reset all state
  this._setState('idle');
  this._setData(null);
  this._setError(null);
  this._lastFetchTime = 0;
  this._activePromise = null;

  // Cleanup any tracked dependencies
  if (this._cleanup) {
    this._cleanup();
    this._cleanup = null;
  }
};
