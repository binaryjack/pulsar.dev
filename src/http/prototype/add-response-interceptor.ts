/**
 * Add response interceptor
 */

import type { IHttpClientInternal, ResponseInterceptor } from '../http-client.types';

export function addResponseInterceptor(
  this: IHttpClientInternal,
  interceptor: ResponseInterceptor
): () => void {
  this.responseInterceptors.push(interceptor);

  // Return unsubscribe function
  return () => {
    const index = this.responseInterceptors.indexOf(interceptor);
    if (index !== -1) {
      this.responseInterceptors.splice(index, 1);
    }
  };
}
