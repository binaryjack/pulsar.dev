/**
 * GET request method
 */
import type { IHttpClientInternal, IHttpRequestConfig, IHttpResponse } from '../http-client.types';
export declare function get<T = unknown>(this: IHttpClientInternal, url: string, config?: Partial<IHttpRequestConfig>): Promise<IHttpResponse<T>>;
