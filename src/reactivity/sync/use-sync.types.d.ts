/**
 * Type definitions for useSync external store integration
 */
/**
 * Subscribe function that sets up a listener for external state changes
 * @param onStoreChange - Callback to invoke when the external store changes
 * @returns Cleanup function to unsubscribe
 */
export type SubscribeFunction = (onStoreChange: () => void) => (() => void) | void;
/**
 * Snapshot function that returns the current value from the external store
 * @returns The current value
 */
export type SnapshotFunction<T> = () => T;
