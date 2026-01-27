export interface IRef<T> {
    current: T;
}
/**
 * useRef hook - React-like API for mutable references
 * Returns a mutable ref object
 */
export declare function useRef<T>(initialValue: T): IRef<T>;
