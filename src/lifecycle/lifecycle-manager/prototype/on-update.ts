import { ILifecycleManager, LifecycleCallback } from '../lifecycle-manager.types'

/**
 * Registers a callback to run when the element is updated
 */
export const onUpdate = function(
    this: ILifecycleManager,
    element: HTMLElement,
    callback: LifecycleCallback
): void {
    if (!this.updateCallbacks.has(element)) {
        this.updateCallbacks.set(element, [])
    }
    
    this.updateCallbacks.get(element)!.push(callback)
}
