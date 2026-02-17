/**
 * Resource Constructor
 *
 * Creates a resource instance for async data fetching with automatic
 * state management, loading/error handling, and dependency tracking.
 */

import { createSignal } from '../reactivity/signal/create-signal';
import {
  IResourceInternal,
  IResourceOptions,
  ResourceFetcher,
  ResourceState,
} from './resource.types';

/**
 * Resource constructor function (prototype-based)
 */
export const Resource = function <T>(
  this: IResourceInternal<T>,
  fetcher: ResourceFetcher<T>,
  options: IResourceOptions = {}
) {
  // Store fetcher function
  Object.defineProperty(this, 'fetcher', {
    value: fetcher,
    writable: false,
    enumerable: false,
    configurable: false,
  });

  // Merge options with defaults
  Object.defineProperty(this, 'options', {
    value: {
      lazy: options.lazy ?? false,
      onSuccess: options.onSuccess ?? (() => {}),
      onError: options.onError ?? (() => {}),
      autoRefetch: options.autoRefetch ?? true,
      staleTime: options.staleTime ?? 0,
    },
    writable: false,
    enumerable: false,
    configurable: false,
  });

  // Initialize internal state using signals
  const [state, setState] = createSignal<ResourceState>('idle');
  const [data, setData] = createSignal<T | null>(null);
  const [error, setError] = createSignal<Error | null>(null);

  // _state / _setState
  Object.defineProperty(this, '_state', { value: state });
  Object.defineProperty(this, '_setState', { value: setState });

  // _data / _setData
  Object.defineProperty(this, '_data', { value: data });
  Object.defineProperty(this, '_setData', { value: setData });

  // _error / _setError
  Object.defineProperty(this, '_error', { value: error });
  Object.defineProperty(this, '_setError', { value: setError });

  Object.defineProperty(this, '_lastFetchTime', {
    value: 0,
    writable: true,
    enumerable: false,
    configurable: false,
  });

  Object.defineProperty(this, '_activePromise', {
    value: null,
    writable: true,
    enumerable: false,
    configurable: false,
  });

  Object.defineProperty(this, '_cleanup', {
    value: null,
    writable: true,
    enumerable: false,
    configurable: false,
  });

  // Define readonly getters for public interface
  Object.defineProperty(this, 'state', {
    get: function (this: IResourceInternal<T>) {
      return this._state();
    },
    enumerable: true,
    configurable: false,
  });

  Object.defineProperty(this, 'data', {
    get: function (this: IResourceInternal<T>) {
      return this._data();
    },
    enumerable: true,
    configurable: false,
  });

  Object.defineProperty(this, 'error', {
    get: function (this: IResourceInternal<T>) {
      return this._error();
    },
    enumerable: true,
    configurable: false,
  });

  Object.defineProperty(this, 'isLoading', {
    get: function (this: IResourceInternal<T>) {
      return this._state() === 'loading';
    },
    enumerable: true,
    configurable: false,
  });

  Object.defineProperty(this, 'isSuccess', {
    get: function (this: IResourceInternal<T>) {
      return this._state() === 'success';
    },
    enumerable: true,
    configurable: false,
  });

  Object.defineProperty(this, 'isError', {
    get: function (this: IResourceInternal<T>) {
      return this._state() === 'error';
    },
    enumerable: true,
    configurable: false,
  });

  Object.defineProperty(this, 'isStale', {
    get: function (this: IResourceInternal<T>) {
      if (this._state() !== 'success' || this.options.staleTime === 0) {
        return false;
      }
      const now = Date.now();
      return now - this._lastFetchTime > this.options.staleTime;
    },
    enumerable: true,
    configurable: false,
  });
} as unknown as {
  new <T>(fetcher: ResourceFetcher<T>, options?: IResourceOptions): IResourceInternal<T>;
};
