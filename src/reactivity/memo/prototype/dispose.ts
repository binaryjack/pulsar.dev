import { IMemoInternal } from '../../types'
import { IMemo } from '../memo.types'

/**
 * Disposes the memo and clears cached value
 */
export const dispose = function<T>(this: IMemo<T>): void {
    const internal = this as unknown as IMemoInternal<T>
    internal.cachedValue = undefined
    internal.isDirty = true
}
