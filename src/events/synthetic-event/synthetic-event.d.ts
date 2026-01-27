import { ISyntheticEvent } from './synthetic-event.types';
/**
 * SyntheticEvent constructor function (prototype-based class)
 * Provides a React-like normalized event interface over native DOM events
 */
export declare const SyntheticEvent: {
    new <T extends EventTarget>(nativeEvent: Event): ISyntheticEvent<T>;
};
