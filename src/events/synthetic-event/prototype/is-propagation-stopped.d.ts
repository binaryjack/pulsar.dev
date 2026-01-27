import { ISyntheticEvent } from '../synthetic-event.types';
/**
 * Returns whether stopPropagation was called
 */
export declare const isPropagationStopped: <T extends EventTarget>(this: ISyntheticEvent<T>) => boolean;
