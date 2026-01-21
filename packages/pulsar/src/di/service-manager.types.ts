/**
 * Service Manager Types
 * Type definitions for pulsar's IoC container
 * Inspired by formular.dev's ServiceManager
 */

/**
 * Unique identifier for a service
 * Can be a Symbol, string, or constructor function
 */
export type ServiceIdType<T = any> = symbol | string | (new (...args: any[]) => T)

/**
 * Service lifecycle management strategy
 * - singleton: One instance for application lifetime
 * - transient: New instance every time
 * - scoped: One instance per scope
 */
export type ServiceLifetimeType = 'singleton' | 'transient' | 'scoped'

/**
 * Factory function for creating service instances
 */
export type ServiceFactoryType<T = any> = (container: IServiceManager, ...parameters: any[]) => T

/**
 * Service descriptor containing registration information
 */
export interface IServiceDescriptor<T = any> {
    /** Unique identifier for the service */
    identifier: ServiceIdType<T>
    /** Factory function that creates instances */
    factory: ServiceFactoryType<T>
    /** Lifecycle management strategy */
    lifetime: ServiceLifetimeType
    /** Optional array of dependency identifiers */
    dependencies?: ServiceIdType[]
}

/**
 * Options for service registration
 */
export interface IServiceOptions {
    /** Lifecycle management strategy (default: 'transient') */
    lifetime?: ServiceLifetimeType
    /** Dependencies required by this service */
    dependencies?: ServiceIdType[]
}

/**
 * Interface for services that require cleanup
 */
export interface IDisposableService {
    /** Cleanup method called during disposal */
    dispose(): void
}

/**
 * Main interface for the IoC container
 */
export interface IServiceManager {
    /**
     * Constructor for creating a new ServiceManager
     * @param parent - Optional parent container for hierarchical DI
     */
    new (parent?: IServiceManager): IServiceManager

    /** Stack tracking current resolution chain for circular dependency detection */
    readonly resolutionStack: Set<ServiceIdType>
    /** Map of all registered service descriptors */
    readonly services: Map<ServiceIdType, IServiceDescriptor>
    /** Cache of singleton instances */
    readonly singletonInstances: Map<ServiceIdType, any>
    /** Cache of scoped instances */
    readonly scopedInstances: Map<ServiceIdType, any>
    /** Optional parent container */
    readonly parent?: IServiceManager
    /** Flag indicating if disposed */
    isDisposed: boolean

    /**
     * Register a service using a factory function
     * @param identifier - Unique identifier for the service
     * @param factory - Function that creates instances
     * @param options - Registration options (lifetime, dependencies)
     * @returns The service manager for method chaining
     * 
     * @example
     * ```typescript
     * serviceManager.register(
     *   SConfigService,
     *   (sm) => new ConfigService(),
     *   { lifetime: 'singleton' }
     * )
     * ```
     */
    register<T>(
        identifier: ServiceIdType<T>,
        factory: ServiceFactoryType<T>,
        options?: IServiceOptions
    ): IServiceManager

    /**
     * Register a service using a constructor class
     * @param identifier - Unique identifier for the service
     * @param constructor - Constructor function
     * @param options - Registration options
     * @returns The service manager for method chaining
     * 
     * @example
     * ```typescript
     * serviceManager.registerClass(
     *   SConfigService,
     *   ConfigService,
     *   { lifetime: 'singleton', dependencies: [SLoggerService] }
     * )
     * ```
     */
    registerClass<T>(
        identifier: ServiceIdType<T>,
        constructor: new (...args: any[]) => T,
        options?: IServiceOptions
    ): IServiceManager

    /**
     * Register a pre-created instance as a singleton
     * @param identifier - Unique identifier
     * @param instance - Pre-created instance
     * @returns The service manager for method chaining
     * 
     * @example
     * ```typescript
     * const config = new ConfigService()
     * serviceManager.registerInstance(SConfigService, config)
     * ```
     */
    registerInstance<T>(identifier: ServiceIdType<T>, instance: T): IServiceManager

    /**
     * Resolve a service from the container
     * @param identifier - Unique identifier
     * @param parameters - Additional parameters for factory
     * @returns The resolved service instance
     * @throws Error if service not found or circular dependency detected
     * 
     * @example
     * ```typescript
     * const config = serviceManager.resolve<IConfigService>(SConfigService)
     * ```
     */
    resolve<T>(identifier: ServiceIdType<T>, ...parameters: any[]): T

    /**
     * Try to resolve a service, returns undefined if not found
     * @param identifier - Unique identifier
     * @param parameters - Additional parameters
     * @returns The service instance or undefined
     */
    tryResolve<T>(identifier: ServiceIdType<T>, ...parameters: any[]): T | undefined

    /**
     * Create a lazy resolver for a service
     * Service is only instantiated when the returned function is first called
     * @param identifier - Unique identifier
     * @param parameters - Additional parameters
     * @returns Function that resolves the service when called
     * 
     * @example
     * ```typescript
     * const lazyConfig = serviceManager.lazy<IConfigService>(SConfigService)
     * 
     * // Service not created yet
     * const config = lazyConfig()  // Service created here
     * const same = lazyConfig()    // Returns cached instance
     * ```
     */
    lazy<T>(identifier: ServiceIdType<T>, ...parameters: any[]): () => T

    /**
     * Check if a service is registered
     * @param identifier - Unique identifier
     * @returns True if registered
     */
    isRegistered<T>(identifier: ServiceIdType<T>): boolean

    /**
     * Get human-readable name for a service identifier
     * @param identifier - Service identifier
     * @returns Human-readable name
     */
    getServiceName(identifier: ServiceIdType): string

    /**
     * Get list of all registered service identifiers
     * @returns Array of service identifiers
     */
    getRegisteredServices(): ServiceIdType[]

    /**
     * Validate that no circular dependencies exist
     * @throws Error if circular dependencies detected
     * 
     * @example
     * ```typescript
     * if (process.env.NODE_ENV === 'development') {
     *   serviceManager.validateNoCycles()
     * }
     * ```
     */
    validateNoCycles(): void

    /**
     * Create a new child scope
     * Useful for request-scoped services
     * @returns New scoped service manager
     * 
     * @example
     * ```typescript
     * const requestScope = serviceManager.createScope()
     * requestScope.register(SRequestContext, () => new RequestContext(), {
     *   lifetime: 'scoped'
     * })
     * 
     * // Child can access parent services
     * const config = requestScope.resolve(SConfigService)
     * ```
     */
    createScope(): IServiceManager

    /**
     * Find service descriptor for an identifier
     * Searches up the parent chain
     * @param identifier - Service identifier
     * @returns Service descriptor or undefined
     */
    findServiceDescriptor<T>(identifier: ServiceIdType<T>): IServiceDescriptor | undefined

    /**
     * Dispose the service manager
     * Calls dispose on all services that implement IDisposableService
     */
    dispose(): void

    /**
     * Throw if disposed
     * @throws Error if service manager is disposed
     */
    throwIfDisposed(): void
}

/**
 * Symbol identifier for IServiceManager
 */
export const SServiceManager = Symbol.for('IServiceManager')
