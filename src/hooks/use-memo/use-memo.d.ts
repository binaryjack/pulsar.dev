/**
 * useMemo hook - React-like API for memoized computed values
 * Automatically tracks signal dependencies - no manual dependency array needed
 * The deps parameter exists for API compatibility but is not used
 * (fine-grained reactivity automatically subscribes to signals read during computation)
 * Returns a function that returns the memoized value
 */
export declare function useMemo<T>(computeFn: () => T, _deps?: ReadonlyArray<unknown>): () => T;
