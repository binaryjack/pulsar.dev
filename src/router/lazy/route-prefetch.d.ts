/**
 * @fileoverview Route prefetching utilities
 * @module @pulsar/router/lazy
 */
import type { ILazyRoute, IRoutePrefetchOptions } from './lazy-route.types';
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
export declare function prefetchRoute(route: ILazyRoute): Promise<void>;
/**
 * Prefetch multiple routes
 */
export declare function prefetchRoutes(routes: ILazyRoute[]): Promise<void>;
/**
 * Prefetch route with strategy
 */
export declare function prefetchRouteWithStrategy(route: ILazyRoute, element: HTMLElement, strategy?: 'hover' | 'visible' | 'eager' | 'idle'): () => void;
/**
 * Get cached route component
 */
export declare function getCachedRoute(path: string): ((props: Record<string, unknown>) => HTMLElement) | null | undefined;
/**
 * Clear route loader cache
 */
export declare function clearRouteCache(): void;
/**
 * Clear specific route from cache
 */
export declare function clearRouteCacheEntry(path: string): void;
/**
 * Get cache size (number of cached routes)
 */
export declare function getRouteCacheSize(): number;
/**
 * Check if route is cached
 */
export declare function isRouteCached(path: string): boolean;
/**
 * Prefetch routes based on options
 */
export declare function prefetchRoutesWithOptions(routes: ILazyRoute[], options: IRoutePrefetchOptions): Promise<void>;
/**
 * Create prefetch link directive
 * Automatically prefetches route when link is hovered
 */
export declare function createPrefetchLink(element: HTMLElement, route: ILazyRoute, strategy?: 'hover' | 'visible'): () => void;
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
export declare const SmartPrefetcher: {
    new (): ISmartPrefetcherInternal;
};
