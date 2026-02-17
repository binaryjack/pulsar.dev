import { $REGISTRY } from '../../../registry/core';
import type { IEffectOwner } from '../../../registry/core/registry.types';
import type { ISignal } from '../../signal/signal.types';
import type { IMemoInternal } from '../../types';
import { IMemo } from '../memo.types';

/**
 * Reads the memoized value, recomputing if dirty
 * ENTERPRISE-GRADE FIX: Uses $REGISTRY for consistent dependency tracking
 */
export const read = function <T>(this: IMemo<T>): T {
  const internal = this as unknown as IMemoInternal<T>;

  // Recompute if dirty or never computed
  if (internal.isDirty || internal.cachedValue === undefined) {
    // Clean up previous subscriptions
    if (internal.memoEffect) {
      internal.memoEffect._subs.forEach((signal: ISignal<unknown>) => {
        signal.subscribers.delete(internal.memoEffect!.run);
      });
      internal.memoEffect._subs.clear();
    }
    internal.dependencies.clear();

    // Save current effect owner for nested tracking
    const outerEffect = $REGISTRY._currentEffect;

    // Create effect owner for this memo to track signal dependencies
    const memoEffect: IEffectOwner = {
      _subs: new Set<ISignal<unknown>>(),
      _children: new Set<IEffectOwner>(),
      run: () => {
        // Mark memo dirty when any dependency changes
        internal.isDirty = true;
      },
      cleanup: () => {
        memoEffect._subs.forEach((sig) => {
          sig.subscribers.delete(memoEffect.run);
        });
        memoEffect._subs.clear();
      },
      dispose: () => {
        memoEffect.cleanup();
      },
    };

    // Store effect for cleanup
    internal.memoEffect = memoEffect;

    // Set as current effect so signals auto-track
    $REGISTRY._currentEffect = memoEffect;

    try {
      // Compute value - signals will auto-track via their read() method
      internal.cachedValue = this.computeFn();
      internal.isDirty = false;

      // Store tracked dependencies
      memoEffect._subs.forEach((sig) => internal.dependencies.add(sig));
    } finally {
      // Restore previous effect owner
      $REGISTRY._currentEffect = outerEffect;
    }
  }

  // If reading memo within an effect, propagate dependencies to outer effect
  const currentEffect = $REGISTRY._currentEffect;
  if (currentEffect && currentEffect !== internal.memoEffect) {
    // Add memo's dependencies to the outer effect
    internal.dependencies.forEach((signal: ISignal<unknown>) => {
      currentEffect._subs.add(signal);
      signal.subscribers.add(currentEffect.run);
    });
  }

  return internal.cachedValue as T;
};
