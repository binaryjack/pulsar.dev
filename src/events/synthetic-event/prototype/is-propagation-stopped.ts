import { ISyntheticEvent } from '../synthetic-event.types'

/**
 * Returns whether stopPropagation was called
 */
export const isPropagationStopped = function<T extends EventTarget>(
    this: ISyntheticEvent<T>
): boolean {
    return this.nativeEvent.cancelBubble
}
