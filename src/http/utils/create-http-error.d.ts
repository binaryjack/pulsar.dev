/**
 * Create HTTP error with detailed information
 */
import type { IHttpError, IHttpRequestConfig, IHttpResponse } from '../http-client.types';
export declare function createHttpError(message: string, config: IHttpRequestConfig, response?: IHttpResponse, status?: number, isNetworkError?: boolean, isTimeout?: boolean, isCancelled?: boolean): IHttpError;
