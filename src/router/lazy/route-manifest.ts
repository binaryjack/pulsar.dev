/**
 * @fileoverview Route manifest generator for build optimization
 * @module @pulsar/router/lazy
 */

import type { IRoute } from '../route.interface';
import { isLazyRoute } from './lazy-route';
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
export function generateRouteManifest(
  routes: (IRoute | ILazyRoute)[],
  parentPath: string = ''
): IRouteManifest[] {
  const manifest: IRouteManifest[] = [];

  for (const route of routes) {
    const fullPath = parentPath + route.path;

    // If route is lazy, add to manifest
    if (isLazyRoute(route)) {
      const chunkName = extractChunkName(route);

      manifest.push({
        path: fullPath,
        chunkName,
        preload: route.preload !== 'none',
        preloadStrategy: route.preload || 'none',
        dependencies: [],
      });
    }

    // Process child routes recursively
    if (Array.isArray(route.children)) {
      const childManifest = generateRouteManifest(route.children, fullPath);
      manifest.push(...childManifest);
    }
  }

  return manifest;
}

/**
 * Extract chunk name from lazy route
 */
function extractChunkName(route: ILazyRoute): string {
  // Try to extract chunk name from component loader
  const loaderString = route.component.loader.toString();

  // Look for webpack magic comment: /* webpackChunkName: "name" */
  const webpackMatch = loaderString.match(/webpackChunkName:\s*["']([^"']+)["']/);
  if (webpackMatch) {
    return webpackMatch[1];
  }

  // Look for import path: import('./path/Component')
  const importMatch = loaderString.match(/import\s*\(\s*["']([^"']+)["']/);
  if (importMatch) {
    const importPath = importMatch[1];
    // Extract filename without extension
    const filename = importPath
      .split('/')
      .pop()
      ?.replace(/\.\w+$/, '');
    return filename || 'unknown';
  }

  // Fallback: use path as chunk name
  return route.path.replace(/[^a-zA-Z0-9]/g, '_');
}

/**
 * Get all route paths from manifest
 */
export function getRoutePaths(manifest: IRouteManifest[]): string[] {
  return manifest.map((entry) => entry.path);
}

/**
 * Get routes that should be preloaded
 */
export function getPreloadRoutes(manifest: IRouteManifest[]): IRouteManifest[] {
  return manifest.filter((entry) => entry.preload);
}

/**
 * Get route manifest entry by path
 */
export function getRouteManifestByPath(
  manifest: IRouteManifest[],
  path: string
): IRouteManifest | undefined {
  return manifest.find((entry) => entry.path === path);
}

/**
 * Calculate total estimated size of all chunks
 */
export function calculateTotalSize(manifest: IRouteManifest[]): number {
  return manifest.reduce((total, entry) => {
    return total + (entry.estimatedSize || 0);
  }, 0);
}

/**
 * Export manifest as JSON for build tools
 */
export function exportManifest(manifest: IRouteManifest[]): string {
  return JSON.stringify(manifest, null, 2);
}

/**
 * Import manifest from JSON
 */
export function importManifest(json: string): IRouteManifest[] {
  return JSON.parse(json);
}
