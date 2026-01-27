/**
 * Router context
 * Provides access to router state via dependency injection
 */
import type { IRouterContext, IRouterContextInternal } from './router-context.types';
export type { ILocation, INavigationGuard } from './router-context.types';
/**
 * Router context constructor
 * Manages global router state
 */
export declare const RouterContext: {
    new (): IRouterContextInternal;
};
/**
 * Get router context singleton instance
 */
export declare function getRouterContext(): IRouterContext;
/**
 * Export singleton instance for backward compatibility
 */
export declare const routerContext: IRouterContext;
