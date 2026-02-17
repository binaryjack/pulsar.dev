/**
 * Resource Load Method
 *
 * Executes the resource fetcher and updates state accordingly.
 * Handles loading state, success data, and error cases.
 */

import { IResourceInternal } from '../resource.types';

export const load = async function <T>(this: IResourceInternal<T>): Promise<void> {
  // If already loading, return existing promise (deduplication)
  if (this._activePromise) {
    return this._activePromise;
  }

  // Set loading state
  this._setState('loading');
  this._setError(null);

  // Create and store active promise
  this._activePromise = (async () => {
    try {
      // Execute fetcher function
      const data = await this.fetcher();
      console.log('[Resource] Fetch success:', data);

      // Update success state
      this._setData(data);
      this._setState('success');
      this._lastFetchTime = Date.now();
      this._setError(null);

      // Call success callback
      if (this.options.onSuccess) {
        this.options.onSuccess(data);
      }
    } catch (error) {
      // Update error state
      const wrappedError = error instanceof Error ? error : new Error(String(error));
      this._setError(wrappedError);
      this._setState('error');
      this._setData(null);

      // Call error callback
      if (this.options.onError) {
        this.options.onError(wrappedError);
      }
    } finally {
      // Clear active promise
      this._activePromise = null;
    }
  })();

  return this._activePromise;
};
