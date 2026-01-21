/**
 * createStore factory function
 * Public API for creating stores
 */

import { dispatch } from './prototype/dispatch';
import { getState } from './prototype/get-state';
import { select } from './prototype/select';
import { subscribe } from './prototype/subscribe';
import { Store } from './store';
import type {
  IStore,
  IStoreInternal,
  IStoreMiddleware,
  IStoreOptions,
  IStoreReducer,
} from './store.types';

// Attach prototype methods
Object.assign(Store.prototype, {
  getState,
  dispatch,
  subscribe,
  select,
});

export function createStore<T>(
  initialState: T,
  reducer: IStoreReducer<T>,
  middleware?: IStoreMiddleware<T>[],
  options?: IStoreOptions
): IStore<T> {
  const store = new Store(
    initialState,
    reducer,
    middleware,
    options
  ) as unknown as IStoreInternal<T>;

  // Make callable (returns current state)
  const callable = () => store.getState();
  Object.setPrototypeOf(callable, Store.prototype);

  // Copy all properties including non-enumerable ones
  const propNames = Object.getOwnPropertyNames(store);
  for (const prop of propNames) {
    const descriptor = Object.getOwnPropertyDescriptor(store, prop);
    if (descriptor) {
      Object.defineProperty(callable, prop, descriptor);
    }
  }

  return callable as unknown as IStore<T>;
}
