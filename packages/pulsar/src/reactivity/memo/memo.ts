import { IMemo } from './memo.types'

// Import prototype methods
import { dispose } from './prototype/dispose'
import { invalidate } from './prototype/invalidate'
import { notify } from './prototype/notify'
import { read } from './prototype/read'
import { subscribe } from './prototype/subscribe'

/**
 * Memo constructor function (prototype-based class)
 * Memoized computed value that only recomputes when dependencies change
 */
export const Memo = function<T>(
    this: IMemo<T>,
    computeFn: () => T
) {
    Object.defineProperty(this, 'computeFn', {
        value: computeFn,
        writable: false,
        configurable: false,
        enumerable: false
    })
    
    Object.defineProperty(this, 'isDirty', {
        value: true,
        writable: true,
        configurable: false,
        enumerable: false
    })
    
    // Store dependencies for tracking
    Object.defineProperty(this, 'dependencies', {
        value: new Set(),
        writable: false,
        configurable: false,
        enumerable: false
    })
    
    // Store subscribers (effects that read this memo)
    Object.defineProperty(this, 'subscribers', {
        value: new Set(),
        writable: false,
        configurable: false,
        enumerable: false
    })
} as unknown as { new <T>(computeFn: () => T): IMemo<T> }

// Attach prototype methods
Object.assign(Memo.prototype, {
    read,
    invalidate,
    dispose,
    subscribe,
    notify
})
