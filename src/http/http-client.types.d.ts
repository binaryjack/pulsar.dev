/**
 * HTTP Client Type Definitions
 * Following Pulsar's prototype-based pattern
 */
/**
 * HTTP request configuration
 */
export interface IHttpRequestConfig {
    /** Request URL */
    url: string;
    /** HTTP method */
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
    /** Request headers */
    headers?: Record<string, string>;
    /** Request body */
    body?: unknown;
    /** Query parameters */
    params?: Record<string, string | number | boolean>;
    /** Request timeout in milliseconds */
    timeout?: number;
    /** Enable caching for this request */
    cache?: boolean;
    /** Cache TTL in milliseconds (default: 5 minutes) */
    cacheTTL?: number;
    /** Cache key override */
    cacheKey?: string;
    /** Enable retry for this request */
    retry?: boolean;
    /** Number of retry attempts (default: 3) */
    retryAttempts?: number;
    /** Retry delay in milliseconds (default: 1000) */
    retryDelay?: number;
    /** AbortController signal for cancellation */
    signal?: AbortSignal;
}
/**
 * HTTP response wrapper
 */
export interface IHttpResponse<T = unknown> {
    /** Response data */
    data: T;
    /** HTTP status code */
    status: number;
    /** Status text */
    statusText: string;
    /** Response headers */
    headers: Headers;
    /** Original request config */
    config: IHttpRequestConfig;
    /** Whether response came from cache */
    fromCache: boolean;
}
/**
 * HTTP error details
 */
export interface IHttpError extends Error {
    /** Request configuration */
    config: IHttpRequestConfig;
    /** Response if available */
    response?: IHttpResponse;
    /** HTTP status code if available */
    status?: number;
    /** Whether error is a network error */
    isNetworkError: boolean;
    /** Whether error is a timeout */
    isTimeout: boolean;
    /** Whether request was cancelled */
    isCancelled: boolean;
}
/**
 * Request interceptor function
 * Transforms request before it's sent
 */
export type RequestInterceptor = (config: IHttpRequestConfig) => IHttpRequestConfig | Promise<IHttpRequestConfig>;
/**
 * Response interceptor function
 * Transforms response after it's received
 */
export type ResponseInterceptor = <T = unknown>(response: IHttpResponse<T>) => IHttpResponse<T> | Promise<IHttpResponse<T>>;
/**
 * Error interceptor function
 * Handles errors before they're thrown
 */
export type ErrorInterceptor = (error: IHttpError) => IHttpError | Promise<IHttpError> | Promise<never>;
/**
 * HTTP client configuration
 */
export interface IHttpClientConfig {
    /** Base URL for all requests */
    baseURL?: string;
    /** Default headers */
    headers?: Record<string, string>;
    /** Default timeout in milliseconds */
    timeout?: number;
    /** Enable caching by default */
    cache?: boolean;
    /** Default cache TTL in milliseconds */
    cacheTTL?: number;
    /** Enable retry by default */
    retry?: boolean;
    /** Default retry attempts */
    retryAttempts?: number;
    /** Default retry delay in milliseconds */
    retryDelay?: number;
}
/**
 * Internal HTTP client interface with private properties
 */
export interface IHttpClientInternal extends IHttpClient {
    /** Client configuration */
    config: IHttpClientConfig;
    /** Request interceptors */
    requestInterceptors: RequestInterceptor[];
    /** Response interceptors */
    responseInterceptors: ResponseInterceptor[];
    /** Error interceptors */
    errorInterceptors: ErrorInterceptor[];
    /** Cache instance */
    cache: Map<string, ICacheEntry>;
}
/**
 * Public HTTP client interface
 */
export interface IHttpClient {
    /**
     * Make a generic HTTP request
     */
    request<T = unknown>(config: IHttpRequestConfig): Promise<IHttpResponse<T>>;
    /**
     * Make a GET request
     */
    get<T = unknown>(url: string, config?: Partial<IHttpRequestConfig>): Promise<IHttpResponse<T>>;
    /**
     * Make a POST request
     */
    post<T = unknown>(url: string, data?: unknown, config?: Partial<IHttpRequestConfig>): Promise<IHttpResponse<T>>;
    /**
     * Make a PUT request
     */
    put<T = unknown>(url: string, data?: unknown, config?: Partial<IHttpRequestConfig>): Promise<IHttpResponse<T>>;
    /**
     * Make a DELETE request
     */
    delete<T = unknown>(url: string, config?: Partial<IHttpRequestConfig>): Promise<IHttpResponse<T>>;
    /**
     * Make a PATCH request
     */
    patch<T = unknown>(url: string, data?: unknown, config?: Partial<IHttpRequestConfig>): Promise<IHttpResponse<T>>;
    /**
     * Add a request interceptor
     */
    addRequestInterceptor(interceptor: RequestInterceptor): () => void;
    /**
     * Add a response interceptor
     */
    addResponseInterceptor(interceptor: ResponseInterceptor): () => void;
    /**
     * Add an error interceptor
     */
    addErrorInterceptor(interceptor: ErrorInterceptor): () => void;
    /**
     * Clear cache for a specific key or pattern
     */
    clearCache(keyOrPattern?: string): void;
}
/**
 * Cache entry with TTL
 */
export interface ICacheEntry {
    /** Cached response data */
    data: IHttpResponse;
    /** Timestamp when cached */
    timestamp: number;
    /** Time-to-live in milliseconds */
    ttl: number;
}
/**
 * Retry configuration
 */
export interface IRetryConfig {
    /** Number of retry attempts */
    attempts: number;
    /** Base delay in milliseconds */
    delay: number;
    /** Maximum delay in milliseconds */
    maxDelay?: number;
    /** Exponential backoff factor */
    factor?: number;
    /** Retry condition function */
    retryCondition?: (error: IHttpError) => boolean;
}
