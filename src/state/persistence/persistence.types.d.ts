/**
 * Persistence type definitions
 */
import type { IStoreMiddleware } from '../store/store.types';
export interface IPersistOptions<T extends Record<string, unknown>> {
    key: string;
    storage?: Storage;
    serialize?: (state: T) => string;
    deserialize?: (data: string) => T;
    debounce?: number;
    whitelist?: Array<keyof T>;
    blacklist?: Array<keyof T>;
    version?: number;
    migrate?: (state: Record<string, unknown>, version: number) => T;
    merge?: (persisted: T, initial: T) => T;
}
export type PersistMiddleware<T extends Record<string, unknown>> = IStoreMiddleware<T>;
