/**
 * Core request method implementation
 * Handles the actual HTTP request with interceptors, caching, and retry logic
 */
import type { IHttpClientInternal, IHttpRequestConfig, IHttpResponse } from '../http-client.types';
/**
 * Make an HTTP request
 * This is the core method that all other methods (get, post, etc.) delegate to
 */
export declare function request<T = unknown>(this: IHttpClientInternal, config: IHttpRequestConfig): Promise<IHttpResponse<T>>;
