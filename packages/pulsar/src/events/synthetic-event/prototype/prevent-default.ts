import { ISyntheticEvent } from '../synthetic-event.types'

/**
 * Prevents the default action of the event
 */
export const preventDefault = function<T extends EventTarget>(
    this: ISyntheticEvent<T>
): void {
    if (this.cancelable) {
        this.nativeEvent.preventDefault()
    }
}
