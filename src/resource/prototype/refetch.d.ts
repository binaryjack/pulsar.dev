/**
 * Resource Refetch Method
 *
 * Re-executes the fetcher to get fresh data.
 * Alias for load() - kept separate for semantic clarity.
 */
import { IResourceInternal } from '../resource.types';
export declare const refetch: <T>(this: IResourceInternal<T>) => Promise<void>;
