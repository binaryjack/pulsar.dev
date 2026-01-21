import { SignalDependency } from '../../types'
import { IEffect } from '../effect.types'

/**
 * Adds a signal as a dependency of this effect
 */
export const addDependency = function(
    this: IEffect,
    signal: SignalDependency
): void {
    this.dependencies.add(signal)
}
