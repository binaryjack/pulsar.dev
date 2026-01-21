/**
 * Service Manager - IoC Container
 * Dependency injection system inspired by formular.dev
 * Copyright (c) 2025 pulsar Framework
 */

import {
    IDisposableService,
    IServiceDescriptor,
    IServiceManager,
    IServiceOptions,
    ServiceFactoryType,
    ServiceIdType
} from './service-manager.types'

/**
 * ServiceManager constructor
 * Creates a new IoC container instance
 */
export const ServiceManager = function(
    this: IServiceManager,
    parent?: IServiceManager
) {
    // Initialize services map
    Object.defineProperty(this, 'services', {
        value: new Map<ServiceIdType, IServiceDescriptor>(),
        writable: false,
        configurable: false,
        enumerable: true
    })

    // Initialize singleton instances cache
    Object.defineProperty(this, 'singletonInstances', {
        value: new Map<ServiceIdType, any>(),
        writable: false,
        configurable: false,
        enumerable: true
    })

    // Initialize scoped instances cache
    Object.defineProperty(this, 'scopedInstances', {
        value: new Map<ServiceIdType, any>(),
        writable: false,
        configurable: false,
        enumerable: true
    })

    // Set parent container
    Object.defineProperty(this, 'parent', {
        value: parent,
        writable: false,
        configurable: false,
        enumerable: true
    })

    // Initialize resolution stack for circular dependency detection
    Object.defineProperty(this, 'resolutionStack', {
        value: new Set<ServiceIdType>(),
        writable: false,
        configurable: false,
        enumerable: true
    })

    // Initialize disposed flag
    this.isDisposed = false
} as unknown as { new (parent?: IServiceManager): IServiceManager }

/**
 * Register a service using a factory function
 */
ServiceManager.prototype.register = function<T>(
    this: IServiceManager,
    identifier: ServiceIdType<T>,
    factory: ServiceFactoryType<T>,
    options?: IServiceOptions
): IServiceManager {
    this.throwIfDisposed()

    const descriptor: IServiceDescriptor<T> = {
        identifier,
        factory,
        lifetime: options?.lifetime ?? 'transient',
        dependencies: options?.dependencies ?? []
    }

    this.services.set(identifier, descriptor)

    if (typeof console !== 'undefined' && console.log) {
        console.log(
            `[ServiceManager] Registered: ${this.getServiceName(identifier)} (${descriptor.lifetime})`
        )
    }

    return this
}

/**
 * Register a service using a constructor class
 */
ServiceManager.prototype.registerClass = function<T>(
    this: IServiceManager,
    identifier: ServiceIdType<T>,
    constructor: new (...args: any[]) => T,
    options?: IServiceOptions
): IServiceManager {
    this.throwIfDisposed()

    const factory: ServiceFactoryType<T> = (container, ...params) => {
        // Resolve dependencies if specified
        const deps = options?.dependencies?.map(dep => 
            dep ? container.resolve(dep) : null
        ) ?? []

        // Create instance with dependencies
        return new constructor(...deps, ...params)
    }

    return this.register(identifier, factory, options)
}

/**
 * Register a pre-created instance as singleton
 */
ServiceManager.prototype.registerInstance = function<T>(
    this: IServiceManager,
    identifier: ServiceIdType<T>,
    instance: T
): IServiceManager {
    this.throwIfDisposed()

    // Store in singleton cache
    this.singletonInstances.set(identifier, instance)

    // Register descriptor
    this.services.set(identifier, {
        identifier,
        factory: () => instance,
        lifetime: 'singleton'
    })

    if (typeof console !== 'undefined' && console.log) {
        console.log(
            `[ServiceManager] Registered instance: ${this.getServiceName(identifier)}`
        )
    }

    return this
}

/**
 * Resolve a service from the container
 */
ServiceManager.prototype.resolve = function<T>(
    this: IServiceManager,
    identifier: ServiceIdType<T>,
    ...parameters: any[]
): T {
    const result = this.tryResolve(identifier, ...parameters)
    
    if (result === undefined) {
        throw new Error(
            `[ServiceManager] Service not found: ${this.getServiceName(identifier)}`
        )
    }
    
    return result
}

/**
 * Try to resolve a service (returns undefined if not found)
 */
ServiceManager.prototype.tryResolve = function<T>(
    this: IServiceManager,
    identifier: ServiceIdType<T>,
    ...parameters: any[]
): T | undefined {
    this.throwIfDisposed()

    // Check for circular dependency
    if (this.resolutionStack.has(identifier)) {
        const stack = Array.from(this.resolutionStack)
            .map(id => this.getServiceName(id))
            .join(' -> ')
        throw new Error(
            `[ServiceManager] Circular dependency detected: ${stack} -> ${this.getServiceName(identifier)}`
        )
    }

    // Add to resolution stack
    this.resolutionStack.add(identifier)

    try {
        // Check singleton cache
        if (this.singletonInstances.has(identifier)) {
            return this.singletonInstances.get(identifier) as T
        }

        // Check scoped cache
        if (this.scopedInstances.has(identifier)) {
            return this.scopedInstances.get(identifier) as T
        }

        // Find descriptor (check parent chain)
        const descriptor = this.findServiceDescriptor(identifier)
        if (!descriptor) {
            return undefined
        }

        // Reserve spot for singletons (prevents circular issues)
        if (descriptor.lifetime === 'singleton') {
            this.singletonInstances.set(identifier, Symbol('resolving'))
        }

        // Create instance
        const instance = descriptor.factory(this, ...parameters)

        // Cache based on lifetime
        switch (descriptor.lifetime) {
            case 'singleton':
                this.singletonInstances.set(identifier, instance)
                break
            case 'scoped':
                this.scopedInstances.set(identifier, instance)
                break
            case 'transient':
                // No caching
                break
            default:
                throw new Error(
                    `[ServiceManager] Invalid lifetime: ${descriptor.lifetime}`
                )
        }

        return instance
    } finally {
        // Remove from resolution stack
        this.resolutionStack.delete(identifier)
    }
}

/**
 * Create a lazy resolver for a service
 */
ServiceManager.prototype.lazy = function<T>(
    this: IServiceManager,
    identifier: ServiceIdType<T>,
    ...parameters: any[]
): () => T {
    let resolved = false
    let instance: T

    return () => {
        if (!resolved) {
            instance = this.resolve<T>(identifier, ...parameters)
            resolved = true
        }
        return instance
    }
}

/**
 * Check if a service is registered
 */
ServiceManager.prototype.isRegistered = function<T>(
    this: IServiceManager,
    identifier: ServiceIdType<T>
): boolean {
    return this.findServiceDescriptor(identifier) !== undefined
}

/**
 * Get human-readable name for a service identifier
 */
ServiceManager.prototype.getServiceName = function(
    this: IServiceManager,
    identifier: ServiceIdType
): string {
    if (typeof identifier === 'symbol') {
        return identifier.toString()
    }
    if (typeof identifier === 'string') {
        return identifier
    }
    if (typeof identifier === 'function') {
        return identifier.name || 'Anonymous'
    }
    return 'Unknown'
}

/**
 * Get list of all registered services
 */
ServiceManager.prototype.getRegisteredServices = function(
    this: IServiceManager
): ServiceIdType[] {
    const services = Array.from(this.services.keys())
    
    // Include parent services
    if (this.parent) {
        const parentServices = this.parent.getRegisteredServices()
        return [...new Set([...services, ...parentServices])]
    }
    
    return services
}

/**
 * Validate no circular dependencies exist
 */
ServiceManager.prototype.validateNoCycles = function(
    this: IServiceManager
): void {
    const visited = new Set<ServiceIdType>()
    const visiting = new Set<ServiceIdType>()

    const visit = (identifier: ServiceIdType, path: ServiceIdType[] = []): void => {
        if (visiting.has(identifier)) {
            const cycle = [...path, identifier]
                .map(id => this.getServiceName(id))
                .join(' -> ')
            throw new Error(
                `[ServiceManager] Circular dependency detected: ${cycle}`
            )
        }

        if (visited.has(identifier)) {
            return
        }

        visiting.add(identifier)
        
        const descriptor = this.findServiceDescriptor(identifier)
        if (descriptor?.dependencies) {
            for (const dependency of descriptor.dependencies) {
                if (dependency !== null) {
                    visit(dependency, [...path, identifier])
                }
            }
        }

        visiting.delete(identifier)
        visited.add(identifier)
    }

    // Validate all registered services
    for (const [identifier] of this.services) {
        if (!visited.has(identifier)) {
            visit(identifier)
        }
    }
}

/**
 * Create a new child scope
 */
ServiceManager.prototype.createScope = function(
    this: IServiceManager
): IServiceManager {
    return new ServiceManager(this)
}

/**
 * Find service descriptor (searches parent chain)
 */
ServiceManager.prototype.findServiceDescriptor = function<T>(
    this: IServiceManager,
    identifier: ServiceIdType<T>
): IServiceDescriptor | undefined {
    // Check local services
    if (this.services.has(identifier)) {
        return this.services.get(identifier)
    }

    // Check parent (chain of responsibility pattern)
    if (this.parent) {
        return this.parent.findServiceDescriptor(identifier)
    }

    return undefined
}

/**
 * Dispose the service manager
 */
ServiceManager.prototype.dispose = function(
    this: IServiceManager
): void {
    if (this.isDisposed) {
        return
    }

    // Dispose singleton instances
    for (const [identifier, instance] of this.singletonInstances) {
        if (instance && typeof (instance as IDisposableService).dispose === 'function') {
            try {
                (instance as IDisposableService).dispose()
                if (typeof console !== 'undefined' && console.log) {
                    console.log(
                        `[ServiceManager] Disposed: ${this.getServiceName(identifier)}`
                    )
                }
            } catch (error: any) {
                if (typeof console !== 'undefined' && console.error) {
                    console.error(
                        `[ServiceManager] Error disposing ${this.getServiceName(identifier)}:`,
                        error
                    )
                }
            }
        }
    }

    // Dispose scoped instances
    for (const [identifier, instance] of this.scopedInstances) {
        if (instance && typeof (instance as IDisposableService).dispose === 'function') {
            try {
                (instance as IDisposableService).dispose()
            } catch (error: any) {
                if (typeof console !== 'undefined' && console.error) {
                    console.error(
                        `[ServiceManager] Error disposing ${this.getServiceName(identifier)}:`,
                        error
                    )
                }
            }
        }
    }

    // Clear caches
    this.singletonInstances.clear()
    this.scopedInstances.clear()
    this.services.clear()

    this.isDisposed = true
}

/**
 * Throw if disposed
 */
ServiceManager.prototype.throwIfDisposed = function(
    this: IServiceManager
): void {
    if (this.isDisposed) {
        throw new Error('[ServiceManager] Service manager has been disposed')
    }
}
