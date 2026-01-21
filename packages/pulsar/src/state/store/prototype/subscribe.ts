/**
 * Store.prototype.subscribe
 * Subscribe to state changes
 */

import type { IStoreInternal, IStoreSubscriber } from '../store.types';

export const subscribe = function <T>(
  this: IStoreInternal<T>,
  listener: IStoreSubscriber<T>
): () => void {
  this.subscribers.add(listener);

  // Return unsubscribe function
  return () => {
    this.subscribers.delete(listener);
  };
};
