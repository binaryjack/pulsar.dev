import { IEffect, IEffectInternal } from './effect.types'

// Import prototype methods
import { addDependency } from './prototype/add-dependency'
import { cleanup } from './prototype/cleanup'
import { dispose } from './prototype/dispose'
import { execute } from './prototype/execute'

/**
 * Effect constructor function (prototype-based class)
 * Executes a function and automatically tracks signal dependencies
 */
export const Effect = function(
    this: IEffect,
    fn: () => void | (() => void)
) {
    Object.defineProperty(this, 'fn', {
        value: fn,
        writable: false,
        configurable: false,
        enumerable: false
    })
    
    // Just assign dependencies as a regular property
    const internal = this as IEffectInternal
    internal.dependencies = new Set()
    
    // Store bound execute once to avoid creating new functions
    Object.defineProperty(this, 'boundExecute', {
        value: this.execute.bind(this),
        writable: false,
        configurable: false,
        enumerable: false
    })
} as unknown as { new (fn: () => void | (() => void)): IEffect }

// Attach prototype methods
Object.assign(Effect.prototype, {
    execute,
    addDependency,
    cleanup,
    dispose
})
