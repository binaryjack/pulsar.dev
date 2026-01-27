/**
 * Add response interceptor
 */
import type { IHttpClientInternal, ResponseInterceptor } from '../http-client.types';
export declare function addResponseInterceptor(this: IHttpClientInternal, interceptor: ResponseInterceptor): () => void;
