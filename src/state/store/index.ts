/**
 * Store exports
 */

export { createStore } from './create-store';
export { dispatch } from './prototype/dispatch';
export { getState } from './prototype/get-state';
export { select } from './prototype/select';
export { subscribe } from './prototype/subscribe';
export { Store } from './store';

export type {
  IStore,
  IStoreAction,
  IStoreApi,
  IStoreDispatch,
  IStoreInternal,
  IStoreMiddleware,
  IStoreOptions,
  IStoreReducer,
  IStoreSubscriber,
  SStore,
} from './store.types';
