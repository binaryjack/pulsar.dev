/**
 * Route interface
 */

export interface IRoute {
    /**
     * Route path pattern
     */
    path: string
    
    /**
     * Component factory function to render
     */
    component?: () => HTMLElement
    
    /**
     * Direct element to render
     */
    element?: HTMLElement
    
    /**
     * Is this the default route
     */
    default?: boolean
    
    /**
     * Label for navigation
     */
    label?: string
    
    /**
     * Child routes or content
     */
    children?: HTMLElement | IRoute[]
}
