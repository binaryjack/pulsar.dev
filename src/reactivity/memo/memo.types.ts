export const SMemo = Symbol.for('IMemo')

export interface IMemo<T> {
    // Constructor signature
    new (computeFn: () => T): IMemo<T>
    
    // Internal state
    readonly computeFn: () => T
    cachedValue?: T
    isDirty: boolean
    readonly subscribers: Set<() => void>
    
    // Methods (defined in prototype)
    read: () => T
    invalidate: () => void
    dispose: () => void
    subscribe: (subscriber: () => void) => () => void
    notify: () => void
}
