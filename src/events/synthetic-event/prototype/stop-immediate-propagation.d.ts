import { ISyntheticEvent } from '../synthetic-event.types';
/**
 * Stops the event from propagating and prevents other listeners from being called
 */
export declare const stopImmediatePropagation: <T extends EventTarget>(this: ISyntheticEvent<T>) => void;
