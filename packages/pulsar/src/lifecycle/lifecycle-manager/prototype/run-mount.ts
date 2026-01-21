import { ILifecycleManager } from '../lifecycle-manager.types'

/**
 * Runs all mount callbacks for an element and stores any cleanup functions
 */
export const runMount = function(
    this: ILifecycleManager,
    element: HTMLElement
): void {
    const callbacks = this.mountCallbacks.get(element)
    
    if (callbacks) {
        callbacks.forEach(callback => {
            const cleanup = callback()
            
            // If callback returns a cleanup function, store it
            if (typeof cleanup === 'function') {
                this.onCleanup(element, cleanup)
            }
        })
    }
}
