/**
 * Store.prototype.dispatch
 * Dispatch action to store
 */
import type { IStoreAction, IStoreInternal } from '../store.types';
export declare const dispatch: <T>(this: IStoreInternal<T>, action: IStoreAction) => void;
