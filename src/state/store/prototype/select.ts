/**
 * Store.prototype.select
 * Create a selector that only fires subscribers when the selected slice ACTUALLY changes.
 *
 * Previous implementation subscribed a `state` signal to every dispatch and wrapped it
 * in a memo. The memo propagated raw deps to outer insert-effects, making the shapes
 * list re-render on every `BOARD/SET_HOVERED` dispatch → DOM cleared → mouseenter fired
 * → infinite loop.
 *
 * Fix: store the SELECTOR RESULT in a signal (not the whole state). `write.ts` already
 * has an `Object.is` equality guard, so `setResult(selector(newState))` is a no-op when
 * the selected slice didn't change. No memo, no dep leak, no spurious re-renders.
 */

import { createSignal } from '../../../reactivity/signal';
import type { IStoreInternal } from '../store.types';

export const select = function <T, R>(this: IStoreInternal<T>, selector: (state: T) => R): () => R {
  // Initialise signal with the SELECTOR's current output — not the raw state.
  const [result, setResult] = createSignal<R>(selector(this.state));

  // On every dispatch, run the cheap selector and only propagate if the value changed.
  // write.ts Object.is guard means `setResult` is a no-op when value is unchanged.
  this.subscribe((newState) => {
    setResult(selector(newState));
  });

  // `result` is already a `() => R` getter — return it directly (no memo wrapper needed).
  return result;
};
