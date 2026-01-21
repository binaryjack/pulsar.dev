/**
 * Route component
 * Defines a route that will be matched and rendered by Router
 */

export interface IRouteProps {
    path: string
    component?: () => HTMLElement
    element?: HTMLElement
    default?: boolean
    label?: string
    children?: HTMLElement
}

/**
 * Route component - declarative route definition
 * The Router parent component will handle rendering based on current path
 */
export const Route = (props: IRouteProps): HTMLElement => {
    // Route is just a marker component that Router will process
    const container = document.createElement('div')
    container.className = 'route-definition'
    container.setAttribute('data-path', props.path)
    container.setAttribute('data-label', props.label || props.path)
    
    if (props.default) {
        container.setAttribute('data-default', 'true')
    }
    
    // Store route config in the element for Router to read
    ;(container as any).__routeConfig = props
    
    return container
}
