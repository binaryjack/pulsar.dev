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
export declare const HttpClient: {
    new (config?: IHttpClientConfig): IHttpClientInternal;
};
