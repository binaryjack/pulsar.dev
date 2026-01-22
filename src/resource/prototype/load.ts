/**
 * Resource Load Method
 * 
 * Executes the resource fetcher and updates state accordingly.
 * Handles loading state, success data, and error cases.
 */

import { IResourceInternal } from '../resource.types'

export const load = async function<T>(this: IResourceInternal<T>): Promise<void> {
    // If already loading, return existing promise (deduplication)
    if (this._activePromise) {
        return this._activePromise;
    }
    
    // Set loading state
    this._state = 'loading';
    this._error = null;
    
    // Create and store active promise
    this._activePromise = (async () => {
        try {
            // Execute fetcher function
            const data = await this.fetcher();
            
            // Update success state
            this._data = data;
            this._state = 'success';
            this._lastFetchTime = Date.now();
            this._error = null;
            
            // Call success callback
            if (this.options.onSuccess) {
                this.options.onSuccess(data);
            }
        } catch (error) {
            // Update error state
            this._error = error instanceof Error ? error : new Error(String(error));
            this._state = 'error';
            this._data = null;
            
            // Call error callback
            if (this.options.onError) {
                this.options.onError(this._error);
            }
        } finally {
            // Clear active promise
            this._activePromise = null;
        }
    })();
    
    return this._activePromise;
};
