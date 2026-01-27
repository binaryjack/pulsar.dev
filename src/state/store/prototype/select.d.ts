/**
 * Store.prototype.select
 * Create memoized selector
 */
import type { IStoreInternal } from '../store.types';
export declare const select: <T, R>(this: IStoreInternal<T>, selector: (state: T) => R) => () => R;
