/**
 * createStore factory function
 * Public API for creating stores
 */
import type { IStore, IStoreMiddleware, IStoreOptions, IStoreReducer } from './store.types';
export declare function createStore<T>(initialState: T, reducer: IStoreReducer<T>, middleware?: IStoreMiddleware<T>[], options?: IStoreOptions): IStore<T>;
