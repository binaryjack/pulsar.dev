/**
 * Create HTTP error with detailed information
 */

import type { IHttpError, IHttpRequestConfig, IHttpResponse } from '../http-client.types';

export function createHttpError(
  message: string,
  config: IHttpRequestConfig,
  response?: IHttpResponse,
  status?: number,
  isNetworkError: boolean = false,
  isTimeout: boolean = false,
  isCancelled: boolean = false
): IHttpError {
  const error = new Error(message) as IHttpError;

  error.name = 'HttpError';
  error.config = config;
  error.response = response;
  error.status = status;
  error.isNetworkError = isNetworkError;
  error.isTimeout = isTimeout;
  error.isCancelled = isCancelled;

  // Maintain proper stack trace
  if (Error.captureStackTrace) {
    Error.captureStackTrace(error, createHttpError);
  }

  return error;
}
