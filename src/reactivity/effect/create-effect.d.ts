/**
 * Factory function to create and run an effect
 * Returns a dispose function
 */
export declare function createEffect(fn: () => void | (() => void)): () => void;
