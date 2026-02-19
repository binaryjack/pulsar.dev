/**
 * Router context
 * Provides access to router state via dependency injection
 */

import { createSignal } from '../reactivity/signal';
import type { IPathMatch } from './path-matcher';
import type { IQueryParams } from './query-parser';
import type { IRoute } from './route.interface';
import type {
  ILocation,
  INavigationGuard,
  IRouterContext,
  IRouterContextInternal,
} from './router-context.types';

export type { ILocation, INavigationGuard } from './router-context.types';

/**
 * Returns the app base path (without trailing slash) by reading document.baseURI.
 * Vite injects <base href="/pulsar-ui.dev/"> into the HTML when base is configured.
 * Works from pre-built dist because it reads the DOM at call-time, not at build time.
 * e.g. document.baseURI = 'http://localhost:3000/pulsar-ui.dev/' → '/pulsar-ui.dev'
 *      document.baseURI = 'http://localhost:3000/'               → ''
 */
function getRouterBase(): string {
  try {
    const pathname = new URL(document.baseURI).pathname;
    return pathname === '/' ? '' : pathname.replace(/\/$/, '');
  } catch {
    return '';
  }
}

/**
 * Router context constructor
 * Manages global router state
 */
export const RouterContext = function (this: IRouterContextInternal) {
  // Reactive state signals
  Object.defineProperty(this, 'currentPathSignal', {
    value: createSignal<string>('/'),
    writable: false,
    enumerable: false,
    configurable: false,
  });

  Object.defineProperty(this, 'currentParamsSignal', {
    value: createSignal<Record<string, string>>({}),
    writable: false,
    enumerable: false,
    configurable: false,
  });

  Object.defineProperty(this, 'currentQuerySignal', {
    value: createSignal<IQueryParams | null>(null),
    writable: false,
    enumerable: false,
    configurable: false,
  });

  Object.defineProperty(this, 'currentRouteSignal', {
    value: createSignal<IRoute | null>(null),
    writable: false,
    enumerable: false,
    configurable: false,
  });

  Object.defineProperty(this, 'currentMatchSignal', {
    value: createSignal<IPathMatch | null>(null),
    writable: false,
    enumerable: false,
    configurable: false,
  });

  // Navigation guards
  Object.defineProperty(this, 'beforeGuards', {
    value: [] as INavigationGuard[],
    writable: true,
    enumerable: false,
    configurable: false,
  });

  Object.defineProperty(this, 'afterGuards', {
    value: [] as Array<(to: string, from: string) => void>,
    writable: true,
    enumerable: false,
    configurable: false,
  });

  // All registered routes
  Object.defineProperty(this, 'routes', {
    value: [] as IRoute[],
    writable: true,
    enumerable: false,
    configurable: false,
  });

  // Initialize event listeners
  initializeListeners.call(this);
  // Sync the path signal with the actual current URL on first load
  // (default signal value '/' would be wrong on hard refresh to a sub-route)
  updateLocation.call(this);
} as unknown as { new (): IRouterContextInternal };

/**
 * Initialize navigation event listeners
 * @internal
 */
function initializeListeners(this: IRouterContextInternal): void {
  const handleNavigation = () => {
    updateLocation.call(this);
  };

  window.addEventListener('popstate', handleNavigation);
}

/**
 * Update location from URL
 * @internal
 */
function updateLocation(this: IRouterContextInternal): void {
  const path = getCurrentPath.call(this);
  this.currentPathSignal[1](path);
}

/**
 * Get current path from URL, stripping the app base prefix.
 * e.g. pathname '/pulsar-ui.dev/di' with base '/pulsar-ui.dev' → '/di'
 * @internal
 */
function getCurrentPath(this: IRouterContextInternal): string {
  const raw = window.location.pathname || '/';
  const base = getRouterBase();
  return base && raw.startsWith(base) ? raw.slice(base.length) || '/' : raw;
}

// Reactive property getters
Object.defineProperty(RouterContext.prototype, 'currentPath', {
  get(this: IRouterContextInternal): string {
    return this.currentPathSignal[0]();
  },
  enumerable: true,
  configurable: false,
});

Object.defineProperty(RouterContext.prototype, 'currentParams', {
  get(this: IRouterContextInternal): Record<string, string> {
    return this.currentParamsSignal[0]();
  },
  enumerable: true,
  configurable: false,
});

Object.defineProperty(RouterContext.prototype, 'currentQuery', {
  get(this: IRouterContextInternal): IQueryParams | null {
    return this.currentQuerySignal[0]();
  },
  enumerable: true,
  configurable: false,
});

Object.defineProperty(RouterContext.prototype, 'currentRoute', {
  get(this: IRouterContextInternal): IRoute | null {
    return this.currentRouteSignal[0]();
  },
  enumerable: true,
  configurable: false,
});

Object.defineProperty(RouterContext.prototype, 'currentMatch', {
  get(this: IRouterContextInternal): IPathMatch | null {
    return this.currentMatchSignal[0]();
  },
  enumerable: true,
  configurable: false,
});

/**
 * Get location information
 * Returns an object with reactive getters for pathname
 */
RouterContext.prototype.getLocation = function (this: IRouterContextInternal): ILocation {
  const context = this;
  return {
    get pathname(): string {
      return context.currentPathSignal[0]();
    },
    get search(): string {
      return window.location.search;
    },
    get hash(): string {
      return window.location.hash;
    },
    get href(): string {
      return window.location.href;
    },
  };
};

/**
 * Navigate to a path
 */
RouterContext.prototype.navigate = async function (
  this: IRouterContextInternal,
  path: string,
  options?: { replace?: boolean }
): Promise<void> {
  const from = getCurrentPath.call(this);

  // Run before guards
  for (const { guard } of this.beforeGuards) {
    const result = await guard(path, from);
    if (result === false) {
      return; // Cancel navigation
    }
  }

  // Perform navigation using HTML5 History API
  // Prepend app base so URLs stay under the configured base path.
  const fullPath = getRouterBase() + path;
  if (options?.replace) {
    window.history.replaceState({}, '', fullPath);
  } else {
    window.history.pushState({}, '', fullPath);
  }

  // Manually trigger location update since pushState doesn't fire popstate
  updateLocation.call(this);

  // Trigger a custom event for router to re-render
  window.dispatchEvent(new PopStateEvent('popstate'));

  // Run after guards
  this.afterGuards.forEach((guard) => guard(path, from));
};

/**
 * Register before navigation guard
 */
RouterContext.prototype.beforeEach = function (
  this: IRouterContextInternal,
  guard: (to: string, from: string) => boolean | Promise<boolean>
): () => void {
  const guardObj: INavigationGuard = { guard };
  this.beforeGuards.push(guardObj);

  // Return unregister function
  return () => {
    const index = this.beforeGuards.indexOf(guardObj);
    if (index > -1) {
      this.beforeGuards.splice(index, 1);
    }
  };
};

/**
 * Register after navigation guard
 */
RouterContext.prototype.afterEach = function (
  this: IRouterContextInternal,
  guard: (to: string, from: string) => void
): () => void {
  this.afterGuards.push(guard);

  // Return unregister function
  return () => {
    const index = this.afterGuards.indexOf(guard);
    if (index > -1) {
      this.afterGuards.splice(index, 1);
    }
  };
};

/**
 * Set current params
 */
RouterContext.prototype.setParams = function (
  this: IRouterContextInternal,
  params: Record<string, string>
): void {
  this.currentParamsSignal[1](params);
};

/**
 * Set current query
 */
RouterContext.prototype.setQuery = function (
  this: IRouterContextInternal,
  query: IQueryParams | null
): void {
  this.currentQuerySignal[1](query);
};

/**
 * Set current route
 */
RouterContext.prototype.setRoute = function (
  this: IRouterContextInternal,
  route: IRoute | null
): void {
  this.currentRouteSignal[1](route);
};

/**
 * Set current match
 */
RouterContext.prototype.setMatch = function (
  this: IRouterContextInternal,
  match: IPathMatch | null
): void {
  this.currentMatchSignal[1](match);
};

/**
 * Register routes
 */
RouterContext.prototype.registerRoutes = function (
  this: IRouterContextInternal,
  routes: IRoute[]
): void {
  this.routes = routes;
};

/**
 * Get all routes
 */
RouterContext.prototype.getRoutes = function (this: IRouterContextInternal): IRoute[] {
  return this.routes;
};

// Singleton instance
let routerContextInstance: IRouterContext | null = null;

/**
 * Get router context singleton instance
 */
export function getRouterContext(): IRouterContext {
  if (!routerContextInstance) {
    routerContextInstance = new RouterContext() as unknown as IRouterContext;
  }
  return routerContextInstance;
}

/**
 * Export singleton instance for backward compatibility
 */
export const routerContext = getRouterContext();
