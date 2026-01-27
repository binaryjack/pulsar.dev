/**
 * Create Resource Factory Function
 *
 * Public API for creating resource instances with ergonomic interface.
 * Automatically initiates fetch unless lazy option is set.
 */
import { IResource, IResourceOptions, ResourceFetcher } from './resource.types';
/**
 * Creates a new Resource instance for async data fetching
 *
 * @param fetcher - Async function that returns data
 * @param options - Configuration options
 * @returns Resource instance with loading/error state management
 *
 * @example
 * ```typescript
 * const userResource = createResource(
 *   () => fetch('/api/user').then(r => r.json()),
 *   { staleTime: 5000 }
 * );
 *
 * // Access state
 * console.log(userResource.isLoading);
 * console.log(userResource.data);
 *
 * // Manual refetch
 * await userResource.refetch();
 * ```
 */
export declare function createResource<T>(fetcher: ResourceFetcher<T>, options?: IResourceOptions): IResource<T>;
