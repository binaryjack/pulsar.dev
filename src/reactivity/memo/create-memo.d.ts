/**
 * Factory function to create a memoized computed value
 * Returns a function that reads the current value
 */
export declare function createMemo<T>(computeFn: () => T): () => T;
