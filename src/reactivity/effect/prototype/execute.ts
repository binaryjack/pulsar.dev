import { SignalDependency } from '../../types'
import { popEffect, pushEffect } from '../effect-context'
import { IEffect, IEffectInternal } from '../effect.types'

/**
 * Executes the effect function and tracks dependencies
 */
export const execute = function(this: IEffect): void {
    // Cleanup previous execution
    this.cleanup()
    
    // Create new dependencies set
    const deps = new Set<SignalDependency>()
    const internal = this as IEffectInternal
    internal.dependencies = deps
    
    // Set this effect as current for dependency tracking
    pushEffect(this)
    
    try {
        const result = this.fn()
        
        // Store cleanup function if returned
        if (typeof result === 'function') {
            internal.cleanupFn = result as () => void
        } else {
            internal.cleanupFn = undefined
        }
    } finally {
        // Restore previous effect
        popEffect()
    }
}
