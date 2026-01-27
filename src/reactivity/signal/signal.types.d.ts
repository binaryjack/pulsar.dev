export declare const SSignal: unique symbol;
export interface ISignalSubscriber {
    (): void;
}
export interface ISignalOptions<T> {
    equals?: (prev: T, next: T) => boolean;
}
export interface ISignal<T> {
    new (initialValue: T, options?: ISignalOptions<T>): ISignal<T>;
    readonly _value: T;
    readonly subscribers: Set<ISignalSubscriber>;
    readonly options?: ISignalOptions<T>;
    read: () => T;
    write: (nextValue: T | ((prev: T) => T)) => void;
    subscribe: (subscriber: ISignalSubscriber) => () => void;
    unsubscribe: (subscriber: ISignalSubscriber) => void;
    dispose: () => void;
}
