import { ISyntheticEvent } from '../synthetic-event.types'

/**
 * Stops the event from propagating and prevents other listeners from being called
 */
export const stopImmediatePropagation = function<T extends EventTarget>(
    this: ISyntheticEvent<T>
): void {
    this.nativeEvent.stopImmediatePropagation()
}
