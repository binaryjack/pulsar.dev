/**
 * Resource Utilities
 * 
 * Helper functions for working with resources, including
 * bulk operations and state checking.
 */

import { IResource } from './resource.types'

/**
 * Check if any resources are loading
 * 
 * @param resources - Array of resources to check
 * @returns true if any resource is in loading state
 */
export function isAnyLoading(resources: IResource<unknown>[]): boolean {
    return resources.some(r => r.isLoading);
}

/**
 * Check if all resources have successfully loaded
 * 
 * @param resources - Array of resources to check
 * @returns true if all resources are in success state
 */
export function isAllSuccess(resources: IResource<unknown>[]): boolean {
    return resources.length > 0 && resources.every(r => r.isSuccess);
}

/**
 * Check if any resources have errors
 * 
 * @param resources - Array of resources to check
 * @returns true if any resource is in error state
 */
export function isAnyError(resources: IResource<unknown>[]): boolean {
    return resources.some(r => r.isError);
}

/**
 * Get all errors from resources
 * 
 * @param resources - Array of resources to check
 * @returns Array of errors from failed resources
 */
export function getErrors(resources: IResource<unknown>[]): Error[] {
    return resources
        .filter(r => r.isError && r.error)
        .map(r => r.error as Error);
}

/**
 * Refetch all resources in parallel
 * 
 * @param resources - Array of resources to refetch
 * @returns Promise that resolves when all refetches complete
 */
export async function refetchAll(resources: IResource<unknown>[]): Promise<void> {
    await Promise.all(resources.map(r => r.refetch()));
}

/**
 * Clear all resources
 * 
 * @param resources - Array of resources to clear
 */
export function clearAll(resources: IResource<unknown>[]): void {
    resources.forEach(r => r.clear());
}

/**
 * Wait for all resources to finish loading (success or error)
 * 
 * @param resources - Array of resources to wait for
 * @returns Promise that resolves when all are done loading
 */
export async function waitForAll(resources: IResource<unknown>[]): Promise<void> {
    const promises = resources.map(resource => {
        return new Promise<void>((resolve) => {
            // If already done, resolve immediately
            if (resource.isSuccess || resource.isError) {
                resolve();
                return;
            }
            
            // Poll for completion (simple approach)
            const checkInterval = setInterval(() => {
                if (resource.isSuccess || resource.isError) {
                    clearInterval(checkInterval);
                    resolve();
                }
            }, 10);
        });
    });
    
    await Promise.all(promises);
}
