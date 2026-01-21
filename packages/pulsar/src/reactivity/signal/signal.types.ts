// Signal types and interface definition
export const SSignal = Symbol.for('ISignal')

export interface ISignalSubscriber {
    (): void
}

export interface ISignalOptions<T> {
    equals?: (prev: T, next: T) => boolean
}

export interface ISignal<T> {
    // Constructor signature
    new (initialValue: T, options?: ISignalOptions<T>): ISignal<T>
    
    // Internal state
    readonly _value: T
    readonly subscribers: Set<ISignalSubscriber>
    readonly options?: ISignalOptions<T>
    
    // Methods (defined in prototype)
    read: () => T
    write: (nextValue: T | ((prev: T) => T)) => void
    subscribe: (subscriber: ISignalSubscriber) => () => void
    unsubscribe: (subscriber: ISignalSubscriber) => void
    dispose: () => void
}
