/**
 * Add request interceptor
 */

import type { IHttpClientInternal, RequestInterceptor } from '../http-client.types';

export function addRequestInterceptor(
  this: IHttpClientInternal,
  interceptor: RequestInterceptor
): () => void {
  this.requestInterceptors.push(interceptor);

  // Return unsubscribe function
  return () => {
    const index = this.requestInterceptors.indexOf(interceptor);
    if (index !== -1) {
      this.requestInterceptors.splice(index, 1);
    }
  };
}
