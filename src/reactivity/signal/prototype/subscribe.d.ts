import { ISignal, ISignalSubscriber } from '../signal.types';
/**
 * Subscribes a callback to signal changes
 * Returns unsubscribe function
 */
export declare const subscribe: <T>(this: ISignal<T>, subscriber: ISignalSubscriber) => () => void;
