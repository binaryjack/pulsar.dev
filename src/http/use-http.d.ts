/**
 * useHttp Hook
 * React-style hook for HTTP requests with Pulsar's reactivity
 */
import type { IHttpClient, IHttpError, IHttpRequestConfig, IHttpResponse } from './http-client.types';
/**
 * Signal getter function type
 */
export type SignalGetter<T> = () => T;
/**
 * HTTP hook state
 */
export interface IUseHttpState<T> {
    data: SignalGetter<T | null>;
    loading: SignalGetter<boolean>;
    error: SignalGetter<IHttpError | null>;
    response: SignalGetter<IHttpResponse<T> | null>;
}
/**
 * HTTP hook result with methods
 */
export interface IUseHttpResult<T> extends IUseHttpState<T> {
    execute: (config?: Partial<IHttpRequestConfig>) => Promise<IHttpResponse<T>>;
    refetch: () => Promise<IHttpResponse<T>>;
    reset: () => void;
}
/**
 * Hook to make HTTP requests with reactive state
 *
 * @param client - HTTP client instance
 * @param config - Request configuration
 * @returns Reactive state and control methods
 *
 * @example
 * ```ts
 * const { data, loading, error, execute } = useHttp(client, {
 *   url: '/users',
 *   method: 'GET'
 * })
 *
 * // Trigger request
 * await execute()
 *
 * // Access reactive values
 * if (loading()) {
 *   return <div>Loading...</div>
 * }
 *
 * if (error()) {
 *   return <div>Error: {error()!.message}</div>
 * }
 *
 * return <div>{JSON.stringify(data())}</div>
 * ```
 */
export declare function useHttp<T = unknown>(client: IHttpClient, config: IHttpRequestConfig): IUseHttpResult<T>;
/**
 * Hook for GET requests
 * Convenience wrapper around useHttp
 */
export declare function useHttpGet<T = unknown>(client: IHttpClient, url: string, config?: Partial<IHttpRequestConfig>): IUseHttpResult<T>;
/**
 * Hook for POST requests
 * Convenience wrapper around useHttp
 */
export declare function useHttpPost<T = unknown>(client: IHttpClient, url: string, config?: Partial<IHttpRequestConfig>): IUseHttpResult<T>;
