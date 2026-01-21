/**
 * Resource System - Public Exports
 * 
 * Provides async data fetching with automatic loading/error states,
 * dependency tracking, and Suspense-like Waiting component.
 */

// Resource exports
export { createResource } from './create-resource'
export { createTrackedResource } from './create-tracked-resource'
export { clear } from './prototype/clear'
export { load } from './prototype/load'
export { refetch } from './prototype/refetch'
export { Resource } from './resource'

// Waiting component exports
export { resolveWaiting, suspendWaiting, Waiting } from './waiting'

// Utility exports
export {
    clearAll, getErrors, isAllSuccess,
    isAnyError, isAnyLoading, refetchAll, waitForAll
} from './resource-utils'

// Type exports
export type {
    IResource,
    IResourceInternal, IResourceOptions, ResourceFetcher, ResourceState
} from './resource.types'

export type {
    IWaitingProps
} from './waiting.types'

