import { Signal } from './signal'
import { ISignal, ISignalOptions } from './signal.types'

/**
 * Factory function to create a signal with getter/setter tuple (React-like API)
 */
export function createSignal<T>(
    initialValue: T,
    options?: ISignalOptions<T>
): [get: () => T, set: (value: T | ((prev: T) => T)) => void] {
    const signal = new (Signal as unknown as new (initialValue: T, options?: ISignalOptions<T>) => ISignal<T>)(initialValue, options)
    
    const get = (): T => signal.read()
    const set = (value: T | ((prev: T) => T)): void => signal.write(value)
    
    return [get, set]
}
