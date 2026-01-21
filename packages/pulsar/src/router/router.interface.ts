/**
 * Router interface
 */

import { IRoute } from './route.interface'

export interface IRouter {
    /**
     * Current route
     */
    readonly currentRoute: IRoute | null
    
    /**
     * Navigate to a route
     */
    navigate(path: string): void
    
    /**
     * Register a route
     */
    addRoute(route: IRoute): void
    
    /**
     * Get all routes
     */
    readonly routes: IRoute[]
}
