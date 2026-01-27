/**
 * Router module
 * Client-side routing with path parameters, query strings, and guards
 */
export type { IPathMatch } from './path-matcher';
export type { QueryValue } from './query-parser';
export type { IRoute } from './route.interface';
export type { ILocation, INavigationGuard } from './router-context';
export type { IRouter } from './router.interface';
export { Outlet } from './outlet';
export { Route } from './route';
export { Router } from './router';
export { useLocation, useMatch, useNavigate, useParams, useRoute, useRouter, useSearchParams, } from './hooks';
export { findMatchingRoute, matchPath, patternToRegex } from './path-matcher';
export * from './lazy';
export { QueryParams, parseQuery, stringifyQuery } from './query-parser';
export { routerContext } from './router-context';
