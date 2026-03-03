import { $REGISTRY } from '../../../registry/core';
import type { IEffectOwner } from '../../../registry/core/registry.types';
import type { ISignal } from '../../signal/signal.types';
import type { IMemoInternal } from '../../types';
import { IMemo } from '../memo.types';

/**
 * Reads the memoized value, recomputing if dirty.
 *
 * REACTIVE BARRIER FIX: memos now act as proper reactive barriers.
 * Previously, when an outer effect called memo.read(), the memo's RAW signal
 * dependencies were propagated to the outer effect. This caused every insert-effect
 * (e.g. the shapes list renderer) to fire on every store dispatch — including unrelated
 * ones like BOARD/SET_HOVERED — because all raw deps traced back to the store's state
 * signal which fires on every dispatch.
 *
 * Fix: outer effects subscribe to THIS MEMO via `outerSubscribers`, not to the raw signals.
 * The memoEffect.run handler marks dirty AND notifies outer subscribers.
 * Outer effects therefore only fire when the memo's dependencies change — which is when
 * memo.read() will produce a new value. Dom change-detection in wire.ts / insert.ts then
 * decides whether a real DOM mutation is needed.
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
        // Notify effects that subscribed to THIS MEMO (not to raw deps).
        // This fires outer effects only when the memo's deps actually changed,
        // rather than every time a raw dep fires.
        internal.outerSubscribers?.forEach((sub) => sub());
      },
      cleanup: () => {
        memoEffect._subs.forEach((sig) => {
          sig.subscribers.delete(memoEffect.run);
        });
        memoEffect._subs.clear();
        internal.outerSubscribers?.clear();
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

  // If reading memo within an outer effect, subscribe that effect to THIS MEMO
  // (via outerSubscribers) — NOT to the memo's raw signal dependencies.
  // This makes the memo a reactive barrier: outer effects fire when the memo's
  // deps change, not on every raw signal notification (even unrelated ones).
  const currentEffect = $REGISTRY._currentEffect;
  if (currentEffect && currentEffect !== internal.memoEffect) {
    if (!internal.outerSubscribers) {
      internal.outerSubscribers = new Set<() => void>();
    }
    internal.outerSubscribers.add(currentEffect.run);
  }

  return internal.cachedValue as T;
};
