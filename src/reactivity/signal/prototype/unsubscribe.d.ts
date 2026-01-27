import { ISignal, ISignalSubscriber } from '../signal.types';
/**
 * Unsubscribes a callback from signal changes
 */
export declare const unsubscribe: <T>(this: ISignal<T>, subscriber: ISignalSubscriber) => void;
