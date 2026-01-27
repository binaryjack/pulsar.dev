/**
 * Create HTTP Client factory function
 * Provides ergonomic API for creating HTTP client instances
 */
import type { IHttpClient, IHttpClientConfig } from './http-client.types';
/**
 * Create a new HTTP client instance
 *
 * @param config - Client configuration
 * @returns Configured HTTP client instance
 *
 * @example
 * ```ts
 * const client = createHttpClient({
 *   baseURL: 'https://api.example.com',
 *   timeout: 5000,
 *   headers: {
 *     'Authorization': 'Bearer token123'
 *   }
 * })
 *
 * // Make requests
 * const response = await client.get('/users')
 * ```
 */
export declare function createHttpClient(config?: IHttpClientConfig): IHttpClient;
