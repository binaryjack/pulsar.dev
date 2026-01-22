/**
 * Router module
 * Client-side routing with path parameters, query strings, and guards
 */

// Export types
export type { IPathMatch } from './path-matcher';
export type { QueryValue } from './query-parser';
export type { IRoute } from './route.interface';
export type { ILocation, INavigationGuard } from './router-context';
export type { IRouter } from './router.interface';

// Export components
export { Outlet } from './outlet';
export { Route } from './route';
export { Router } from './router';

// Export hooks
export {
  useLocation,
  useMatch,
  useNavigate,
  useParams,
  useRoute,
  useRouter,
  useSearchParams,
} from './hooks';

// Export utilities
export { findMatchingRoute, matchPath, patternToRegex } from './path-matcher';

// Export lazy loading integration
export * from './lazy';
export { QueryParams, parseQuery, stringifyQuery } from './query-parser';
export { routerContext } from './router-context';
