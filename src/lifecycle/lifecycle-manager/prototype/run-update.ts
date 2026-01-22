import { ILifecycleManager } from '../lifecycle-manager.types'

/**
 * Runs all update callbacks for an element
 */
export const runUpdate = function(
    this: ILifecycleManager,
    element: HTMLElement
): void {
    const callbacks = this.updateCallbacks.get(element)
    
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
