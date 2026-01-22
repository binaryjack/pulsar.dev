/**
 * @fileoverview Lazy route component wrapper
 * @module @pulsar/router/lazy
 */

import { lazy } from '../../lazy-loading/create-lazy';
import type { IComponentLoader } from '../../lazy-loading/lazy-loading.types';
import type { IRoute } from '../route.interface';
import type { ILazyRoute } from './lazy-route.types';

/**
 * Create a lazy route with automatic code splitting
 *
 * @example
 * ```typescript
 * const routes = [
 *   lazyRoute({
 *     path: '/dashboard',
 *     component: () => import('./pages/Dashboard'),
 *     preload: 'hover',
 *     fallback: () => <DashboardSkeleton />
 *   })
 * ];
 * ```
 */
export function lazyRoute(config: {
  path: string;
  component: IComponentLoader<any>;
  preload?: 'hover' | 'visible' | 'eager' | 'idle' | 'none';
  fallback?: () => HTMLElement;
  errorBoundary?: (error: Error) => HTMLElement;
  label?: string;
  default?: boolean;
  children?: HTMLElement | IRoute[];
}): ILazyRoute {
  // Create lazy component from loader
  const lazyComponent = lazy(config.component);

  return {
    path: config.path,
    component: lazyComponent,
    preload: config.preload || 'none',
    fallback: config.fallback,
    errorBoundary: config.errorBoundary,
    label: config.label,
    default: config.default,
    children: config.children,
  };
}

/**
 * Convert regular routes to lazy routes
 */
export function makeLazyRoutes(routes: IRoute[]): ILazyRoute[] {
  return routes.map((route) => {
    // If route already has component as lazy, return as-is
    if (route.component && typeof route.component === 'object' && '__lazy' in route.component) {
      return route as unknown as ILazyRoute;
    }

    // If route has component function, wrap it in lazy
    if (route.component) {
      const lazyComponent = lazy(() => Promise.resolve({ default: route.component! }));

      return {
        ...route,
        component: lazyComponent,
        preload: 'none' as const,
      };
    }

    // If route has children routes, recursively convert them
    if (Array.isArray(route.children)) {
      return {
        path: route.path,
        label: route.label,
        default: route.default,
        children: makeLazyRoutes(route.children),
      } as unknown as ILazyRoute;
    }

    return route as unknown as ILazyRoute;
  });
}

/**
 * Check if a route is lazy
 */
export function isLazyRoute(route: IRoute | ILazyRoute): route is ILazyRoute {
  return !!(route.component && typeof route.component === 'object' && '__lazy' in route.component);
}
