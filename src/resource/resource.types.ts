/**
 * Resource System Types
 * 
 * Provides async data fetching with automatic loading/error states,
 * dependency tracking, and refetch capabilities.
 */

/**
 * Resource state lifecycle
 */
export type ResourceState = 'idle' | 'loading' | 'success' | 'error';

/**
 * Resource fetcher function - returns Promise with data or error
 */
export type ResourceFetcher<T> = () => Promise<T>;

/**
 * Resource options for configuration
 */
export interface IResourceOptions {
    /**
     * Whether to fetch immediately on creation (default: true)
     */
    lazy?: boolean;
    
    /**
     * Callback when resource loads successfully
     */
    onSuccess?: (data: unknown) => void;
    
    /**
     * Callback when resource encounters error
     */
    onError?: (error: Error) => void;
    
    /**
     * Auto-refetch on dependency change (default: true)
     */
    autoRefetch?: boolean;
    
    /**
     * Stale time in milliseconds (default: 0 = always fresh)
     */
    staleTime?: number;
}

/**
 * Public Resource Interface
 * Exposed to consumers for type-safe usage
 */
export interface IResource<T> {
    /**
     * Current resource state
     */
    readonly state: ResourceState;
    
    /**
     * Resource data (null if not loaded)
     */
    readonly data: T | null;
    
    /**
     * Error if fetch failed
     */
    readonly error: Error | null;
    
    /**
     * Whether resource is currently loading
     */
    readonly isLoading: boolean;
    
    /**
     * Whether resource has successfully loaded
     */
    readonly isSuccess: boolean;
    
    /**
     * Whether resource encountered an error
     */
    readonly isError: boolean;
    
    /**
     * Whether data is stale and needs refetch
     */
    readonly isStale: boolean;
    
    /**
     * Manually trigger refetch
     */
    refetch(): Promise<void>;
    
    /**
     * Clear resource data and reset to idle
     */
    clear(): void;
    
    /**
     * Force load (even if already loaded)
     */
    load(): Promise<void>;
}

/**
 * Internal Resource Interface
 * Includes private state management
 */
export interface IResourceInternal<T> extends IResource<T> {
    /**
     * Resource fetcher function
     */
    readonly fetcher: ResourceFetcher<T>;
    
    /**
     * Resource options
     */
    readonly options: Required<IResourceOptions>;
    
    /**
     * Internal state holder
     */
    _state: ResourceState;
    
    /**
     * Internal data holder
     */
    _data: T | null;
    
    /**
     * Internal error holder
     */
    _error: Error | null;
    
    /**
     * Timestamp of last successful fetch
     */
    _lastFetchTime: number;
    
    /**
     * Active fetch promise (for deduplication)
     */
    _activePromise: Promise<void> | null;
    
    /**
     * Cleanup function for effect tracking
     */
    _cleanup: (() => void) | null;
}
