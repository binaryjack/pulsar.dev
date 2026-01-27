/**
 * HTTP Client Module
 * Enterprise-grade HTTP client with interceptors, caching, and retry logic
 *
 * @example
 * ```ts
 * import { createHttpClient } from '@pulsar-framework/core/http'
 *
 * const client = createHttpClient({
 *   baseURL: 'https://api.example.com',
 *   timeout: 5000
 * })
 *
 * // Make requests
 * const users = await client.get('/users')
 * await client.post('/users', { name: 'John' })
 * ```
 */
export { createHttpClient } from './create-http-client';
export { HttpClient } from './http-client';
export { useHttp, useHttpGet, useHttpPost } from './use-http';
export type { ErrorInterceptor, ICacheEntry, IHttpClient, IHttpClientConfig, IHttpError, IHttpRequestConfig, IHttpResponse, IRetryConfig, RequestInterceptor, ResponseInterceptor, } from './http-client.types';
export type { IUseHttpResult, IUseHttpState } from './use-http';
