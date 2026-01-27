/**
 * Resource with Effect Tracking
 *
 * Wraps a resource with automatic dependency tracking and refetch
 * when reactive dependencies change.
 */
import { IResource, IResourceOptions, ResourceFetcher } from './resource.types';
/**
 * Creates a resource that automatically refetches when dependencies change
 *
 * The fetcher function is tracked - any signals/memos accessed inside will
 * trigger automatic refetch when they update.
 *
 * @param fetcher - Async function that may access reactive values
 * @param options - Resource configuration
 * @returns Resource instance with automatic refetch on dependency changes
 *
 * @example
 * ```typescript
 * const userId = createSignal(1);
 *
 * const userResource = createTrackedResource(
 *   () => fetch(`/api/users/${userId()}`).then(r => r.json())
 * );
 *
 * // When userId changes, userResource automatically refetches
 * userId(2); // Triggers refetch
 * ```
 */
export declare function createTrackedResource<T>(fetcher: ResourceFetcher<T>, options?: IResourceOptions): IResource<T>;
