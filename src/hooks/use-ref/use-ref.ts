export interface IRef<T> {
    current: T
}

/**
 * useRef hook - React-like API for mutable references
 * Returns a mutable ref object
 */
export function useRef<T>(initialValue: T): IRef<T> {
    return { current: initialValue }
}
