import { getCurrentEffect, popEffect, pushEffect } from '../../effect/effect-context'
import { IEffectInternal } from '../../effect/effect.types'
import { IMemoInternal, SignalDependency } from '../../types'
import { IMemo } from '../memo.types'

/**
 * Reads the memoized value, recomputing if dirty
 */
export const read = function<T>(this: IMemo<T>): T {
    if (this.isDirty || this.cachedValue === undefined) {
        const internal = this as unknown as IMemoInternal<T>
        
        // Unsubscribe from old signal dependencies
        if (internal.signalUnsubscribes) {
            internal.signalUnsubscribes.forEach((unsub: () => void) => unsub())
            internal.signalUnsubscribes = []
        }
        internal.dependencies.clear()
        
        // Save current effect context
        const outerEffect = getCurrentEffect()
        
        // Create a pseudo-effect to track dependencies for the memo itself
        const memoEffect = {
            execute: () => {},
            boundExecute: () => {},
            addDependency: (signal: SignalDependency) => {
                internal.dependencies.add(signal)
                // Subscribe to mark memo as dirty
                const unsub = signal.subscribe(() => {
                    internal.isDirty = true
                })
                if (!internal.signalUnsubscribes) {
                    internal.signalUnsubscribes = []
                }
                internal.signalUnsubscribes.push(unsub)
                
                // Also add to outer effect so it tracks the signal directly
                if (outerEffect) {
                    outerEffect.addDependency(signal)
                    const outerEffectInternal = outerEffect as IEffectInternal
                    if (!('subscribers' in signal) || !signal.subscribers.has(outerEffectInternal.boundExecute)) {
                        signal.subscribe(outerEffectInternal.boundExecute)
                    }
                }
            }
        }
        
        pushEffect(memoEffect as any)
        
        try {
            internal.cachedValue = this.computeFn()
            internal.isDirty = false
        } finally {
            popEffect()
        }
    } else if (getCurrentEffect()) {
        // Memo is not dirty, but we still need to track dependencies for the current effect
        const outerEffect = getCurrentEffect()
        if (outerEffect) {
            const internal = this as unknown as IMemoInternal<T>
            const outerEffectInternal = outerEffect as IEffectInternal
            internal.dependencies.forEach((signal: SignalDependency) => {
                outerEffect.addDependency(signal)
                if (!('subscribers' in signal) || !signal.subscribers.has(outerEffectInternal.boundExecute)) {
                    signal.subscribe(outerEffectInternal.boundExecute)
                }
            })
        }
    }
    
    return this.cachedValue as T
}
