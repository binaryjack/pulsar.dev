/**
 * Add error interceptor
 */
import type { ErrorInterceptor, IHttpClientInternal } from '../http-client.types';
export declare function addErrorInterceptor(this: IHttpClientInternal, interceptor: ErrorInterceptor): () => void;
