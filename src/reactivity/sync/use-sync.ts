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

import { createSignal } from '../signal';
import { enterReactiveContext, exitReactiveContext } from './reactive-helpers';
import type { SnapshotFunction, SubscribeFunction } from './use-sync.types';

/**
 * Create a Pulsar signal that syncs with an external reactive system
 *
 * @param subscribe - Function that subscribes to external changes
 * @param getSnapshot - Function that returns current external value
 * @returns Pulsar signal getter function
 */
export function useSync<T>(
  subscribe: SubscribeFunction,
  getSnapshot: SnapshotFunction<T>
): () => T {
  // Create a Pulsar signal to hold the external value
  const [value, setValue] = createSignal<T>(getSnapshot());

  // Subscribe to external changes
  // The subscribe function should call notify() when external state changes
  const cleanup = subscribe(() => {
    // Mark that we're in reactive context (for dev warnings)
    enterReactiveContext();
    try {
      // When external state changes, read the new value and update our signal
      const newValue = getSnapshot();
      setValue(newValue);
    } finally {
      exitReactiveContext();
    }
  });

  // Note: We don't call onCleanup here because Pulsar components don't have
  // automatic lifecycle management. The cleanup will be handled by the external
  // reactive system (e.g., formular.dev's createEffect cleanup) when the parent
  // component or effect is disposed.
  // If you need explicit cleanup, store the returned cleanup function and call it manually.

  return value;
}
