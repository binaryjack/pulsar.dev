/**
 * Application builder interface
 */

import { IServiceManager, ServiceFactoryType, ServiceIdType } from '../di/service-manager.types'
import { IApplicationRoot } from './application-root.interface'

export interface IApplicationBuilder {
    /**
     * Set the root element
     */
    root(selector: string | HTMLElement): IApplicationBuilder
    
    /**
     * Set mount callback
     */
    onMount(callback: (element: HTMLElement) => void): IApplicationBuilder
    
    /**
     * Set unmount callback
     */
    onUnmount(callback: () => void): IApplicationBuilder
    
    /**
     * Set error handler
     */
    onError(callback: (error: Error) => void): IApplicationBuilder
    
    /**
     * Configure IoC container
     * @param serviceManager - ServiceManager instance for dependency injection
     * @returns The builder for method chaining
     * 
     * @example
     * ```typescript
     * const sm = new ServiceManager()
     * const app = bootstrapApp()
     *   .ioc(sm)
     *   .root('#app')
     *   .build()
     * ```
     */
    ioc(serviceManager: IServiceManager): IApplicationBuilder
    
    /**
     * Register a service instance directly on the builder
     * Convenience method for fluent service registration
     * @param identifier - Unique service identifier
     * @param instance - Service instance to register
     * @returns The builder for method chaining
     * 
     * @example
     * ```typescript
     * bootstrapApp()
     *   .ioc(serviceManager)
     *   .register(SConfigService, new ConfigService())
     *   .register(SApiService, new ApiService())
     *   .root('#app')
     *   .build()
     * ```
     */
    register<T>(identifier: ServiceIdType<T>, instance: T): IApplicationBuilder
    
    /**
     * Register a service using a factory function
     * @param identifier - Unique service identifier
     * @param factory - Factory function to create the service
     * @param options - Service lifetime options
     * @returns The builder for method chaining
     */
    registerFactory<T>(
        identifier: ServiceIdType<T>,
        factory: ServiceFactoryType<T>,
        options?: { lifetime?: 'singleton' | 'transient' | 'scoped' }
    ): IApplicationBuilder
    
    /**
     * Configure application settings (future feature)
     */
    settings(settings: unknown): IApplicationBuilder
    
    /**
     * Configure state manager/store (future feature)
     */
    stateManager(store: unknown): IApplicationBuilder
    
    /**
     * Build and return the application root
     */
    build(): IApplicationRoot
}
