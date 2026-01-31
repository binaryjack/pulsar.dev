import { $REGISTRY } from '../../registry/core';
import type { IEffectOwner } from '../../registry/core/registry.types';
import type { ISignal } from '../signal/signal.types';

/**
 * Factory function to create and run an effect
 * NOW USES REGISTRY PATTERN - integrates with $REGISTRY._currentEffect
 * Returns a dispose function
 */
export function createEffect(fn: () => void | (() => void)): () => void {
  let cleanup: (() => void) | void;
  let isFirstRun = true;

  // Define cleanup function that can be called from run
  const cleanupFn = () => {
    // Unsubscribe from all signals
    effect._subs.forEach((sig) => {
      if (sig.unsubscribe) {
        sig.unsubscribe(runFn);
      }
    });
    effect._subs.clear();

    // Dispose all child effects
    effect._children.forEach((child) => {
      child.dispose();
    });
    effect._children.clear();

    // Run user cleanup
    if (cleanup) {
      cleanup();
      cleanup = undefined;
    }
  };

  // Define run function that can be passed to signal.subscribe
  const runFn = () => {
    // Clear previous subscriptions (except on first run)
    if (!isFirstRun) {
      cleanupFn();
    }
    isFirstRun = false;

    // Set as current effect for dependency tracking
    const previousEffect = $REGISTRY._currentEffect;
    $REGISTRY._currentEffect = effect;

    try {
      cleanup = fn();
    } finally {
      $REGISTRY._currentEffect = previousEffect;
    }
  };

  const effect: IEffectOwner = {
    _subs: new Set<ISignal<unknown>>(),
    _children: new Set<IEffectOwner>(),
    run: runFn,
    cleanup: cleanupFn,
    dispose() {
      cleanupFn();
    },
  };

  // Link to parent if exists
  const parentOwner = $REGISTRY.getCurrentOwner();
  if (parentOwner) {
    parentOwner._children.add(effect);
  }

  // Run initially
  runFn();

  return () => effect.dispose();
}
