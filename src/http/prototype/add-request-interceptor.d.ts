/**
 * Add request interceptor
 */
import type { IHttpClientInternal, RequestInterceptor } from '../http-client.types';
export declare function addRequestInterceptor(this: IHttpClientInternal, interceptor: RequestInterceptor): () => void;
