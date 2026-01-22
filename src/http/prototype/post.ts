/**
 * POST request method
 */

import type { IHttpClientInternal, IHttpRequestConfig, IHttpResponse } from '../http-client.types';

export async function post<T = unknown>(
  this: IHttpClientInternal,
  url: string,
  data?: unknown,
  config: Partial<IHttpRequestConfig> = {}
): Promise<IHttpResponse<T>> {
  return this.request<T>({
    ...config,
    url,
    method: 'POST',
    body: data,
  });
}
