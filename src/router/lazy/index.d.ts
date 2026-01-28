/**
 * @fileoverview Router lazy loading utilities
 * @module @pulsar/router/lazy
 *
 * @example
 * ```typescript
 * import { lazyRoute, generateRouteManifest } from '@pulsar-framework/pulsar.dev/router';
 *
 * const routes = [
 *   lazyRoute({
 *     path: '/dashboard',
 *     component: () => import('./Dashboard'),
 *     preload: 'hover'
 *   })
 * ];
 *
 * const manifest = generateRouteManifest(routes);
 * ```
 */
export { usePrefetchLink, usePrefetchOnMount, usePrefetchRoute } from './hooks';
export { isLazyRoute, lazyRoute, makeLazyRoutes } from './lazy-route';
export type {
  ILazyRoute,
  IRouteLoaderCache,
  IRouteManifest,
  IRoutePrefetchOptions,
} from './lazy-route.types';
export {
  calculateTotalSize,
  exportManifest,
  generateRouteManifest,
  getPreloadRoutes,
  getRouteManifestByPath,
  getRoutePaths,
  importManifest,
} from './route-manifest';
export {
  SmartPrefetcher,
  clearRouteCache,
  clearRouteCacheEntry,
  createPrefetchLink,
  getCachedRoute,
  getRouteCacheSize,
  isRouteCached,
  prefetchRoute,
  prefetchRouteWithStrategy,
  prefetchRoutes,
  prefetchRoutesWithOptions,
} from './route-prefetch';
export {
  extractRoutes,
  findRouteByPath,
  getAllLazyRoutes,
  renderLazyRoute,
} from './router-integration';
