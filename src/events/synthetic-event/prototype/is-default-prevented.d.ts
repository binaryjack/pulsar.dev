import { ISyntheticEvent } from '../synthetic-event.types';
/**
 * Returns whether preventDefault was called
 */
export declare const isDefaultPrevented: <T extends EventTarget>(this: ISyntheticEvent<T>) => boolean;
