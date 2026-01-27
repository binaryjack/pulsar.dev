import { ISyntheticEvent } from '../synthetic-event.types';
/**
 * Stops the event from propagating to parent elements
 */
export declare const stopPropagation: <T extends EventTarget>(this: ISyntheticEvent<T>) => void;
