/**
 * Application Root
 * Represents a mounting point for the application
 */

import { IServiceManager } from '../di/service-manager.types'
import { IApplicationRootInternal } from './application-root-internal.interface'

/**
 * ApplicationRoot constructor
 */
export const ApplicationRoot = function(
    this: IApplicationRootInternal,
    rootElement: HTMLElement,
    onMount?: (element: HTMLElement) => void,
    onUnmount?: () => void,
    onError?: (error: Error) => void,
    serviceManager?: IServiceManager
) {
    Object.defineProperty(this, 'rootElement', {
        value: rootElement,
        writable: false,
        enumerable: true
    })
    
    Object.defineProperty(this, 'serviceManager', {
        value: serviceManager,
        writable: false,
        enumerable: true
    })
    
    Object.defineProperty(this, 'onMount', {
        value: onMount,
        writable: false,
        enumerable: true
    })
    
    Object.defineProperty(this, 'onUnmount', {
        value: onUnmount,
        writable: false,
        enumerable: true
    })
    
    Object.defineProperty(this, 'onError', {
        value: onError,
        writable: false,
        enumerable: true
    })
    
    Object.defineProperty(this, '_mountedComponent', {
        value: null,
        writable: true,
        enumerable: false
    })
    
    Object.defineProperty(this, '_isMounted', {
        value: false,
        writable: true,
        enumerable: false
    })
} as unknown as { new (
    rootElement: HTMLElement,
    onMount?: (element: HTMLElement) => void,
    onUnmount?: () => void,
    onError?: (error: Error) => void,
    serviceManager?: IServiceManager
): IApplicationRootInternal }
