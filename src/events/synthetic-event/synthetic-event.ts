import { ISyntheticEvent } from './synthetic-event.types'

// Import prototype methods
import { isDefaultPrevented } from './prototype/is-default-prevented'
import { isPropagationStopped } from './prototype/is-propagation-stopped'
import { preventDefault } from './prototype/prevent-default'
import { stopImmediatePropagation } from './prototype/stop-immediate-propagation'
import { stopPropagation } from './prototype/stop-propagation'

/**
 * SyntheticEvent constructor function (prototype-based class)
 * Provides a React-like normalized event interface over native DOM events
 */
export const SyntheticEvent = function<T extends EventTarget = EventTarget>(
    this: ISyntheticEvent<T>,
    nativeEvent: Event
) {
    Object.defineProperty(this, 'nativeEvent', {
        value: nativeEvent,
        writable: false,
        configurable: false,
        enumerable: true
    })
    
    Object.defineProperty(this, 'type', {
        value: nativeEvent.type,
        writable: false,
        configurable: false,
        enumerable: true
    })
    
    Object.defineProperty(this, 'target', {
        value: nativeEvent.target,
        writable: false,
        configurable: false,
        enumerable: true
    })
    
    Object.defineProperty(this, 'currentTarget', {
        value: nativeEvent.currentTarget as T,
        writable: false,
        configurable: false,
        enumerable: true
    })
    
    Object.defineProperty(this, 'timeStamp', {
        value: nativeEvent.timeStamp,
        writable: false,
        configurable: false,
        enumerable: true
    })
    
    Object.defineProperty(this, 'bubbles', {
        value: nativeEvent.bubbles,
        writable: false,
        configurable: false,
        enumerable: true
    })
    
    Object.defineProperty(this, 'cancelable', {
        value: nativeEvent.cancelable,
        writable: false,
        configurable: false,
        enumerable: true
    })
    
    Object.defineProperty(this, 'defaultPrevented', {
        value: nativeEvent.defaultPrevented,
        writable: false,
        configurable: false,
        enumerable: true
    })
    
    Object.defineProperty(this, 'eventPhase', {
        value: nativeEvent.eventPhase,
        writable: false,
        configurable: false,
        enumerable: true
    })
    
    Object.defineProperty(this, 'isTrusted', {
        value: nativeEvent.isTrusted,
        writable: false,
        configurable: false,
        enumerable: true
    })
} as unknown as { new <T extends EventTarget>(nativeEvent: Event): ISyntheticEvent<T> }

// Attach prototype methods
Object.assign(SyntheticEvent.prototype, {
    preventDefault,
    stopPropagation,
    stopImmediatePropagation,
    isPropagationStopped,
    isDefaultPrevented
})
