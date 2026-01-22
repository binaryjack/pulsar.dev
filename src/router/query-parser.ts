/**
 * Query string parsing utilities
 * Handles URLSearchParams with type-safe getters
 */

export type QueryValue = string | string[] | undefined;

/**
 * Parse query string into an object
 *
 * @example
 * parseQuery('?foo=bar&baz=qux&baz=quux')
 * // => { foo: 'bar', baz: ['qux', 'quux'] }
 */
export const parseQuery = (search: string): Record<string, QueryValue> => {
  const params = new URLSearchParams(search);
  const result: Record<string, QueryValue> = {};

  // Group by key to handle arrays
  const grouped = new Map<string, string[]>();

  params.forEach((value, key) => {
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key)!.push(value);
  });

  // Convert to object
  grouped.forEach((values, key) => {
    result[key] = values.length === 1 ? values[0] : values;
  });

  return result;
};

/**
 * Serialize query object to string
 *
 * @example
 * stringifyQuery({ foo: 'bar', baz: ['qux', 'quux'] })
 * // => 'foo=bar&baz=qux&baz=quux'
 */
export const stringifyQuery = (query: Record<string, QueryValue>): string => {
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined) return;

    if (Array.isArray(value)) {
      value.forEach((v) => params.append(key, v));
    } else {
      params.append(key, value);
    }
  });

  return params.toString();
};

/**
 * Type-safe query parameter getters
 */
export class QueryParams {
  private params: Record<string, QueryValue>;

  constructor(search: string) {
    this.params = parseQuery(search);
  }

  /**
   * Get a single query parameter
   */
  get(key: string): string | undefined {
    const value = this.params[key];
    return Array.isArray(value) ? value[0] : value;
  }

  /**
   * Get all values for a query parameter
   */
  getAll(key: string): string[] {
    const value = this.params[key];
    if (value === undefined) return [];
    return Array.isArray(value) ? value : [value];
  }

  /**
   * Check if a query parameter exists
   */
  has(key: string): boolean {
    return key in this.params;
  }

  /**
   * Get all query parameters as an object
   */
  getAll_asObject(): Record<string, QueryValue> {
    return { ...this.params };
  }

  /**
   * Convert to URLSearchParams
   */
  toURLSearchParams(): URLSearchParams {
    const params = new URLSearchParams();
    Object.entries(this.params).forEach(([key, value]) => {
      if (value === undefined) return;
      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, v));
      } else {
        params.append(key, value);
      }
    });
    return params;
  }
}
