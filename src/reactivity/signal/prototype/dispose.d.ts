import { ISignal } from '../signal.types';
/**
 * Disposes the signal and clears all subscribers
 */
export declare const dispose: <T>(this: ISignal<T>) => void;
