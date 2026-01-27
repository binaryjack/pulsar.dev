/**
 * createSessionStore factory
 * Convenience function for store with sessionStorage
 */
import type { IStore, IStoreReducer } from '../store/store.types';
import type { IPersistOptions } from './persistence.types';
export declare function createSessionStore<T extends Record<string, any>>(options: {
    initialState: T;
    name?: string;
    persist: Omit<IPersistOptions<T>, 'storage'>;
}, reducer: IStoreReducer<T>): IStore<T>;
