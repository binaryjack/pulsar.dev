import { IMemo } from '../memo.types';
/**
 * Reads the memoized value, recomputing if dirty
 */
export declare const read: <T>(this: IMemo<T>) => T;
