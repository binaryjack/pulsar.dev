/**
 * DELETE request method
 */

import type { IHttpClientInternal, IHttpRequestConfig, IHttpResponse } from '../http-client.types';

export async function deleteRequest<T = unknown>(
  this: IHttpClientInternal,
  url: string,
  config: Partial<IHttpRequestConfig> = {}
): Promise<IHttpResponse<T>> {
  return this.request<T>({
    ...config,
    url,
    method: 'DELETE',
  });
}
