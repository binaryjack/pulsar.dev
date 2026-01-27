/**
 * Router component
 * Hash-based client-side routing with declarative Route children
 * Now with path parameters, query strings, and navigation guards
 */
interface IRouterProps {
    children: HTMLElement | HTMLElement[];
    fallback?: () => HTMLElement;
}
/**
 * Router component - manages hash-based routing
 * Expects Route components as children
 */
export declare const Router: ({ children, fallback }: IRouterProps) => HTMLElement;
export {};
