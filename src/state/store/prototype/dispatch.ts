/**
 * Store.prototype.dispatch
 * Dispatch action to store
 */

import type { IStoreAction, IStoreInternal } from '../store.types';

export const dispatch = function <T>(this: IStoreInternal<T>, action: IStoreAction): void {
  const prevState = this.state;

  // Apply middleware chain
  let finalDispatch = (act: IStoreAction) => {
    this.state = this.reducer(this.state, act);

    // Notify DevTools
    if (this.devtools) {
      this.devtools.send(act, this.state);
    }
  };

  if (this.middleware && this.middleware.length > 0) {
    const api = {
      getState: () => this.state,
      dispatch: (act: IStoreAction) => this.dispatch(act),
    };

    const chain = this.middleware.map((mw) => mw(api));
    finalDispatch = chain.reduceRight((next, mw) => mw(next), finalDispatch);
  }

  finalDispatch(action);

  // Notify subscribers if state changed
  if (this.state !== prevState) {
    this.subscribers.forEach((subscriber) => subscriber(this.state));
  }
};
