/**
 * Router context
 * Provides access to router state via dependency injection
 */

import { createSignal } from '../reactivity/signal';
import type { IPathMatch } from './path-matcher';
import type { QueryParams } from './query-parser';
import type { IRoute } from './route.interface';

export interface ILocation {
  /**
   * Current pathname (without hash)
   */
  pathname: string;

  /**
   * Query string (with ?)
   */
  search: string;

  /**
   * Hash fragment (with #)
   */
  hash: string;

  /**
   * Full URL
   */
  href: string;
}

export interface INavigationGuard {
  /**
   * Guard callback
   * Return false to cancel navigation
   */
  guard: (to: string, from: string) => boolean | Promise<boolean>;
}

/**
 * Router context singleton
 * Manages global router state
 */
class RouterContext {
  private static instance: RouterContext;

  // Reactive state
  private currentPathSignal = createSignal<string>('/');
  private currentParamsSignal = createSignal<Record<string, string>>({});
  private currentQuerySignal = createSignal<QueryParams | null>(null);
  private currentRouteSignal = createSignal<IRoute | null>(null);
  private currentMatchSignal = createSignal<IPathMatch | null>(null);

  // Navigation guards
  private beforeGuards: INavigationGuard[] = [];
  private afterGuards: Array<(to: string, from: string) => void> = [];

  // All registered routes
  private routes: IRoute[] = [];

  private constructor() {
    // Listen for hash/popstate changes
    this.initializeListeners();
  }

  static getInstance(): RouterContext {
    if (!RouterContext.instance) {
      RouterContext.instance = new RouterContext();
    }
    return RouterContext.instance;
  }

  private initializeListeners() {
    const handleNavigation = () => {
      this.updateLocation();
    };

    window.addEventListener('hashchange', handleNavigation);
    window.addEventListener('popstate', handleNavigation);
  }

  private updateLocation() {
    const path = this.getCurrentPath();
    this.currentPathSignal[1](path);
  }

  private getCurrentPath(): string {
    // Support both hash and pathname routing
    if (window.location.hash) {
      return window.location.hash.slice(1) || '/';
    }
    return window.location.pathname;
  }

  /**
   * Get current path (reactive)
   */
  get currentPath() {
    return this.currentPathSignal[0]();
  }

  /**
   * Get current params (reactive)
   */
  get currentParams() {
    return this.currentParamsSignal[0]();
  }

  /**
   * Get current query (reactive)
   */
  get currentQuery() {
    return this.currentQuerySignal[0]();
  }

  /**
   * Get current route (reactive)
   */
  get currentRoute() {
    return this.currentRouteSignal[0]();
  }

  /**
   * Get current match (reactive)
   */
  get currentMatch() {
    return this.currentMatchSignal[0]();
  }

  /**
   * Get location info
   */
  getLocation(): ILocation {
    return {
      pathname: window.location.pathname,
      search: window.location.search,
      hash: window.location.hash,
      href: window.location.href,
    };
  }

  /**
   * Navigate to a path
   */
  async navigate(path: string, options?: { replace?: boolean }): Promise<void> {
    const from = this.getCurrentPath();

    // Run before guards
    for (const { guard } of this.beforeGuards) {
      const result = await guard(path, from);
      if (result === false) {
        return; // Cancel navigation
      }
    }

    // Perform navigation
    if (options?.replace) {
      window.location.replace(`#${path}`);
    } else {
      window.location.hash = path;
    }

    // Run after guards
    this.afterGuards.forEach((guard) => guard(path, from));
  }

  /**
   * Register before navigation guard
   */
  beforeEach(guard: (to: string, from: string) => boolean | Promise<boolean>): () => void {
    const guardObj = { guard };
    this.beforeGuards.push(guardObj);

    // Return unregister function
    return () => {
      const index = this.beforeGuards.indexOf(guardObj);
      if (index > -1) {
        this.beforeGuards.splice(index, 1);
      }
    };
  }

  /**
   * Register after navigation guard
   */
  afterEach(guard: (to: string, from: string) => void): () => void {
    this.afterGuards.push(guard);

    // Return unregister function
    return () => {
      const index = this.afterGuards.indexOf(guard);
      if (index > -1) {
        this.afterGuards.splice(index, 1);
      }
    };
  }

  /**
   * Set current params
   */
  setParams(params: Record<string, string>) {
    this.currentParamsSignal[1](params);
  }

  /**
   * Set current query
   */
  setQuery(query: QueryParams | null) {
    this.currentQuerySignal[1](query);
  }

  /**
   * Set current route
   */
  setRoute(route: IRoute | null) {
    this.currentRouteSignal[1](route);
  }

  /**
   * Set current match
   */
  setMatch(match: IPathMatch | null) {
    this.currentMatchSignal[1](match);
  }

  /**
   * Register routes
   */
  registerRoutes(routes: IRoute[]) {
    this.routes = routes;
  }

  /**
   * Get all routes
   */
  getRoutes(): IRoute[] {
    return this.routes;
  }
}

export const routerContext = RouterContext.getInstance();
