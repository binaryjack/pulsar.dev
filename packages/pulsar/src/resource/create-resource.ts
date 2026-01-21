/**
 * Create Resource Factory Function
 * 
 * Public API for creating resource instances with ergonomic interface.
 * Automatically initiates fetch unless lazy option is set.
 */

import { clear } from './prototype/clear'
import { load } from './prototype/load'
import { refetch } from './prototype/refetch'
import { Resource } from './resource'
import { IResource, IResourceInternal, IResourceOptions, ResourceFetcher } from './resource.types'

// Attach prototype methods
Resource.prototype.load = load;
Resource.prototype.refetch = refetch;
Resource.prototype.clear = clear;

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
export function createResource<T>(
    fetcher: ResourceFetcher<T>,
    options: IResourceOptions = {}
): IResource<T> {
    // Create resource instance
    const resource = new Resource(fetcher, options) as IResourceInternal<T>;
    
    // Bind methods to instance
    resource.load = load.bind(resource);
    resource.refetch = refetch.bind(resource);
    resource.clear = clear.bind(resource);
    
    // Auto-load unless lazy
    if (!options.lazy) {
        // Trigger load asynchronously (don't block construction)
        Promise.resolve().then(() => resource.load());
    }
    
    // Return as public interface
    return resource as IResource<T>;
}
