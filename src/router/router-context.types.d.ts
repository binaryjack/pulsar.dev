/**
 * Router Context Types
 * Type definitions for router context
 */
import type { IPathMatch } from './path-matcher';
import type { IQueryParams } from './query-parser';
import type { IRoute } from './route.interface';
/**
 * Location information
 */
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
/**
 * Navigation guard
 */
export interface INavigationGuard {
    /**
     * Guard callback
     * Return false to cancel navigation
     */
    guard: (to: string, from: string) => boolean | Promise<boolean>;
}
/**
 * Router context interface
 */
export interface IRouterContext {
    readonly currentPath: string;
    readonly currentParams: Record<string, string>;
    readonly currentQuery: IQueryParams | null;
    readonly currentRoute: IRoute | null;
    readonly currentMatch: IPathMatch | null;
    getLocation(): ILocation;
    navigate(path: string, options?: {
        replace?: boolean;
    }): Promise<void>;
    beforeEach(guard: (to: string, from: string) => boolean | Promise<boolean>): () => void;
    afterEach(guard: (to: string, from: string) => void): () => void;
    setParams(params: Record<string, string>): void;
    setQuery(query: IQueryParams | null): void;
    setRoute(route: IRoute | null): void;
    setMatch(match: IPathMatch | null): void;
    registerRoutes(routes: IRoute[]): void;
    getRoutes(): IRoute[];
}
/**
 * Signal tuple type for reactive state
 */
export type SignalTuple<T> = [get: () => T, set: (value: T) => void];
/**
 * Internal router context interface
 */
export interface IRouterContextInternal extends IRouterContext {
    currentPathSignal: SignalTuple<string>;
    currentParamsSignal: SignalTuple<Record<string, string>>;
    currentQuerySignal: SignalTuple<IQueryParams | null>;
    currentRouteSignal: SignalTuple<IRoute | null>;
    currentMatchSignal: SignalTuple<IPathMatch | null>;
    beforeGuards: INavigationGuard[];
    afterGuards: Array<(to: string, from: string) => void>;
    routes: IRoute[];
}
