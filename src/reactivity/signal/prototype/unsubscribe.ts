import { ISignal, ISignalSubscriber } from '../signal.types'

/**
 * Unsubscribes a callback from signal changes
 */
export const unsubscribe = function<T>(
    this: ISignal<T>,
    subscriber: ISignalSubscriber
): void {
    this.subscribers.delete(subscriber)
}
