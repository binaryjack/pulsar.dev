import { EventHandler } from '../synthetic-event/synthetic-event.types'

export const SEventDelegator = Symbol.for('IEventDelegator')

export interface IEventDelegator {
    // Constructor signature
    new (): IEventDelegator
    
    // Internal state
    readonly handlers: WeakMap<HTMLElement, Map<string, EventHandler>>
    readonly cleanupFunctions: WeakMap<HTMLElement, Map<string, () => void>>
    
    // Methods (defined in prototype)
    addEventListener: (
        element: HTMLElement,
        eventType: string,
        handler: EventHandler,
        options?: AddEventListenerOptions
    ) => () => void
    removeEventListener: (
        element: HTMLElement,
        eventType: string
    ) => void
    removeAllListeners: (element: HTMLElement) => void
    hasListener: (element: HTMLElement, eventType: string) => boolean
}
