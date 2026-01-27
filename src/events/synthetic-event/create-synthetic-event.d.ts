import { ISyntheticEvent } from './synthetic-event.types';
/**
 * Factory function to create a synthetic event from a native event
 */
export declare function createSyntheticEvent<T extends EventTarget = EventTarget>(nativeEvent: Event): ISyntheticEvent<T>;
