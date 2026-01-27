/**
 * Generate cache key from request configuration
 */
import type { IHttpRequestConfig } from '../http-client.types';
export declare function generateCacheKey(config: IHttpRequestConfig): string;
