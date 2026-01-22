/**
 * Store constructor
 * Redux-style state container with signal-based reactivity
 */

import type {
  IStoreInternal,
  IStoreMiddleware,
  IStoreOptions,
  IStoreReducer,
  SStore,
} from './store.types';

export const Store = function <T>(
  this: IStoreInternal<T>,
  initialState: T,
  reducer: IStoreReducer<T>,
  middleware?: IStoreMiddleware<T>[],
  options?: IStoreOptions
) {
  // State
  Object.defineProperty(this, 'state', {
    value: initialState,
    writable: true,
    enumerable: false,
    configurable: false,
  });

  // Reducer
  Object.defineProperty(this, 'reducer', {
    value: reducer,
    writable: false,
    enumerable: false,
    configurable: false,
  });

  // Middleware
  if (middleware && middleware.length > 0) {
    Object.defineProperty(this, 'middleware', {
      value: middleware,
      writable: false,
      enumerable: false,
      configurable: false,
    });
  }

  // Subscribers
  Object.defineProperty(this, 'subscribers', {
    value: new Set(),
    writable: false,
    enumerable: false,
    configurable: false,
  });

  // DevTools integration
  if (
    options?.devtools &&
    typeof window !== 'undefined' &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION__
  ) {
    const devtools = (window as any).__REDUX_DEVTOOLS_EXTENSION__.connect({
      name: options.name || 'Pulsar Store',
      trace: options.trace,
      traceLimit: options.traceLimit || 25,
    });

    devtools.init(initialState);

    Object.defineProperty(this, 'devtools', {
      value: devtools,
      writable: false,
      enumerable: false,
      configurable: false,
    });
  }
} as unknown as SStore<any>;
