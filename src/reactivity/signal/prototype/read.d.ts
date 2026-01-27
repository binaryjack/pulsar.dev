import { ISignal } from '../signal.types';
/**
 * Reads the signal value and tracks the dependency if called within an effect
 */
export declare const read: <T>(this: ISignal<T>) => T;
