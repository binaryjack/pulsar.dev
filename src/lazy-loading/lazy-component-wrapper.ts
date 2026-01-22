/**
 * @fileoverview Lazy component wrapper with built-in loading state
 * @module @pulsar/lazy-loading
 */

import { Show } from '../control-flow/show';
import { onCleanup, onMount } from '../lifecycle/lifecycle-hooks';
import { createSignal } from '../reactivity/signal/create-signal';
import type { ILazyComponentProps } from './lazy-loading.types';

/**
 * Component wrapper that handles lazy loading with fallback
 *
 * @example
 * ```tsx
 * <LazyComponent
 *   loader={() => import('./Chart')}
 *   props={{ data: chartData }}
 *   fallback={<Spinner />}
 * />
 * ```
 */
export function LazyComponent(componentProps: ILazyComponentProps) {
  const [component, setComponent] = createSignal<any>(null);
  const [isLoading, setIsLoading] = createSignal(true);
  const [error, setError] = createSignal<Error | null>(null);

  let mounted = true;

  onMount(() => {
    mounted = true;
    loadComponent();
  });

  onCleanup(() => {
    mounted = false;
  });

  /**
   * Load the component
   */
  async function loadComponent() {
    try {
      setIsLoading(true);
      setError(null);

      const module = await componentProps.loader();

      // Only update if still mounted
      if (!mounted) return;

      // Handle ES modules with default export
      const loadedComponent = 'default' in module ? module.default : module;
      setComponent(() => loadedComponent);
      setIsLoading(false);
    } catch (err) {
      if (!mounted) return;

      setError(err as Error);
      setIsLoading(false);
    }
  }

  // Create error element manually
  function createErrorElement(errorMsg: string): HTMLElement {
    const div = document.createElement('div');
    div.textContent = `Error loading component: ${errorMsg}`;
    return div;
  }

  return Show({
    when: !isLoading(),
    fallback: componentProps.fallback || null,
    children: () =>
      Show({
        when: !error(),
        fallback: componentProps.errorBoundary
          ? componentProps.errorBoundary({ error: error() })
          : createErrorElement(error()?.message || 'Unknown error'),
        children: () => {
          const Component = component();
          return Component ? Component(componentProps.props || {}) : null;
        },
      }),
  });
}
