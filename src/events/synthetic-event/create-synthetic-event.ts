import { SyntheticEvent } from './synthetic-event'
import { ISyntheticEvent } from './synthetic-event.types'

/**
 * Factory function to create a synthetic event from a native event
 */
export function createSyntheticEvent<T extends EventTarget = EventTarget>(
    nativeEvent: Event
): ISyntheticEvent<T> {
    return new (SyntheticEvent as unknown as new (nativeEvent: Event) => ISyntheticEvent<T>)(nativeEvent)
}
