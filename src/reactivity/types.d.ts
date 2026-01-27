import { IMemo } from "./memo/memo.types";
import { ISignal } from "./signal/signal.types";
/**
 * Base interface for any reactive dependency (Signal or Memo)
 */
export interface IReactiveDependency {
    subscribe: (subscriber: () => void) => () => void;
}
/**
 * Internal interface for writable signal properties
 * Provides type-safe access to internal mutable properties
 */
export interface ISignalInternal<T> extends ISignal<T> {
    _value: T;
}
/**
 * Internal interface for writable memo properties
 * Provides type-safe access to internal mutable properties
 */
export interface IMemoInternal<T> extends IMemo<T> {
    cachedValue?: T;
    isDirty: boolean;
    dependencies: Set<SignalDependency>;
    signalUnsubscribes?: Array<() => void>;
}
/**
 * Type-safe signal dependency
 */
export type SignalDependency = ISignal<unknown> | IReactiveDependency;
