/**
 * @fileoverview Lazy route component wrapper
 * @module @pulsar/router/lazy
 */
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
export declare function lazyRoute(config: {
    path: string;
    component: IComponentLoader<any>;
    preload?: 'hover' | 'visible' | 'eager' | 'idle' | 'none';
    fallback?: () => HTMLElement;
    errorBoundary?: (error: Error) => HTMLElement;
    label?: string;
    default?: boolean;
    children?: HTMLElement | IRoute[];
}): ILazyRoute;
/**
 * Convert regular routes to lazy routes
 */
export declare function makeLazyRoutes(routes: IRoute[]): ILazyRoute[];
/**
 * Check if a route is lazy
 */
export declare function isLazyRoute(route: IRoute | ILazyRoute): route is ILazyRoute;
