/**
 * useEffect hook - React-like API for side effects
 * Automatically tracks signal dependencies - no manual dependency array needed
 * The deps parameter exists for API compatibility but is not used
 * (fine-grained reactivity automatically subscribes to signals read during execution)
 */
export declare function useEffect(fn: () => void | (() => void), _deps?: ReadonlyArray<unknown>): () => void;
