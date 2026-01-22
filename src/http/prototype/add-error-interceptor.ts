/**
 * Add error interceptor
 */

import type { ErrorInterceptor, IHttpClientInternal } from '../http-client.types';

export function addErrorInterceptor(
  this: IHttpClientInternal,
  interceptor: ErrorInterceptor
): () => void {
  this.errorInterceptors.push(interceptor);

  // Return unsubscribe function
  return () => {
    const index = this.errorInterceptors.indexOf(interceptor);
    if (index !== -1) {
      this.errorInterceptors.splice(index, 1);
    }
  };
}
