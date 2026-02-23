import { $REGISTRY } from '../registry/core';

/**
 * Reads signals inside `fn` without creating reactive subscriptions.
 * Any signal accessed within `fn` will NOT cause the enclosing effect
 * to re-run when those signals change.
 *
 * @example
 * ```ts
 * createEffect(() => {
 *   const a = tracked();           // ← effect re-runs when `tracked` changes
 *   const b = untrack(() => other()); // ← read without subscribing
 *   console.log(a, b);
 * });
 * ```
 */
export function untrack<T>(fn: () => T): T {
  const prev = $REGISTRY._currentEffect;
  $REGISTRY._currentEffect = null;
  try {
    return fn();
  } finally {
    $REGISTRY._currentEffect = prev;
  }
}
