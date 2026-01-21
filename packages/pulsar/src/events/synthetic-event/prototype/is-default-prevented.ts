import { ISyntheticEvent } from '../synthetic-event.types'

/**
 * Returns whether preventDefault was called
 */
export const isDefaultPrevented = function<T extends EventTarget>(
    this: ISyntheticEvent<T>
): boolean {
    // Check the native event's defaultPrevented, not the cached value
    return this.nativeEvent.defaultPrevented
}
