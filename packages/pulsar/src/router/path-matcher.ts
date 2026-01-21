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
export const patternToRegex = (pattern: string): { regex: RegExp; keys: string[] } => {
  const keys: string[] = [];

  // Escape special regex characters
  let regexPattern = pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&');

  // Replace :param with capture group
  regexPattern = regexPattern.replace(/:([a-zA-Z_][a-zA-Z0-9_]*)/g, (_, key) => {
    keys.push(key);
    return '([^/]+)';
  });

  // Replace *wildcard with greedy capture
  regexPattern = regexPattern.replace(/\*([a-zA-Z_][a-zA-Z0-9_]*)/g, (_, key) => {
    keys.push(key);
    return '(.*)';
  });

  // Exact match required
  const regex = new RegExp(`^${regexPattern}$`);

  return { regex, keys };
};

/**
 * Match a path against a pattern
 *
 * @example
 * matchPath('/users/123', '/users/:id')
 * // => { matched: true, params: { id: '123' } }
 */
export const matchPath = (path: string, pattern: string): IPathMatch => {
  // Exact match first
  if (path === pattern) {
    return { matched: true, params: {} };
  }

  // Try pattern matching
  const { regex, keys } = patternToRegex(pattern);
  const match = path.match(regex);

  if (!match) {
    return { matched: false, params: {} };
  }

  // Extract parameters
  const params: Record<string, string> = {};
  keys.forEach((key, index) => {
    params[key] = decodeURIComponent(match[index + 1]);
  });

  return {
    matched: true,
    params,
    pattern,
  };
};

/**
 * Find the first matching route from a list
 */
export const findMatchingRoute = <T extends { path: string }>(
  path: string,
  routes: T[]
): { route: T; match: IPathMatch } | null => {
  for (const route of routes) {
    const match = matchPath(path, route.path);
    if (match.matched) {
      return { route, match };
    }
  }
  return null;
};
