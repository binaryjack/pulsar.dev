import { IMemo } from '../memo.types';
/**
 * Notifies all subscribers that the memo has become dirty
 */
export declare const notify: <T>(this: IMemo<T>) => void;
