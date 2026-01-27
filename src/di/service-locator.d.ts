/**
 * Service Locator Pattern
 * Provides simplified service access with caching
 */
import { IServiceManager, ServiceIdType } from './service-manager.types';
/**
 * Service locator interface
 */
export interface IServiceLocator {
    /**
     * Get a service (throws if not found)
     * @param identifier - Service identifier
     * @returns Service instance
     */
    get<T>(identifier: ServiceIdType<T>): T;
    /**
     * Try to get a service (returns undefined if not found)
     * @param identifier - Service identifier
     * @returns Service instance or undefined
     */
    tryGet<T>(identifier: ServiceIdType<T>): T | undefined;
    /**
     * Get a lazy resolver for a service
     * @param identifier - Service identifier
     * @returns Lazy resolver function
     */
    lazy<T>(identifier: ServiceIdType<T>): () => T;
    /**
     * Clear the cache
     */
    clear(): void;
}
/**
 * ServiceLocator constructor
 * Wraps a ServiceManager with caching
 */
export declare const ServiceLocator: {
    new (serviceManager: IServiceManager): IServiceLocator;
};
