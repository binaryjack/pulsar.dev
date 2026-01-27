import { ISignal } from '../signal.types';
/**
 * Writes a new value to the signal and notifies all subscribers
 * If batching, schedules effects for later; otherwise runs immediately
 */
export declare const write: <T>(this: ISignal<T>, nextValue: T | ((prev: T) => T)) => void;
