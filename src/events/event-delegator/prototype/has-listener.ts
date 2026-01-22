import { IEventDelegator } from '../event-delegator.types'

/**
 * Checks if an element has a specific event listener
 */
export const hasListener = function(
    this: IEventDelegator,
    element: HTMLElement,
    eventType: string
): boolean {
    const handlers = this.handlers.get(element)
    return handlers ? handlers.has(eventType) : false
}
