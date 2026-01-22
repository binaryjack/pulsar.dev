/**
 * useHttp Hook
 * React-style hook for HTTP requests with Pulsar's reactivity
 */

import { createSignal } from '../reactivity';
import type {
  IHttpClient,
  IHttpError,
  IHttpRequestConfig,
  IHttpResponse,
} from './http-client.types';

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
export function useHttp<T = unknown>(
  client: IHttpClient,
  config: IHttpRequestConfig
): IUseHttpResult<T> {
  // Create reactive signals
  const [data, setData] = createSignal<T | null>(null);
  const [loading, setLoading] = createSignal<boolean>(false);
  const [error, setError] = createSignal<IHttpError | null>(null);
  const [response, setResponse] = createSignal<IHttpResponse<T> | null>(null);

  // Store initial config
  let lastConfig = config;

  /**
   * Execute the HTTP request
   */
  async function execute(
    additionalConfig?: Partial<IHttpRequestConfig>
  ): Promise<IHttpResponse<T>> {
    // Merge configs with proper headers merging
    const fullConfig: IHttpRequestConfig = {
      ...lastConfig,
      ...additionalConfig,
      headers: {
        ...lastConfig.headers,
        ...additionalConfig?.headers,
      },
    };

    // Store for refetch
    lastConfig = fullConfig;

    // Reset state
    setLoading(true);
    setError(null);

    try {
      const httpResponse = await client.request<T>(fullConfig);

      // Update signals
      setData(httpResponse.data);
      setResponse(httpResponse);
      setLoading(false);

      return httpResponse;
    } catch (err) {
      const httpError = err as IHttpError;

      // Update error signal
      setError(httpError);
      setLoading(false);

      throw httpError;
    }
  }

  /**
   * Re-fetch with same configuration
   */
  async function refetch(): Promise<IHttpResponse<T>> {
    return execute();
  }

  /**
   * Reset all state
   */
  function reset(): void {
    setData(null);
    setLoading(false);
    setError(null);
    setResponse(null);
  }

  return {
    data,
    loading,
    error,
    response,
    execute,
    refetch,
    reset,
  };
}

/**
 * Hook for GET requests
 * Convenience wrapper around useHttp
 */
export function useHttpGet<T = unknown>(
  client: IHttpClient,
  url: string,
  config?: Partial<IHttpRequestConfig>
): IUseHttpResult<T> {
  return useHttp<T>(client, {
    ...config,
    url,
    method: 'GET',
  });
}

/**
 * Hook for POST requests
 * Convenience wrapper around useHttp
 */
export function useHttpPost<T = unknown>(
  client: IHttpClient,
  url: string,
  config?: Partial<IHttpRequestConfig>
): IUseHttpResult<T> {
  return useHttp<T>(client, {
    ...config,
    url,
    method: 'POST',
  });
}
