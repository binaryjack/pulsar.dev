import { ILifecycleManager, LifecycleCallback } from '../lifecycle-manager.types'

/**
 * Registers a callback to run when the element is mounted to the DOM
 */
export const onMount = function(
    this: ILifecycleManager,
    element: HTMLElement,
    callback: LifecycleCallback
): void {
    if (!this.mountCallbacks.has(element)) {
        this.mountCallbacks.set(element, [])
    }
    
    this.mountCallbacks.get(element)!.push(callback)
}
