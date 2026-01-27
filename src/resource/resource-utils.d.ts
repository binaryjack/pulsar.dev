/**
 * Resource Utilities
 *
 * Helper functions for working with resources, including
 * bulk operations and state checking.
 */
import { IResource } from './resource.types';
/**
 * Check if any resources are loading
 *
 * @param resources - Array of resources to check
 * @returns true if any resource is in loading state
 */
export declare function isAnyLoading(resources: IResource<unknown>[]): boolean;
/**
 * Check if all resources have successfully loaded
 *
 * @param resources - Array of resources to check
 * @returns true if all resources are in success state
 */
export declare function isAllSuccess(resources: IResource<unknown>[]): boolean;
/**
 * Check if any resources have errors
 *
 * @param resources - Array of resources to check
 * @returns true if any resource is in error state
 */
export declare function isAnyError(resources: IResource<unknown>[]): boolean;
/**
 * Get all errors from resources
 *
 * @param resources - Array of resources to check
 * @returns Array of errors from failed resources
 */
export declare function getErrors(resources: IResource<unknown>[]): Error[];
/**
 * Refetch all resources in parallel
 *
 * @param resources - Array of resources to refetch
 * @returns Promise that resolves when all refetches complete
 */
export declare function refetchAll(resources: IResource<unknown>[]): Promise<void>;
/**
 * Clear all resources
 *
 * @param resources - Array of resources to clear
 */
export declare function clearAll(resources: IResource<unknown>[]): void;
/**
 * Wait for all resources to finish loading (success or error)
 *
 * @param resources - Array of resources to wait for
 * @returns Promise that resolves when all are done loading
 */
export declare function waitForAll(resources: IResource<unknown>[]): Promise<void>;
