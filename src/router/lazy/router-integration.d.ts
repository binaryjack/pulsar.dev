/**
 * @fileoverview Router integration with lazy loading
 * @module @pulsar/router/lazy
 */
import type { IRoute } from '../route.interface';
import type { ILazyRoute } from './lazy-route.types';
/**
 * Render lazy route component
 *
 * Integrates lazy loading with router rendering pipeline
 */
export declare function renderLazyRoute(route: IRoute | ILazyRoute, props?: Record<string, unknown>): HTMLElement;
/**
 * Extract routes from route tree
 */
export declare function extractRoutes(routes: IRoute[], parentPath?: string): IRoute[];
/**
 * Find route by path
 */
export declare function findRouteByPath(routes: IRoute[], path: string): IRoute | undefined;
/**
 * Get all lazy routes from route tree
 */
export declare function getAllLazyRoutes(routes: IRoute[]): ILazyRoute[];
