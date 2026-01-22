import { IMemo } from '../memo.types'

/**
 * Notifies all subscribers that the memo has become dirty
 */
export const notify = function<T>(this: IMemo<T>): void {
    this.subscribers.forEach(subscriber => subscriber())
}
