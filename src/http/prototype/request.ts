/**
 * Core request method implementation
 * Handles the actual HTTP request with interceptors, caching, and retry logic
 */

import { generateCacheKey } from '../cache/cache-key';
import { getCachedResponse, setCachedResponse } from '../cache/memory-cache';
import type {
  IHttpClientInternal,
  IHttpError,
  IHttpRequestConfig,
  IHttpResponse,
} from '../http-client.types';
import { retryRequest } from '../retry/retry-strategy';
import { buildURL } from '../utils/build-url';
import { createHttpError } from '../utils/create-http-error';

/**
 * Make an HTTP request
 * This is the core method that all other methods (get, post, etc.) delegate to
 */
export async function request<T = unknown>(
  this: IHttpClientInternal,
  config: IHttpRequestConfig
): Promise<IHttpResponse<T>> {
  try {
    // Merge with client defaults
    const fullConfig: IHttpRequestConfig = {
      ...config,
      method: config.method || 'GET',
      headers: {
        ...this.config.headers,
        ...config.headers,
      },
      timeout: config.timeout !== undefined ? config.timeout : this.config.timeout,
      cache: config.cache !== undefined ? config.cache : this.config.cache,
      cacheTTL: config.cacheTTL || this.config.cacheTTL,
      retry: config.retry !== undefined ? config.retry : this.config.retry,
      retryAttempts: config.retryAttempts || this.config.retryAttempts,
      retryDelay: config.retryDelay || this.config.retryDelay,
    };

    // Build full URL with baseURL and params
    const fullURL = buildURL(this.config.baseURL || '', fullConfig.url, fullConfig.params);

    fullConfig.url = fullURL;

    // Run request interceptors
    let interceptedConfig = fullConfig;
    for (const interceptor of this.requestInterceptors) {
      interceptedConfig = await interceptor(interceptedConfig);
    }

    // Check cache for GET requests
    if (interceptedConfig.method === 'GET' && interceptedConfig.cache) {
      const cacheKey = interceptedConfig.cacheKey || generateCacheKey(interceptedConfig);
      const cached = getCachedResponse(this.cache, cacheKey);

      if (cached) {
        return cached as IHttpResponse<T>;
      }
    }

    // Execute request with retry logic if enabled
    const response = interceptedConfig.retry
      ? await retryRequest(() => executeRequest<T>(interceptedConfig), {
          attempts: interceptedConfig.retryAttempts!,
          delay: interceptedConfig.retryDelay!,
          factor: 2,
          maxDelay: 10000,
          retryCondition: (error) =>
            error.isNetworkError || (error.status !== undefined && error.status >= 500),
        })
      : await executeRequest<T>(interceptedConfig);

    // Run response interceptors
    let interceptedResponse = response;
    for (const interceptor of this.responseInterceptors) {
      interceptedResponse = await interceptor(interceptedResponse);
    }

    // Cache successful GET responses
    if (
      interceptedConfig.method === 'GET' &&
      interceptedConfig.cache &&
      interceptedResponse.status >= 200 &&
      interceptedResponse.status < 300
    ) {
      const cacheKey = interceptedConfig.cacheKey || generateCacheKey(interceptedConfig);
      setCachedResponse(this.cache, cacheKey, interceptedResponse, interceptedConfig.cacheTTL!);
    }

    return interceptedResponse as IHttpResponse<T>;
  } catch (error) {
    // Run error interceptors
    let httpError = error as IHttpError;

    for (const interceptor of this.errorInterceptors) {
      try {
        httpError = await interceptor(httpError);
      } catch (interceptedError) {
        // If interceptor throws, use that error
        httpError = interceptedError as IHttpError;
      }
    }

    throw httpError;
  }
}

/**
 * Execute the actual fetch request
 * Internal helper function
 */
async function executeRequest<T>(config: IHttpRequestConfig): Promise<IHttpResponse<T>> {
  const controller = new AbortController();
  const timeoutId = config.timeout
    ? setTimeout(() => controller.abort(), config.timeout)
    : undefined;

  try {
    // Prepare fetch options
    const fetchOptions: RequestInit = {
      method: config.method,
      headers: config.headers,
      signal: config.signal || controller.signal,
    };

    // Add body for non-GET requests
    if (config.body !== undefined && config.method !== 'GET' && config.method !== 'HEAD') {
      if (typeof config.body === 'string') {
        fetchOptions.body = config.body;
      } else {
        fetchOptions.body = JSON.stringify(config.body);
        // Ensure Content-Type is set for JSON
        if (!config.headers?.['Content-Type']) {
          fetchOptions.headers = {
            ...(fetchOptions.headers as Record<string, string>),
            'Content-Type': 'application/json',
          };
        }
      }
    }

    // Make the fetch request
    const response = await fetch(config.url, fetchOptions);

    // Parse response body
    let data: T;
    const contentType = response.headers.get('Content-Type') || '';

    if (contentType.includes('application/json')) {
      data = await response.json();
    } else if (contentType.includes('text/')) {
      data = (await response.text()) as unknown as T;
    } else if (typeof response.blob === 'function') {
      // Blob API may not be available in all environments (e.g., test environments)
      data = (await response.blob()) as unknown as T;
    } else {
      // Fallback for environments without blob support
      data = (await response.text()) as unknown as T;
    }

    // Create response object
    const httpResponse: IHttpResponse<T> = {
      data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      config,
      fromCache: false,
    };

    // Check for HTTP errors
    if (!response.ok) {
      throw createHttpError(
        `HTTP Error ${response.status}: ${response.statusText}`,
        config,
        httpResponse,
        response.status
      );
    }

    return httpResponse;
  } catch (error) {
    // Handle different error types
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw createHttpError(
        'Network error: Unable to reach server',
        config,
        undefined,
        undefined,
        true,
        false,
        false
      );
    }

    if (error instanceof DOMException && error.name === 'AbortError') {
      const isTimeout = timeoutId !== undefined;
      throw createHttpError(
        isTimeout ? `Request timeout after ${config.timeout}ms` : 'Request cancelled',
        config,
        undefined,
        undefined,
        false,
        isTimeout,
        !isTimeout
      );
    }

    // Re-throw if already an HttpError
    throw error;
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}
