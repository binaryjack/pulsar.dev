/**
 * Path matching utilities
 * Handles path parameter extraction and route matching
 */
export interface IPathMatch {
    /**
     * Did the path match
     */
    matched: boolean;
    /**
     * Extracted path parameters
     */
    params: Record<string, string>;
    /**
     * Pattern that was matched
     */
    pattern?: string;
}
/**
 * Convert a route pattern to a regex
 * Supports :param and *wildcard syntax
 *
 * @example
 * '/users/:id' -> /^\/users\/([^/]+)$/
 * '/files/*path' -> /^\/files\/(.*)$/
 */
export declare const patternToRegex: (pattern: string) => {
    regex: RegExp;
    keys: string[];
};
/**
 * Match a path against a pattern
 *
 * @example
 * matchPath('/users/123', '/users/:id')
 * // => { matched: true, params: { id: '123' } }
 */
export declare const matchPath: (path: string, pattern: string) => IPathMatch;
/**
 * Find the first matching route from a list
 */
export declare const findMatchingRoute: <T extends {
    path: string;
}>(path: string, routes: T[]) => {
    route: T;
    match: IPathMatch;
} | null;
