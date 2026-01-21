/**
 * @fileoverview Router hooks for lazy loading
 * @module @pulsar/router/lazy
 */

import { onCleanup, onMount } from '../../lifecycle/lifecycle-hooks';
import { useNavigate } from '../hooks';
import type { ILazyRoute } from './lazy-route.types';
import { prefetchRoute, prefetchRouteWithStrategy } from './route-prefetch';

/**
 * Hook for prefetching route on navigation
 *
 * @example
 * ```typescript
 * function NavigationLink({ to, label, route }) {
 *   const { navigateWithPrefetch } = usePrefetchRoute();
 *
 *   return (
 *     <button onClick={() => navigateWithPrefetch(to, route)}>
 *       {label}
 *     </button>
 *   );
 * }
 * ```
 */
export function usePrefetchRoute() {
  const navigate = useNavigate();

  /**
   * Navigate to route with prefetch
   */
  async function navigateWithPrefetch(path: string, route: ILazyRoute): Promise<void> {
    // Start prefetch
    await prefetchRoute(route);

    // Then navigate
    navigate(path);
  }

  /**
   * Navigate to route with optional prefetch
   */
  function navigateWithOptionalPrefetch(path: string, route?: ILazyRoute): void {
    if (route) {
      // Fire and forget prefetch, navigate immediately
      prefetchRoute(route).catch((err) => console.error('Prefetch error:', err));
    }
    navigate(path);
  }

  return {
    navigateWithPrefetch,
    navigateWithOptionalPrefetch,
    prefetch: prefetchRoute,
  };
}

/**
 * Hook for creating prefetch link
 *
 * @example
 * ```typescript
 * function NavLink({ route, strategy = 'hover' }) {
 *   const linkRef = usePrefetchLink(route, strategy);
 *
 *   return <a ref={linkRef} href={route.path}>Link</a>;
 * }
 * ```
 */
export function usePrefetchLink(
  route: ILazyRoute,
  strategy: 'hover' | 'visible' = 'hover'
): (element: HTMLElement | null) => void {
  let cleanup: (() => void) | null = null;

  function attachPrefetch(element: HTMLElement | null) {
    // Clean up previous
    if (cleanup) {
      cleanup();
      cleanup = null;
    }

    if (!element) return;

    // Attach prefetch strategy
    cleanup = prefetchRouteWithStrategy(route, element, strategy);
  }

  onCleanup(() => {
    if (cleanup) {
      cleanup();
    }
  });

  return attachPrefetch;
}

/**
 * Hook for prefetching routes on mount
 *
 * @example
 * ```typescript
 * function Dashboard() {
 *   // Prefetch settings and profile routes when dashboard loads
 *   usePrefetchOnMount([settingsRoute, profileRoute], 'idle');
 *
 *   return <div>Dashboard content</div>;
 * }
 * ```
 */
export function usePrefetchOnMount(
  routes: ILazyRoute[],
  strategy: 'eager' | 'idle' = 'idle'
): void {
  onMount(() => {
    if (strategy === 'eager') {
      // Prefetch immediately
      routes.forEach((route) => {
        prefetchRoute(route).catch((err) =>
          console.error(`Failed to prefetch ${route.path}:`, err)
        );
      });
    } else {
      // Prefetch when idle
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(() => {
          routes.forEach((route) => {
            prefetchRoute(route).catch((err) =>
              console.error(`Failed to prefetch ${route.path}:`, err)
            );
          });
        });
      } else {
        // Fallback: prefetch after short delay
        setTimeout(() => {
          routes.forEach((route) => {
            prefetchRoute(route).catch((err) =>
              console.error(`Failed to prefetch ${route.path}:`, err)
            );
          });
        }, 100);
      }
    }
  });
}
