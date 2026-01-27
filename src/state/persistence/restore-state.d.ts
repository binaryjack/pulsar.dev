/**
 * restoreState helper
 * Restore state from storage
 */
import type { IPersistOptions } from './persistence.types';
export declare function restoreState<T extends Record<string, any>>(options: IPersistOptions<T> & {
    initialState: T;
}): T;
