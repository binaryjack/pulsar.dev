import { scheduleBatchedEffect } from '../../batch'
import { ISignalInternal } from '../../types'
import { ISignal } from '../signal.types'

/**
 * Writes a new value to the signal and notifies all subscribers
 * If batching, schedules effects for later; otherwise runs immediately
 */
export const write = function<T>(
    this: ISignal<T>,
    nextValue: T | ((prev: T) => T)
): void {
    const internal = this as ISignalInternal<T>
    const newValue = typeof nextValue === 'function'
        ? (nextValue as (prev: T) => T)(internal._value)
        : nextValue
    
    // Check equality if custom comparator provided
    if (this.options?.equals) {
        if (this.options.equals(internal._value, newValue)) {
            return // No change, skip notification
        }
    } else if (Object.is(internal._value, newValue)) {
        return // Default equality check
    }
    
    // Update value
    internal._value = newValue
    
    // Notify all subscribers (batched if in batch context)
    this.subscribers.forEach(subscriber => {
        scheduleBatchedEffect(subscriber)
    })
}
