import { ISignal, ISignalSubscriber } from '../signal.types'

/**
 * Subscribes a callback to signal changes
 * Returns unsubscribe function
 */
export const subscribe = function<T>(
    this: ISignal<T>,
    subscriber: ISignalSubscriber
): () => void {
    this.subscribers.add(subscriber)
    
    // Return unsubscribe function
    return () => {
        this.unsubscribe(subscriber)
    }
}
