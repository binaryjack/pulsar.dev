import { SignalDependency } from '../types'

export const SEffect = Symbol.for('IEffect')

export interface IEffect {
    // Constructor signature
    new (fn: () => void | (() => void)): IEffect
    
    // Internal state
    readonly fn: () => void | (() => void)
    readonly dependencies: Set<SignalDependency>
    readonly boundExecute: () => void
    cleanupFn?: (() => void) | undefined
    
    // Methods (defined in prototype)
    execute: () => void
    addDependency: (signal: SignalDependency) => void
    cleanup: () => void
    dispose: () => void
}

/**
 * Internal interface for writable effect properties
 */
export interface IEffectInternal extends IEffect {
    dependencies: Set<SignalDependency>
    cleanupFn?: (() => void) | undefined
}
