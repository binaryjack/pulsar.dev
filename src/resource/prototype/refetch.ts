/**
 * Resource Refetch Method
 * 
 * Re-executes the fetcher to get fresh data.
 * Alias for load() - kept separate for semantic clarity.
 */

import { IResourceInternal } from '../resource.types'

export const refetch = async function<T>(this: IResourceInternal<T>): Promise<void> {
    // Refetch is just an alias for load
    return this.load();
};
