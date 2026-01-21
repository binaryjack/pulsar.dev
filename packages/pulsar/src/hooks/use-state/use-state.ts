import { createSignal } from '../../reactivity/signal'

/**
 * useState hook - React-like API for reactive state
 * Returns a tuple of [getter, setter]
 */
export function useState<T>(
    initialValue: T
): [get: () => T, set: (value: T | ((prev: T) => T)) => void] {
    return createSignal<T>(initialValue)
}
