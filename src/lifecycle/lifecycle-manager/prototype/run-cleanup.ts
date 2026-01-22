import { ILifecycleManager } from '../lifecycle-manager.types'

/**
 * Runs all cleanup callbacks for an element and clears all lifecycle data
 */
export const runCleanup = function(
    this: ILifecycleManager,
    element: HTMLElement
): void {
    const callbacks = this.cleanupCallbacks.get(element)
    
    if (callbacks) {
        callbacks.forEach(callback => callback())
        callbacks.length = 0
    }
    
    // Clear all lifecycle data for this element
    this.mountCallbacks.delete(element)
    this.cleanupCallbacks.delete(element)
    this.updateCallbacks.delete(element)
}
