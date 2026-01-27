/**
 * createPersistentStore factory
 * Convenience function for store with persistence
 */
import type { IStore, IStoreReducer } from '../store/store.types';
import type { IPersistOptions } from './persistence.types';
export declare function createPersistentStore<T extends Record<string, any>>(options: {
    initialState: T;
    name?: string;
    persist: IPersistOptions<T>;
}, reducer: IStoreReducer<T>): IStore<T>;
