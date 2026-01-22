/**
 * Application Builder
 * Fluent API for configuring application bootstrap
 */

import { IServiceManager, ServiceFactoryType, ServiceIdType } from '../di/service-manager.types'
import { IApplicationBuilder } from './application-builder.interface'
import { ApplicationRoot } from './application-root'
import { IApplicationRoot } from './application-root.interface'
import { mount } from './prototype/root/mount'
import { unmount } from './prototype/root/unmount'

// Attach prototype methods
ApplicationRoot.prototype.mount = mount
ApplicationRoot.prototype.unmount = unmount

/**
 * ApplicationBuilder constructor
 */
export const ApplicationBuilder = function(this: IApplicationBuilderInternal) {
    Object.defineProperty(this, '_root', {
        value: null,
        writable: true,
        enumerable: false
    })
    
    Object.defineProperty(this, '_onMount', {
        value: undefined,
        writable: true,
        enumerable: false
    })
    
    Object.defineProperty(this, '_onUnmount', {
        value: undefined,
        writable: true,
        enumerable: false
    })
    
    Object.defineProperty(this, '_onError', {
        value: undefined,
        writable: true,
        enumerable: false
    })
    
    Object.defineProperty(this, '_serviceManager', {
        value: undefined,
        writable: true,
        enumerable: false
    })
    
    Object.defineProperty(this, '_settings', {
        value: undefined,
        writable: true,
        enumerable: false
    })
    
    Object.defineProperty(this, '_stateManager', {
        value: undefined,
        writable: true,
        enumerable: false
    })
} as unknown as { new (): IApplicationBuilderInternal }

interface IApplicationBuilderInternal extends IApplicationBuilder {
    _root: string | HTMLElement | null
    _onMount?: (element: HTMLElement) => void
    _onUnmount?: () => void
    _onError?: (error: Error) => void
    _serviceManager?: IServiceManager
    _settings?: unknown
    _stateManager?: unknown
}

/**
 * Set root element
 */
ApplicationBuilder.prototype.root = function(
    this: IApplicationBuilderInternal,
    selector: string | HTMLElement
): IApplicationBuilder {
    this._root = selector
    return this
}

/**
 * Set mount callback
 */
ApplicationBuilder.prototype.onMount = function(
    this: IApplicationBuilderInternal,
    callback: (element: HTMLElement) => void
): IApplicationBuilder {
    this._onMount = callback
    return this
}

/**
 * Set unmount callback
 */
ApplicationBuilder.prototype.onUnmount = function(
    this: IApplicationBuilderInternal,
    callback: () => void
): IApplicationBuilder {
    this._onUnmount = callback
    return this
}

/**
 * Set error handler
 */
ApplicationBuilder.prototype.onError = function(
    this: IApplicationBuilderInternal,
    callback: (error: Error) => void
): IApplicationBuilder {
    this._onError = callback
    return this
}

/**
 * Configure IoC container
 */
ApplicationBuilder.prototype.ioc = function(
    this: IApplicationBuilderInternal,
    serviceManager: IServiceManager
): IApplicationBuilder {
    this._serviceManager = serviceManager
    console.log('[ApplicationBuilder] IoC container configured')
    return this
}

/**
 * Register a service instance
 */
ApplicationBuilder.prototype.register = function<T>(
    this: IApplicationBuilderInternal,
    identifier: ServiceIdType<T>,
    instance: T
): IApplicationBuilder {
    if (!this._serviceManager) {
        throw new Error('[ApplicationBuilder] ServiceManager not configured. Call .ioc() first.')
    }
    
    this._serviceManager.registerInstance(identifier, instance)
    return this
}

/**
 * Register a service using a factory
 */
ApplicationBuilder.prototype.registerFactory = function<T>(
    this: IApplicationBuilderInternal,
    identifier: ServiceIdType<T>,
    factory: ServiceFactoryType<T>,
    options?: { lifetime?: 'singleton' | 'transient' | 'scoped' }
): IApplicationBuilder {
    if (!this._serviceManager) {
        throw new Error('[ApplicationBuilder] ServiceManager not configured. Call .ioc() first.')
    }
    
    this._serviceManager.register(identifier, factory, options)
    return this
}

/**
 * Configure application settings (future feature)
 */
ApplicationBuilder.prototype.settings = function(
    this: IApplicationBuilderInternal,
    settings: unknown
): IApplicationBuilder {
    this._settings = settings
    console.warn('[ApplicationBuilder] Settings support coming soon')
    return this
}

/**
 * Configure state manager (future feature)
 */
ApplicationBuilder.prototype.stateManager = function(
    this: IApplicationBuilderInternal,
    store: unknown
): IApplicationBuilder {
    this._stateManager = store
    console.warn('[ApplicationBuilder] State manager support coming soon')
    return this
}

/**
 * Build the application root
 */
ApplicationBuilder.prototype.build = function(this: IApplicationBuilderInternal): IApplicationRoot {
    if (!this._root) {
        throw new Error('[ApplicationBuilder] Root element is required')
    }
    
    // Resolve root element
    let rootElement: HTMLElement
    
    if (typeof this._root === 'string') {
        const element = document.querySelector(this._root)
        if (!element) {
            throw new Error(`[ApplicationBuilder] Root element not found: ${this._root}`)
        }
        rootElement = element as HTMLElement
    } else {
        rootElement = this._root
    }
    
    return new ApplicationRoot(
        rootElement,
        this._onMount,
        this._onUnmount,
        this._onError,
        this._serviceManager
    )
}

/**
 * Create a new application builder
 * 
 * @example
 * ```tsx
 * const appRoot = bootstrapApp()
 *     .root('#app')
 *     .onMount((el) => console.log('Mounted'))
 *     .onError((err) => console.error(err))
 *     .build()
 * 
 * // Use with provider
 * <AppContextProvider root={appRoot}>
 *     <MyApp />
 * </AppContextProvider>
 * ```
 */
export const bootstrapApp = (): IApplicationBuilder => {
    return new ApplicationBuilder()
}
