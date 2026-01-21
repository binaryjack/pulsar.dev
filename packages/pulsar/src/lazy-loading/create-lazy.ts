/**
 * @fileoverview Factory function for creating lazy components
 * @module @pulsar/lazy-loading
 */

import { createSignal } from '../reactivity/signal/create-signal';
import type { IComponentLoader, ILazyComponent, ILazyState } from './lazy-loading.types';

/**
 * Create a lazy-loaded component that loads on demand
 *
 * @example
 * ```tsx
 * const LazyChart = lazy(() => import('./Chart'));
 *
 * // Preload without rendering
 * LazyChart.preload();
 *
 * // Render with Waiting fallback
 * <Waiting default={<Spinner />}>
 *   <LazyChart data={chartData} />
 * </Waiting>
 * ```
 */
export function lazy<T extends object = any>(loader: IComponentLoader<T>): ILazyComponent<T> {
  // Create reactive state for loading status
  const [state, setState] = createSignal<ILazyState<T>>({
    status: 'idle',
    component: null,
    error: null,
    promise: null,
  });

  /**
   * Load the component
   */
  function load(): Promise<T> {
    const currentState = state();

    // Return existing promise if loading
    if (currentState.status === 'loading' && currentState.promise) {
      return currentState.promise;
    }

    // Return cached component if already loaded
    if (currentState.status === 'success' && currentState.component) {
      return Promise.resolve(currentState.component);
    }

    // Start loading
    const promise = loader()
      .then((module) => {
        // Handle ES modules with default export
        const component = 'default' in module ? module.default : module;

        setState({
          status: 'success',
          component,
          error: null,
          promise: null,
        });

        return component;
      })
      .catch((error: Error) => {
        setState({
          status: 'error',
          component: null,
          error,
          promise: null,
        });

        throw error;
      });

    setState({
      status: 'loading',
      component: null,
      error: null,
      promise,
    });

    return promise;
  }

  /**
   * Preload the component without rendering
   */
  function preload(): Promise<T> {
    return load();
  }

  // Return lazy component wrapper
  const lazyComponent: ILazyComponent<T> = {
    loader,
    preload,
    get state() {
      return state();
    },
    __lazy: true as const,
  };

  return lazyComponent;
}
