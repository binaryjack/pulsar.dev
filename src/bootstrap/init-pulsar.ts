import { resetSignalIdCounter } from '../reactivity/signal/signal';
import { $WATCHER } from '../registry/node-watcher';

/**
 * Initialize Pulsar Framework
 * Call this once at application startup to initialize the registry and watcher
 *
 * @param isSSR - Whether we're hydrating from SSR
 * @param initialState - SSR state to boot signals with
 */
export function initPulsar(isSSR = false, initialState?: Record<string, unknown>): void {
  // Reset signal counter for consistent IDs
  resetSignalIdCounter();

  // Initialize the NodeWatcher for automatic cleanup
  if (typeof document !== 'undefined') {
    $WATCHER.init();
  }

  // Boot SSR state if provided
  if (isSSR && initialState) {
    const { $REGISTRY } = require('../registry/core');
    $REGISTRY.boot(initialState);
  }
}

/**
 * Dispose Pulsar Framework
 * Call this to clean up the framework (mainly for testing)
 */
export function disposePulsar(): void {
  $WATCHER.dispose();
}
