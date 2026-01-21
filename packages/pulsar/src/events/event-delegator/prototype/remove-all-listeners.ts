import { IEventDelegator } from '../event-delegator.types'

/**
 * Removes all event listeners from an element
 */
export const removeAllListeners = function(
    this: IEventDelegator,
    element: HTMLElement
): void {
    const cleanups = this.cleanupFunctions.get(element)
    
    if (cleanups) {
        cleanups.forEach(cleanup => cleanup())
        cleanups.clear()
    }
    
    this.handlers.delete(element)
    this.cleanupFunctions.delete(element)
}
