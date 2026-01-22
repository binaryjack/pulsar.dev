import { getCurrentEffect } from '../../effect/effect-context'
import { IEffectInternal } from '../../effect/effect.types'
import { ISignal } from '../signal.types'

/**
 * Reads the signal value and tracks the dependency if called within an effect
 */
export const read = function<T>(this: ISignal<T>): T {
    // Auto-track in running effect
    const currentEffect = getCurrentEffect()
    
    if (currentEffect) {
        // Use pre-bound execute to avoid creating new functions
        const internal = currentEffect as IEffectInternal
        this.subscribers.add(internal.boundExecute)
        currentEffect.addDependency(this)
    }
    
    return this._value
}
