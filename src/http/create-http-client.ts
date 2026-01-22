/**
 * Create HTTP Client factory function
 * Provides ergonomic API for creating HTTP client instances
 */

import { HttpClient } from './http-client';
import type { IHttpClient, IHttpClientConfig } from './http-client.types';
import { addErrorInterceptor } from './prototype/add-error-interceptor';
import { addRequestInterceptor } from './prototype/add-request-interceptor';
import { addResponseInterceptor } from './prototype/add-response-interceptor';
import { clearCache } from './prototype/clear-cache';
import { deleteRequest } from './prototype/delete';
import { get } from './prototype/get';
import { patch } from './prototype/patch';
import { post } from './prototype/post';
import { put } from './prototype/put';
import { request } from './prototype/request';

// Attach prototype methods
HttpClient.prototype.request = request;
HttpClient.prototype.get = get;
HttpClient.prototype.post = post;
HttpClient.prototype.put = put;
HttpClient.prototype.delete = deleteRequest;
HttpClient.prototype.patch = patch;
HttpClient.prototype.addRequestInterceptor = addRequestInterceptor;
HttpClient.prototype.addResponseInterceptor = addResponseInterceptor;
HttpClient.prototype.addErrorInterceptor = addErrorInterceptor;
HttpClient.prototype.clearCache = clearCache;

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
export function createHttpClient(config?: IHttpClientConfig): IHttpClient {
  return new HttpClient(config) as unknown as IHttpClient;
}
