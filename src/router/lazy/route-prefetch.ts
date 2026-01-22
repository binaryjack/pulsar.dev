/**
 * @fileoverview Route prefetching utilities
 * @module @pulsar/router/lazy
 */

import {
  batchPreload,
  preloadEager,
  preloadOnHover,
  preloadOnIdle,
  preloadOnVisible,
} from '../../lazy-loading/preload-strategies';
import { isLazyRoute } from './lazy-route';
import type { ILazyRoute, IRoutePrefetchOptions } from './lazy-route.types';

/**
 * Global route loader cache
 */
const routeLoaderCache = new Map<string, any>();

/**
 * Prefetch route component
 *
 * @example
 * ```typescript
 * // Prefetch single route
 * await prefetchRoute(dashboardRoute);
 *
 * // Prefetch on navigation link hover
 * linkElement.addEventListener('mouseenter', () => {
 *   prefetchRoute(dashboardRoute);
 * });
 * ```
 */
export async function prefetchRoute(route: ILazyRoute): Promise<void> {
  if (!isLazyRoute(route)) {
    return;
  }

  // Check if already cached
  if (routeLoaderCache.has(route.path)) {
    return;
  }

  try {
    // Preload the component
    const component = await route.component.preload();
    routeLoaderCache.set(route.path, component);
  } catch (error) {
    console.error(`Failed to prefetch route ${route.path}:`, error);
  }
}

/**
 * Prefetch multiple routes
 */
export async function prefetchRoutes(routes: ILazyRoute[]): Promise<void> {
  const lazyRoutes = routes.filter(isLazyRoute);
  const components = lazyRoutes.map((route) => route.component);

  try {
    await batchPreload(components);

    // Cache loaded components
    lazyRoutes.forEach((route) => {
      if (route.component.state.status === 'success' && route.component.state.component) {
        routeLoaderCache.set(route.path, route.component.state.component);
      }
    });
  } catch (error) {
    console.error('Failed to prefetch routes:', error);
  }
}

/**
 * Prefetch route with strategy
 */
export function prefetchRouteWithStrategy(
  route: ILazyRoute,
  element: HTMLElement,
  strategy: 'hover' | 'visible' | 'eager' | 'idle' = 'hover'
): () => void {
  if (!isLazyRoute(route)) {
    return () => {};
  }

  switch (strategy) {
    case 'hover':
      return preloadOnHover(element, route.component);

    case 'visible':
      return preloadOnVisible(element, route.component);

    case 'eager':
      preloadEager(route.component);
      return () => {};

    case 'idle':
      return preloadOnIdle(route.component);

    default:
      return () => {};
  }
}

/**
 * Get cached route component
 */
export function getCachedRoute(
  path: string
): ((props: Record<string, unknown>) => HTMLElement) | null | undefined {
  const cached = routeLoaderCache.get(path);
  return cached?.component;
}

/**
 * Clear route loader cache
 */
export function clearRouteCache(): void {
  routeLoaderCache.clear();
}

/**
 * Clear specific route from cache
 */
export function clearRouteCacheEntry(path: string): void {
  routeLoaderCache.delete(path);
}

/**
 * Get cache size (number of cached routes)
 */
export function getRouteCacheSize(): number {
  return routeLoaderCache.size;
}

/**
 * Check if route is cached
 */
export function isRouteCached(path: string): boolean {
  return routeLoaderCache.has(path);
}

/**
 * Prefetch routes based on options
 */
export async function prefetchRoutesWithOptions(
  routes: ILazyRoute[],
  options: IRoutePrefetchOptions
): Promise<void> {
  // Filter routes to prefetch
  const routesToPrefetch = routes.filter(
    (route) => options.routes.includes(route.path) && isLazyRoute(route)
  );

  // Check connection speed if requested
  if (options.fastConnectionOnly && 'connection' in navigator) {
    const connection = (navigator as any).connection;
    if (
      connection &&
      (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g')
    ) {
      console.log('Skipping prefetch on slow connection');
      return;
    }
  }

  // Apply strategy
  if (options.strategy === 'eager') {
    await prefetchRoutes(routesToPrefetch);
  } else {
    // For other strategies, routes will be prefetched when appropriate events occur
    console.log(`Routes configured for ${options.strategy} prefetch:`, options.routes);
  }
}

/**
 * Create prefetch link directive
 * Automatically prefetches route when link is hovered
 */
export function createPrefetchLink(
  element: HTMLElement,
  route: ILazyRoute,
  strategy: 'hover' | 'visible' = 'hover'
): () => void {
  return prefetchRouteWithStrategy(route, element, strategy);
}

/**
 * Smart prefetcher interface
 */
export interface ISmartPrefetcher {
  recordNavigation(path: string): void;
  getLikelyRoutes(count?: number): string[];
  prefetchLikely(routes: ILazyRoute[], count?: number): Promise<void>;
  reset(): void;
}

/**
 * Internal smart prefetcher interface
 */
export interface ISmartPrefetcherInternal extends ISmartPrefetcher {
  navigationHistory: string[];
  routeScores: Map<string, number>;
}

/**
 * Smart prefetch based on navigation patterns
 * Analyzes user behavior and prefetches likely next routes
 */
export const SmartPrefetcher = function (this: ISmartPrefetcherInternal) {
  Object.defineProperty(this, 'navigationHistory', {
    value: [] as string[],
    writable: true,
    enumerable: false,
    configurable: false,
  });

  Object.defineProperty(this, 'routeScores', {
    value: new Map<string, number>(),
    writable: true,
    enumerable: false,
    configurable: false,
  });
} as unknown as { new (): ISmartPrefetcherInternal };

/**
 * Record navigation event
 */
SmartPrefetcher.prototype.recordNavigation = function (
  this: ISmartPrefetcherInternal,
  path: string
): void {
  this.navigationHistory.push(path);

  // Limit history size
  if (this.navigationHistory.length > 50) {
    this.navigationHistory.shift();
  }

  // Update scores based on patterns
  updateScores.call(this);
};

/**
 * Update route scores based on navigation patterns
 * @internal
 */
function updateScores(this: ISmartPrefetcherInternal): void {
  // Simple scoring: routes that often follow current route get higher scores
  const currentPath = this.navigationHistory[this.navigationHistory.length - 1];
  const nextPaths = getNextPaths.call(this, currentPath);

  nextPaths.forEach((path) => {
    const score = this.routeScores.get(path) || 0;
    this.routeScores.set(path, score + 1);
  });
}

/**
 * Get paths that typically follow a given path
 * @internal
 */
function getNextPaths(this: ISmartPrefetcherInternal, currentPath: string): string[] {
  const nextPaths: string[] = [];

  for (let i = 0; i < this.navigationHistory.length - 1; i++) {
    if (this.navigationHistory[i] === currentPath) {
      nextPaths.push(this.navigationHistory[i + 1]);
    }
  }

  return nextPaths;
}

/**
 * Get likely next routes to prefetch
 */
SmartPrefetcher.prototype.getLikelyRoutes = function (
  this: ISmartPrefetcherInternal,
  count: number = 3
): string[] {
  const sorted = Array.from(this.routeScores.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, count);

  return sorted.map(([path]) => path);
};

/**
 * Prefetch likely routes
 */
SmartPrefetcher.prototype.prefetchLikely = async function (
  this: ISmartPrefetcherInternal,
  routes: ILazyRoute[],
  count: number = 3
): Promise<void> {
  const likelyPaths = this.getLikelyRoutes(count);
  const routesToPrefetch = routes.filter((route) => likelyPaths.includes(route.path));

  await prefetchRoutes(routesToPrefetch);
};

/**
 * Reset scoring
 */
SmartPrefetcher.prototype.reset = function (this: ISmartPrefetcherInternal): void {
  this.navigationHistory = [];
  this.routeScores.clear();
};
