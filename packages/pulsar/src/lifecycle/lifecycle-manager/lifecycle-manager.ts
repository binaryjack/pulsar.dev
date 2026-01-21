import { ILifecycleManager } from './lifecycle-manager.types'

// Import prototype methods
import { onCleanup } from './prototype/on-cleanup'
import { onMount } from './prototype/on-mount'
import { onUpdate } from './prototype/on-update'
import { runCleanup } from './prototype/run-cleanup'
import { runMount } from './prototype/run-mount'
import { runUpdate } from './prototype/run-update'

/**
 * LifecycleManager constructor function (prototype-based class)
 * Manages component lifecycle callbacks (mount, cleanup, update)
 */
export const LifecycleManager = function(this: ILifecycleManager) {
    Object.defineProperty(this, 'mountCallbacks', {
        value: new WeakMap(),
        writable: false,
        configurable: false,
        enumerable: false
    })
    
    Object.defineProperty(this, 'cleanupCallbacks', {
        value: new WeakMap(),
        writable: false,
        configurable: false,
        enumerable: false
    })
    
    Object.defineProperty(this, 'updateCallbacks', {
        value: new WeakMap(),
        writable: false,
        configurable: false,
        enumerable: false
    })
} as unknown as { new (): ILifecycleManager }

// Attach prototype methods
Object.assign(LifecycleManager.prototype, {
    onMount,
    onCleanup,
    onUpdate,
    runMount,
    runCleanup,
    runUpdate
})
