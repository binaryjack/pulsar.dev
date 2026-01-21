import { ISyntheticEvent } from '../synthetic-event.types'

/**
 * Stops the event from propagating to parent elements
 */
export const stopPropagation = function<T extends EventTarget>(
    this: ISyntheticEvent<T>
): void {
    this.nativeEvent.stopPropagation()
}
