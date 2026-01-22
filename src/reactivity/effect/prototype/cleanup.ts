import { IEffect, IEffectInternal } from '../effect.types'

/**
 * Runs the cleanup function if it exists
 */
export const cleanup = function(this: IEffect): void {
    const internal = this as IEffectInternal
    const cleanupFn = internal.cleanupFn
    if (cleanupFn !== undefined && cleanupFn !== null) {
        if (typeof cleanupFn === 'function') {
            cleanupFn()
        }
        internal.cleanupFn = undefined
    }
}
