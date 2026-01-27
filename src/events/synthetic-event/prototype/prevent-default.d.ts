import { ISyntheticEvent } from '../synthetic-event.types';
/**
 * Prevents the default action of the event
 */
export declare const preventDefault: <T extends EventTarget>(this: ISyntheticEvent<T>) => void;
