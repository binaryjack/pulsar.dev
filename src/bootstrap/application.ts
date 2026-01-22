import { IApplicationInternal } from './application-internal.interface'
import { IBootstrapConfig } from './bootstrap-config.interface'

/**
 * Application constructor
 * Manages application lifecycle and component mounting
 */
export const Application = function<TProps = unknown>(
    this: IApplicationInternal<TProps>,
    config: IBootstrapConfig<TProps>
) {
    Object.defineProperty(this, 'config', {
        value: config,
        writable: true,
        enumerable: false
    })
    
    Object.defineProperty(this, '_rootElement', {
        value: null,
        writable: true,
        enumerable: false
    })
    
    Object.defineProperty(this, '_componentElement', {
        value: null,
        writable: true,
        enumerable: false
    })
    
    Object.defineProperty(this, '_isMounted', {
        value: false,
        writable: true,
        enumerable: false
    })
} as unknown as { new <TProps = unknown>(config: IBootstrapConfig<TProps>): IApplicationInternal<TProps> }

// Define getters
Object.defineProperty(Application.prototype, 'rootElement', {
    get(this: IApplicationInternal): HTMLElement {
        if (!this._rootElement) {
            throw new Error('Application not initialized. Call mount() first.')
        }
        return this._rootElement
    },
    enumerable: true,
    configurable: false
})

Object.defineProperty(Application.prototype, 'componentElement', {
    get(this: IApplicationInternal): HTMLElement | null {
        return this._componentElement
    },
    enumerable: true,
    configurable: false
})
