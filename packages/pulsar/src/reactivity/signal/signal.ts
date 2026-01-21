import { ISignal, ISignalOptions } from './signal.types'

// Import prototype methods
import { dispose } from './prototype/dispose'
import { read } from './prototype/read'
import { subscribe } from './prototype/subscribe'
import { unsubscribe } from './prototype/unsubscribe'
import { write } from './prototype/write'

/**
 * Signal constructor function (prototype-based class)
 * Reactive primitive for fine-grained reactivity
 */
export const Signal = function<T>(
    this: ISignal<T>,
    initialValue: T,
    options?: ISignalOptions<T>
) {
    // Define value property
    Object.defineProperty(this, '_value', {
        value: initialValue,
        writable: true,
        configurable: false,
        enumerable: false
    })
    
    // Define subscribers set
    Object.defineProperty(this, 'subscribers', {
        value: new Set<() => void>(),
        writable: false,
        configurable: false,
        enumerable: false
    })
    
    // Define options if provided
    if (options) {
        Object.defineProperty(this, 'options', {
            value: options,
            writable: false,
            configurable: false,
            enumerable: false
        })
    }
} as unknown as { new <T>(initialValue: T, options?: ISignalOptions<T>): ISignal<T> }

// Attach prototype methods
Object.assign(Signal.prototype, {
    read,
    write,
    subscribe,
    unsubscribe,
    dispose
})
