/**
 * @fileoverview Router integration with lazy loading
 * @module @pulsar/router/lazy
 */

import { LazyComponent } from '../../lazy-loading/lazy-component-wrapper';
import type { IRoute } from '../route.interface';
import { isLazyRoute } from './lazy-route';
import type { ILazyRoute } from './lazy-route.types';

/**
 * Render lazy route component
 *
 * Integrates lazy loading with router rendering pipeline
 */
export function renderLazyRoute(route: IRoute | ILazyRoute, props?: any): HTMLElement {
  if (!isLazyRoute(route)) {
    // Regular route - render component directly
    if (route.component) {
      return route.component();
    }
    if (route.element) {
      return route.element;
    }
    throw new Error(`Route ${route.path} has no component or element`);
  }

  // Lazy route - use LazyComponent wrapper
  const loader = route.component.loader;
  const fallback = route.fallback ? route.fallback() : createDefaultFallback();
  const errorBoundary = route.errorBoundary || createDefaultErrorBoundary;

  return LazyComponent({
    loader,
    props,
    fallback,
    errorBoundary,
  });
}

/**
 * Create default loading fallback
 */
function createDefaultFallback(): HTMLElement {
  const div = document.createElement('div');
  div.className = 'route-loading';
  div.textContent = 'Loading...';
  div.style.padding = '20px';
  div.style.textAlign = 'center';
  div.style.color = '#666';
  return div;
}

/**
 * Create default error boundary
 */
function createDefaultErrorBoundary(error: Error): HTMLElement {
  const div = document.createElement('div');
  div.className = 'route-error';
  div.style.padding = '20px';
  div.style.border = '1px solid #f44336';
  div.style.borderRadius = '4px';
  div.style.backgroundColor = '#ffebee';
  div.style.color = '#c62828';

  const title = document.createElement('h3');
  title.textContent = 'Failed to load route';
  title.style.margin = '0 0 10px 0';

  const message = document.createElement('p');
  message.textContent = error.message;
  message.style.margin = '0';

  div.appendChild(title);
  div.appendChild(message);

  return div;
}

/**
 * Extract routes from route tree
 */
export function extractRoutes(routes: IRoute[], parentPath: string = ''): IRoute[] {
  const extracted: IRoute[] = [];

  for (const route of routes) {
    const fullPath = parentPath + route.path;
    extracted.push({ ...route, path: fullPath });

    if (Array.isArray(route.children)) {
      const childRoutes = extractRoutes(route.children, fullPath);
      extracted.push(...childRoutes);
    }
  }

  return extracted;
}

/**
 * Find route by path
 */
export function findRouteByPath(routes: IRoute[], path: string): IRoute | undefined {
  const allRoutes = extractRoutes(routes);
  return allRoutes.find((route) => route.path === path);
}

/**
 * Get all lazy routes from route tree
 */
export function getAllLazyRoutes(routes: IRoute[]): ILazyRoute[] {
  const allRoutes = extractRoutes(routes);
  const lazyRoutes: ILazyRoute[] = [];

  for (const route of allRoutes) {
    if (isLazyRoute(route)) {
      lazyRoutes.push(route as unknown as ILazyRoute);
    }
  }

  return lazyRoutes;
}
