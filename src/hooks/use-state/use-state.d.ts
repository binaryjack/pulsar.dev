/**
 * useState hook - React-like API for reactive state
 * Returns a tuple of [getter, setter]
 */
export declare function useState<T>(initialValue: T): [get: () => T, set: (value: T | ((prev: T) => T)) => void];
