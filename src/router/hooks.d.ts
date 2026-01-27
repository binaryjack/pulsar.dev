/**
 * Router hooks
 * React-style hooks for accessing router state
 */
import { type IQueryParams } from './query-parser';
import type { ILocation } from './router-context.types';
/**
 * Access the router context
 * Provides navigate, location, and guards
 *
 * @example
 * const router = useRouter()
 * router.navigate('/users/123')
 */
export declare const useRouter: () => {
    /**
     * Navigate to a path
     */
    navigate: (path: string, options?: {
        replace?: boolean;
    }) => Promise<void>;
    /**
     * Get current location
     */
    readonly location: ILocation;
    /**
     * Register before navigation guard
     */
    beforeEach: (guard: (to: string, from: string) => boolean | Promise<boolean>) => () => void;
    /**
     * Register after navigation guard
     */
    afterEach: (guard: (to: string, from: string) => void) => () => void;
    /**
     * Get all routes
     */
    readonly routes: import("./route.interface").IRoute[];
};
/**
 * Navigate to a path
 * Returns navigate function
 *
 * @example
 * const navigate = useNavigate()
 * navigate('/users/123')
 */
export declare const useNavigate: () => (path: string, options?: {
    replace?: boolean;
}) => Promise<void>;
/**
 * Get current location
 * Reactive - updates when location changes
 *
 * @example
 * const location = useLocation()
 * console.log(location.pathname)
 */
export declare const useLocation: () => ILocation;
/**
 * Get path parameters
 * Reactive - updates when route changes
 *
 * @example
 * // Route: /users/:id
 * const params = useParams()
 * console.log(params.id) // '123'
 */
export declare const useParams: <T extends Record<string, string> = Record<string, string>>() => T;
/**
 * Get query parameters
 * Reactive - updates when query changes
 *
 * @example
 * const [search, setSearch] = useSearchParams()
 * console.log(search.get('q'))
 * setSearch({ q: 'new query' })
 */
export declare const useSearchParams: () => [IQueryParams, (query: Record<string, string | string[] | undefined>) => void];
/**
 * Get current route
 * Reactive - updates when route changes
 *
 * @example
 * const route = useRoute()
 * console.log(route?.path)
 */
export declare const useRoute: () => import("./route.interface").IRoute | null;
/**
 * Get current path match
 * Includes matched params and pattern
 *
 * @example
 * const match = useMatch()
 * console.log(match?.params)
 */
export declare const useMatch: () => import("./path-matcher").IPathMatch | null;
