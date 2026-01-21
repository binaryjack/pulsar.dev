/**
 * Application root interface
 */

import { IServiceManager } from '../di/service-manager.types'

export interface IApplicationRoot {
    /**
     * Root DOM element
     */
    readonly rootElement: HTMLElement
    
    /**
     * Service manager instance (if configured)
     */
    readonly serviceManager?: IServiceManager
    
    /**
     * Mount a component to the root
     */
    mount(component: HTMLElement): void
    
    /**
     * Unmount the current component
     */
    unmount(): void
    
    /**
     * Error handler
     */
    readonly onError?: (error: Error) => void
    
    /**
     * Mount callback
     */
    readonly onMount?: (element: HTMLElement) => void
    
    /**
     * Unmount callback
     */
    readonly onUnmount?: () => void
}
