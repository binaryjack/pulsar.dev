/**
 * HTTP Client Constructor
 * Prototype-based constructor following Pulsar patterns
 */

import type { IHttpClientConfig, IHttpClientInternal } from './http-client.types';

/**
 * HttpClient constructor function
 * Creates a new HTTP client instance with configuration
 *
 * @example
 * ```ts
 * const client = new HttpClient({
 *   baseURL: 'https://api.example.com',
 *   timeout: 5000,
 *   headers: {
 *     'Content-Type': 'application/json'
 *   }
 * })
 * ```
 */
export const HttpClient = function (this: IHttpClientInternal, config: IHttpClientConfig = {}) {
  // Store configuration (non-enumerable)
  Object.defineProperty(this, 'config', {
    value: {
      baseURL: config.baseURL || '',
      headers: config.headers || {},
      timeout: config.timeout || 30000,
      cache: config.cache !== false, // Default true
      cacheTTL: config.cacheTTL || 300000, // 5 minutes
      retry: config.retry !== false, // Default true
      retryAttempts: config.retryAttempts || 3,
      retryDelay: config.retryDelay || 1000,
    },
    writable: false,
    enumerable: false,
  });

  // Initialize request interceptors array
  Object.defineProperty(this, 'requestInterceptors', {
    value: [] as ((config: unknown) => unknown)[],
    writable: false,
    enumerable: false,
  });

  // Initialize response interceptors array
  Object.defineProperty(this, 'responseInterceptors', {
    value: [] as ((response: unknown) => unknown)[],
    writable: false,
    enumerable: false,
  });

  // Initialize error interceptors array
  Object.defineProperty(this, 'errorInterceptors', {
    value: [] as ((error: unknown) => unknown)[],
    writable: false,
    enumerable: false,
  });

  // Initialize cache Map
  Object.defineProperty(this, 'cache', {
    value: new Map(),
    writable: false,
    enumerable: false,
  });
} as unknown as { new (config?: IHttpClientConfig): IHttpClientInternal };
