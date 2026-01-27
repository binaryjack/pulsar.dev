import { ISignalOptions } from './signal.types';
/**
 * Factory function to create a signal with getter/setter tuple (React-like API)
 */
export declare function createSignal<T>(initialValue: T, options?: ISignalOptions<T>): [get: () => T, set: (value: T | ((prev: T) => T)) => void];
