import { IMemo } from './memo.types';
/**
 * Memo constructor function (prototype-based class)
 * Memoized computed value that only recomputes when dependencies change
 */
export declare const Memo: {
    new <T>(computeFn: () => T): IMemo<T>;
};
