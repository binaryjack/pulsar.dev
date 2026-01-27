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
export declare const parseQuery: (search: string) => Record<string, QueryValue>;
/**
 * Serialize query object to string
 *
 * @example
 * stringifyQuery({ foo: 'bar', baz: ['qux', 'quux'] })
 * // => 'foo=bar&baz=qux&baz=quux'
 */
export declare const stringifyQuery: (query: Record<string, QueryValue>) => string;
/**
 * Type-safe query parameter interface
 */
export interface IQueryParams {
    get(key: string): string | undefined;
    getAll(key: string): string[];
    has(key: string): boolean;
    getAllAsObject(): Record<string, QueryValue>;
    toURLSearchParams(): URLSearchParams;
}
/**
 * Internal query params interface
 */
export interface IQueryParamsInternal extends IQueryParams {
    params: Record<string, QueryValue>;
}
/**
 * Type-safe query parameter constructor
 */
export declare const QueryParams: {
    new (search: string): IQueryParamsInternal;
};
