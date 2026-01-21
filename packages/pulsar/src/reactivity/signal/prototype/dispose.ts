import { ISignal } from '../signal.types'

/**
 * Disposes the signal and clears all subscribers
 */
export const dispose = function<T>(this: ISignal<T>): void {
    this.subscribers.clear()
}
