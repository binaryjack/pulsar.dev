import { IMemoInternal } from '../../types'
import { IMemo } from '../memo.types'

/**
 * Marks the memo as dirty, forcing recomputation on next read
 */
export const invalidate = function<T>(this: IMemo<T>): void {
    const internal = this as unknown as IMemoInternal<T>
    internal.isDirty = true
}
