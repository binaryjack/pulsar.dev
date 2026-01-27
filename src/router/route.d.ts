/**
 * Route component
 * Defines a route that will be matched and rendered by Router
 */
export interface IRouteProps {
    path: string;
    component?: () => HTMLElement;
    element?: HTMLElement;
    default?: boolean;
    label?: string;
    children?: HTMLElement;
}
/**
 * Route component - declarative route definition
 * The Router parent component will handle rendering based on current path
 */
export declare const Route: (props: IRouteProps) => HTMLElement;
