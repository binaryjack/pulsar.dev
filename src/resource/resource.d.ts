/**
 * Resource Constructor
 *
 * Creates a resource instance for async data fetching with automatic
 * state management, loading/error handling, and dependency tracking.
 */
import { IResourceInternal, IResourceOptions, ResourceFetcher } from './resource.types';
/**
 * Resource constructor function (prototype-based)
 */
export declare const Resource: {
    new <T>(fetcher: ResourceFetcher<T>, options?: IResourceOptions): IResourceInternal<T>;
};
