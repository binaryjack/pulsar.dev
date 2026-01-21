import { IEventDelegator } from './event-delegator.types'

// Import prototype methods
import { addEventListener } from './prototype/add-event-listener'
import { hasListener } from './prototype/has-listener'
import { removeAllListeners } from './prototype/remove-all-listeners'
import { removeEventListener } from './prototype/remove-event-listener'

/**
 * EventDelegator constructor function (prototype-based class)
 * Manages event listeners with automatic synthetic event wrapping and cleanup
 */
export const EventDelegator = function(this: IEventDelegator) {
    Object.defineProperty(this, 'handlers', {
        value: new WeakMap(),
        writable: false,
        configurable: false,
        enumerable: false
    })
    
    Object.defineProperty(this, 'cleanupFunctions', {
        value: new WeakMap(),
        writable: false,
        configurable: false,
        enumerable: false
    })
} as unknown as { new (): IEventDelegator }

// Attach prototype methods
Object.assign(EventDelegator.prototype, {
    addEventListener,
    removeEventListener,
    removeAllListeners,
    hasListener
})
