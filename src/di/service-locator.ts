/**
 * Service Locator Pattern
 * Provides simplified service access with caching
 */

import { IServiceManager, ServiceIdType } from './service-manager.types'

/**
 * Service locator interface
 */
export interface IServiceLocator {
    /**
     * Get a service (throws if not found)
     * @param identifier - Service identifier
     * @returns Service instance
     */
    get<T>(identifier: ServiceIdType<T>): T

    /**
     * Try to get a service (returns undefined if not found)
     * @param identifier - Service identifier
     * @returns Service instance or undefined
     */
    tryGet<T>(identifier: ServiceIdType<T>): T | undefined

    /**
     * Get a lazy resolver for a service
     * @param identifier - Service identifier
     * @returns Lazy resolver function
     */
    lazy<T>(identifier: ServiceIdType<T>): () => T

    /**
     * Clear the cache
     */
    clear(): void
}

/**
 * ServiceLocator constructor
 * Wraps a ServiceManager with caching
 */
export const ServiceLocator = function(
    this: IServiceLocator,
    serviceManager: IServiceManager
) {
    const cache = new Map<ServiceIdType, any>()

    /**
     * Get a service with caching
     */
    this.get = function<T>(identifier: ServiceIdType<T>): T {
        if (cache.has(identifier)) {
            return cache.get(identifier) as T
        }

        const service = serviceManager.resolve<T>(identifier)
        cache.set(identifier, service)
        return service
    }

    /**
     * Try to get a service
     */
    this.tryGet = function<T>(identifier: ServiceIdType<T>): T | undefined {
        try {
            return this.get<T>(identifier)
        } catch {
            return undefined
        }
    }

    /**
     * Get a lazy resolver
     */
    this.lazy = function<T>(identifier: ServiceIdType<T>): () => T {
        let resolved = false
        let service: T

        return () => {
            if (!resolved) {
                service = this.get<T>(identifier)
                resolved = true
            }
            return service
        }
    }

    /**
     * Clear the cache
     */
    this.clear = function(): void {
        cache.clear()
    }
} as unknown as { new (serviceManager: IServiceManager): IServiceLocator }
