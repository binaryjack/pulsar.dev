import { $REGISTRY } from '../../registry/core';
import type { IEffectOwner } from '../../registry/core/registry.types';
import type { ISignal } from '../signal/signal.types';

/**
 * Create an effect with nested ownership tracking
 * Effects automatically track signal dependencies and clean up child effects
 *
 * @param fn - The effect function to execute
 * @returns Disposer function to stop the effect
 */
export function createEffectWithOwner(fn: () => void | (() => void)): () => void {
  let cleanup: (() => void) | void;

  const effect: IEffectOwner = {
    _subs: new Set<ISignal<unknown>>(),
    _children: new Set<IEffectOwner>(),

    run() {
      // Clear previous subscriptions
      this.cleanup();

      // Run in this effect's scope so nested effects know their parent
      $REGISTRY.runInScope(this, () => {
        cleanup = fn();
      });
    },

    cleanup() {
      // Unsubscribe from all signals
      this._subs.forEach((sig) => {
        if (sig.unsubscribe) {
          sig.unsubscribe(this.run);
        }
      });
      this._subs.clear();

      // Dispose all child effects (recursive cleanup)
      this._children.forEach((child) => {
        child.dispose();
      });
      this._children.clear();

      // Run user cleanup function
      if (cleanup) {
        cleanup();
        cleanup = undefined;
      }
    },

    dispose() {
      this.cleanup();
    },
  };

  // Link to parent effect owner if exists
  const parentOwner = $REGISTRY.getCurrentOwner();
  if (parentOwner) {
    parentOwner._children.add(effect);
  }

  // Run effect initially
  effect.run();

  // Return disposer
  return () => effect.dispose();
}
