import { ISignal, ISignalOptions } from './signal.types';
/**
 * Signal constructor function (prototype-based class)
 * Reactive primitive for fine-grained reactivity
 */
export declare const Signal: {
    new <T>(initialValue: T, options?: ISignalOptions<T>): ISignal<T>;
};
