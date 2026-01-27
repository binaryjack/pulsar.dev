import { IMemo } from '../memo.types';
/**
 * Marks the memo as dirty, forcing recomputation on next read
 */
export declare const invalidate: <T>(this: IMemo<T>) => void;
