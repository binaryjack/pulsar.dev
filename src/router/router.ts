/**
 * Router component
 * HTML5 History API client-side routing with declarative Route children
 * Now with path parameters, query strings, and navigation guards
 */

import { findMatchingRoute } from './path-matcher';
import { QueryParams } from './query-parser';
import type { IRoute } from './route.interface';
import { routerContext } from './router-context';

interface IRouterProps {
  children: HTMLElement | HTMLElement[];
  fallback?: () => HTMLElement;
}

/**
 * Router component - manages HTML5 History API routing
 * Expects Route components as children
 */
export const Router = ({ children, fallback }: IRouterProps): HTMLElement => {
  const container = document.createElement('div');
  container.className = 'router';
  container.setAttribute('data-router', 'active');

  // Extract route configurations from children
  const routes: IRoute[] = [];

  // Handle children - could be HTMLElement, array, or undefined
  let childArray: HTMLElement[] = [];
  if (children) {
    if (Array.isArray(children)) {
      childArray = children.filter((c) => c && typeof c === 'object') as HTMLElement[];
    } else if (typeof children === 'object') {
      childArray = [children as HTMLElement];
    }
  }

  console.log('[Router] Children received:', childArray.length, childArray);

  childArray.forEach((child) => {
    if ((child as any).__routeConfig) {
      routes.push((child as any).__routeConfig);
    }
  });

  // Register routes with context
  routerContext.registerRoutes(routes);

  // Content container for active route
  const outlet = document.createElement('div');
  outlet.className = 'router-outlet';
  container.appendChild(outlet);

  // Function to get current pathname, stripping the app base prefix.
  const getCurrentPath = (): string => {
    const raw = window.location.pathname || '/';
    try {
      const base: string = (import.meta as { env?: { BASE_URL?: string } }).env?.BASE_URL ?? '/';
      const normalizedBase = base === '/' ? '' : base.replace(/\/$/, '');
      return normalizedBase && raw.startsWith(normalizedBase)
        ? raw.slice(normalizedBase.length) || '/'
        : raw;
    } catch {
      return raw;
    }
  };

  // Function to get query string
  const getCurrentQuery = (): string => {
    return window.location.search;
  };

  // Function to render current route
  const renderCurrentRoute = () => {
    const currentPath = getCurrentPath();
    const queryString = getCurrentQuery();

    // Parse query parameters
    const query = new QueryParams(queryString);
    routerContext.setQuery(query);

    // Find matching route with path parameters
    const matchResult = findMatchingRoute(currentPath, routes);

    let matchedRoute: IRoute | undefined;
    let params: Record<string, string> = {};

    if (matchResult) {
      matchedRoute = matchResult.route;
      params = matchResult.match.params;
      routerContext.setParams(params);
      routerContext.setMatch(matchResult.match);
      routerContext.setRoute(matchedRoute);
    } else {
      // Try default route
      matchedRoute = routes.find((route) => route.default);
      routerContext.setParams({});
      routerContext.setMatch(null);
      routerContext.setRoute(matchedRoute || null);
    }

    // Clear outlet
    outlet.innerHTML = '';

    if (matchedRoute) {
      // Render the matched route
      let content: HTMLElement | null = null;

      if (matchedRoute.component) {
        content = matchedRoute.component();
      } else if (matchedRoute.element) {
        content = matchedRoute.element;
      } else if (
        matchedRoute.children &&
        typeof matchedRoute.children === 'object' &&
        'nodeType' in matchedRoute.children
      ) {
        content = matchedRoute.children as HTMLElement;
      }

      if (content) {
        outlet.appendChild(content);
      }
    } else if (fallback) {
      // Render fallback if no route matched
      outlet.appendChild(fallback());
    } else {
      // Show 404 message
      outlet.innerHTML =
        '<div style="padding: 20px; text-align: center;"><h2>404 - Page Not Found</h2></div>';
    }
  };

  // Initial render
  renderCurrentRoute();

  // Listen for popstate (back/forward navigation)
  window.addEventListener('popstate', renderCurrentRoute);

  // Cleanup on removal (if lifecycle is integrated)
  (container as any).__cleanup = () => {
    window.removeEventListener('popstate', renderCurrentRoute);
  };

  return container;
};
