import { createSyntheticEvent } from '../../synthetic-event'
import { EventHandler } from '../../synthetic-event/synthetic-event.types'
import { IEventDelegator } from '../event-delegator.types'

/**
 * Adds an event listener to an element with synthetic event wrapping
 * Returns a cleanup function
 */
export const addEventListener = function(
    this: IEventDelegator,
    element: HTMLElement,
    eventType: string,
    handler: EventHandler,
    options?: AddEventListenerOptions
): () => void {
    // Ensure handlers map exists for element
    if (!this.handlers.has(element)) {
        this.handlers.set(element, new Map())
    }
    
    if (!this.cleanupFunctions.has(element)) {
        this.cleanupFunctions.set(element, new Map())
    }
    
    const elementHandlers = this.handlers.get(element)!
    const elementCleanups = this.cleanupFunctions.get(element)!
    
    // Wrap handler to create synthetic event
    const wrappedHandler = (nativeEvent: Event) => {
        const syntheticEvent = createSyntheticEvent(nativeEvent)
        handler(syntheticEvent)
    }
    
    // Store handler
    elementHandlers.set(eventType, handler)
    
    // Add native listener
    element.addEventListener(eventType, wrappedHandler as EventListener, options)
    
    // Create cleanup function
    const cleanup = () => {
        element.removeEventListener(eventType, wrappedHandler as EventListener, options)
        elementHandlers.delete(eventType)
        elementCleanups.delete(eventType)
    }
    
    elementCleanups.set(eventType, cleanup)
    
    return cleanup
}
