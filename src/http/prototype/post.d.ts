/**
 * POST request method
 */
import type { IHttpClientInternal, IHttpRequestConfig, IHttpResponse } from '../http-client.types';
export declare function post<T = unknown>(this: IHttpClientInternal, url: string, data?: unknown, config?: Partial<IHttpRequestConfig>): Promise<IHttpResponse<T>>;
