import { ILifecycleManager } from '../lifecycle-manager.types'

/**
 * Registers a cleanup callback to run when the element is removed from the DOM
 */
export const onCleanup = function(
    this: ILifecycleManager,
    element: HTMLElement,
    callback: () => void
): void {
    if (!this.cleanupCallbacks.has(element)) {
        this.cleanupCallbacks.set(element, [])
    }
    
    this.cleanupCallbacks.get(element)!.push(callback)
}
