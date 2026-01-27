/**
 * useSync - Bridge for external reactive systems
 * Similar to React's useSyncExternalStore
 *
 * This primitive allows Pulsar to subscribe to and react to changes
 * in external state management systems (like formular.dev, Redux, MobX, etc.)
 *
 * @example
 * ```typescript
 * // Syncing with formular.dev signals
 * const validationResults = useSync(
 *   (notify) => {
 *     return formularCreateEffect(() => {
 *       input._validationResults.get(); // Track dependency
 *       notify(); // Notify Pulsar of change
 *     });
 *   },
 *   () => input._validationResults.get()
 * );
 *
 * // Now use as normal Pulsar signal
 * return <div>{validationResults().map(...)}</div>
 * ```
 */
import type { SnapshotFunction, SubscribeFunction } from './use-sync.types';
/**
 * Create a Pulsar signal that syncs with an external reactive system
 *
 * @param subscribe - Function that subscribes to external changes
 * @param getSnapshot - Function that returns current external value
 * @returns Pulsar signal getter function
 */
export declare function useSync<T>(subscribe: SubscribeFunction, getSnapshot: SnapshotFunction<T>): () => T;
