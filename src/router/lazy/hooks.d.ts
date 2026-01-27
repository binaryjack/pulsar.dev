/**
 * @fileoverview Router hooks for lazy loading
 * @module @pulsar/router/lazy
 */
import type { ILazyRoute } from './lazy-route.types';
import { prefetchRoute } from './route-prefetch';
/**
 * Hook for prefetching route on navigation
 *
 * @example
 * ```typescript
 * function NavigationLink({ to, label, route }) {
 *   const { navigateWithPrefetch } = usePrefetchRoute();
 *
 *   return (
 *     <button onClick={() => navigateWithPrefetch(to, route)}>
 *       {label}
 *     </button>
 *   );
 * }
 * ```
 */
export declare function usePrefetchRoute(): {
    navigateWithPrefetch: (path: string, route: ILazyRoute) => Promise<void>;
    navigateWithOptionalPrefetch: (path: string, route?: ILazyRoute) => void;
    prefetch: typeof prefetchRoute;
};
/**
 * Hook for creating prefetch link
 *
 * @example
 * ```typescript
 * function NavLink({ route, strategy = 'hover' }) {
 *   const linkRef = usePrefetchLink(route, strategy);
 *
 *   return <a ref={linkRef} href={route.path}>Link</a>;
 * }
 * ```
 */
export declare function usePrefetchLink(route: ILazyRoute, strategy?: 'hover' | 'visible'): (element: HTMLElement | null) => void;
/**
 * Hook for prefetching routes on mount
 *
 * @example
 * ```typescript
 * function Dashboard() {
 *   // Prefetch settings and profile routes when dashboard loads
 *   usePrefetchOnMount([settingsRoute, profileRoute], 'idle');
 *
 *   return <div>Dashboard content</div>;
 * }
 * ```
 */
export declare function usePrefetchOnMount(routes: ILazyRoute[], strategy?: 'eager' | 'idle'): void;
