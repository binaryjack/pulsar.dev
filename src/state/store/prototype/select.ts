/**
 * Store.prototype.select
 * Create memoized selector
 */

import { createMemo } from '../../../reactivity/memo';
import { createSignal } from '../../../reactivity/signal';
import type { IStoreInternal } from '../store.types';

export const select = function <T, R>(this: IStoreInternal<T>, selector: (state: T) => R): () => R {
  const [state, setState] = createSignal(this.state);

  // Subscribe to store updates
  this.subscribe((newState) => {
    setState(newState);
  });

  // Return memoized selector
  return createMemo(() => selector(state()));
};
