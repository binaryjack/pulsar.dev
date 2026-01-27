/**
 * @fileoverview Route manifest generator for build optimization
 * @module @pulsar/router/lazy
 */
import type { IRoute } from '../route.interface';
import type { ILazyRoute, IRouteManifest } from './lazy-route.types';
/**
 * Generate route manifest for build optimization
 *
 * @example
 * ```typescript
 * const routes = [
 *   lazyRoute({ path: '/dashboard', component: () => import('./Dashboard') }),
 *   lazyRoute({ path: '/settings', component: () => import('./Settings') })
 * ];
 *
 * const manifest = generateRouteManifest(routes);
 * console.log(manifest);
 * // [
 * //   { path: '/dashboard', chunkName: 'Dashboard', preload: false },
 * //   { path: '/settings', chunkName: 'Settings', preload: false }
 * // ]
 * ```
 */
export declare function generateRouteManifest(routes: (IRoute | ILazyRoute)[], parentPath?: string): IRouteManifest[];
/**
 * Get all route paths from manifest
 */
export declare function getRoutePaths(manifest: IRouteManifest[]): string[];
/**
 * Get routes that should be preloaded
 */
export declare function getPreloadRoutes(manifest: IRouteManifest[]): IRouteManifest[];
/**
 * Get route manifest entry by path
 */
export declare function getRouteManifestByPath(manifest: IRouteManifest[], path: string): IRouteManifest | undefined;
/**
 * Calculate total estimated size of all chunks
 */
export declare function calculateTotalSize(manifest: IRouteManifest[]): number;
/**
 * Export manifest as JSON for build tools
 */
export declare function exportManifest(manifest: IRouteManifest[]): string;
/**
 * Import manifest from JSON
 */
export declare function importManifest(json: string): IRouteManifest[];
