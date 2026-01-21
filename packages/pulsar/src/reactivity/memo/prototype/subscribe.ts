import { IMemo } from '../memo.types'

/**
 * Subscribes to memo changes
 */
export const subscribe = function<T>(
    this: IMemo<T>,
    subscriber: () => void
): () => void {
    this.subscribers.add(subscriber)
    
    // Return unsubscribe function
    return () => {
        this.subscribers.delete(subscriber)
    }
}
