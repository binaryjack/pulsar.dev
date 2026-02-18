/**
 * Router hooks
 * React-style hooks for accessing router state
 */

import { QueryParams, type IQueryParams } from './query-parser';
import { routerContext } from './router-context';
import type { ILocation } from './router-context.types';

/**
 * Access the router context
 * Provides navigate, location, and guards
 *
 * @example
 * const router = useRouter()
 * router.navigate('/users/123')
 */
export const useRouter = () => {
  return {
    /**
     * Navigate to a path
     */
    navigate: (path: string, options?: { replace?: boolean }) => {
      return routerContext.navigate(path, options);
    },

    /**
     * Get current location
     */
    get location(): ILocation {
      return routerContext.getLocation();
    },

    /**
     * Register before navigation guard
     */
    beforeEach: (guard: (to: string, from: string) => boolean | Promise<boolean>) => {
      return routerContext.beforeEach(guard);
    },

    /**
     * Register after navigation guard
     */
    afterEach: (guard: (to: string, from: string) => void) => {
      return routerContext.afterEach(guard);
    },

    /**
     * Get all routes
     */
    get routes() {
      return routerContext.getRoutes();
    },
  };
};

/**
 * Navigate to a path
 * Returns navigate function
 *
 * @example
 * const navigate = useNavigate()
 * navigate('/users/123')
 */
export const useNavigate = () => {
  return (path: string, options?: { replace?: boolean }) => {
    return routerContext.navigate(path, options);
  };
};

/**
 * Get current location
 * Reactive - updates when location changes
 *
 * @example
 * const location = useLocation()
 * console.log(location.pathname)
 */
export const useLocation = (): ILocation => {
  // Returns an object with reactive getters that track router signals
  return routerContext.getLocation();
};

/**
 * Get path parameters
 * Reactive - updates when route changes
 *
 * @example
 * // Route: /users/:id
 * const params = useParams()
 * console.log(params.id) // '123'
 */
export const useParams = <T extends Record<string, string> = Record<string, string>>(): T => {
  return routerContext.currentParams as T;
};

/**
 * Get query parameters
 * Reactive - updates when query changes
 *
 * @example
 * const [search, setSearch] = useSearchParams()
 * console.log(search.get('q'))
 * setSearch({ q: 'new query' })
 */
export const useSearchParams = (): [
  IQueryParams,
  (query: Record<string, string | string[] | undefined>) => void,
] => {
  const query = routerContext.currentQuery || new QueryParams('');

  const setQuery = (newQuery: Record<string, string | string[] | undefined>) => {
    const params = new URLSearchParams();
    Object.entries(newQuery).forEach(([key, value]) => {
      if (value === undefined) return;
      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, v));
      } else {
        params.append(key, value);
      }
    });

    const currentPath = routerContext.currentPath;
    const newPath = `${currentPath}?${params.toString()}`;
    routerContext.navigate(newPath);
  };

  return [query, setQuery];
};

/**
 * Get current route
 * Reactive - updates when route changes
 *
 * @example
 * const route = useRoute()
 * console.log(route?.path)
 */
export const useRoute = () => {
  return routerContext.currentRoute;
};

/**
 * Get current path match
 * Includes matched params and pattern
 *
 * @example
 * const match = useMatch()
 * console.log(match?.params)
 */
export const useMatch = () => {
  return routerContext.currentMatch;
};
