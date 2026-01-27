import { BatchFn } from './batch.types';
/**
 * Execute a function within a batch context
 * All signal writes during execution are batched
 * Effects only run once after the function completes
 *
 * @example
 * ```typescript
 * batch(() => {
 *   setCount(1)
 *   setName('Bob')
 *   setAge(30)
 * })
 * // Only triggers effects once, not three times
 * ```
 */
export declare function batch(fn: BatchFn): void;
/**
 * Check if currently in a batch context
 */
export declare function isBatching(): boolean;
/**
 * Schedule an effect to run after current batch
 * If not batching, runs immediately
 */
export declare function scheduleBatchedEffect(effect: () => void): void;
