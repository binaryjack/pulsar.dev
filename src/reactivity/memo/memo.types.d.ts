export declare const SMemo: unique symbol;
export interface IMemo<T> {
    new (computeFn: () => T): IMemo<T>;
    readonly computeFn: () => T;
    cachedValue?: T;
    isDirty: boolean;
    readonly subscribers: Set<() => void>;
    read: () => T;
    invalidate: () => void;
    dispose: () => void;
    subscribe: (subscriber: () => void) => () => void;
    notify: () => void;
}
