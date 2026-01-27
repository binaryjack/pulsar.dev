/**
 * Store.prototype.subscribe
 * Subscribe to state changes
 */
import type { IStoreInternal, IStoreSubscriber } from '../store.types';
export declare const subscribe: <T>(this: IStoreInternal<T>, listener: IStoreSubscriber<T>) => () => void;
