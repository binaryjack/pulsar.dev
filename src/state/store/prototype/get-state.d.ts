/**
 * Store.prototype.getState
 * Get current state
 */
import type { IStoreInternal } from '../store.types';
export declare const getState: <T>(this: IStoreInternal<T>) => T;
