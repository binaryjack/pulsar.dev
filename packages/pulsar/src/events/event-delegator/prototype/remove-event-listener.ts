import { IEventDelegator } from '../event-delegator.types'

/**
 * Removes an event listener from an element
 */
export const removeEventListener = function(
    this: IEventDelegator,
    element: HTMLElement,
    eventType: string
): void {
    const cleanups = this.cleanupFunctions.get(element)
    
    if (cleanups) {
        const cleanup = cleanups.get(eventType)
        if (cleanup) {
            cleanup()
        }
    }
}
