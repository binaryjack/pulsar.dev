/**
 * ApplicationRoot mount method
 */

import { setCurrentAppRoot } from '../../../registry/app-root-context';
import { IApplicationRootInternal } from '../../application-root-internal.interface';

export const mount = function (this: IApplicationRootInternal, component: HTMLElement): void {
  const mountInternal = () => {
    if (this._isMounted) {
      console.warn('[ApplicationRoot] Already mounted, unmounting first');
      this.unmount();
    }

    try {
      // Clear root element
      this.rootElement.innerHTML = '';

      // Mount component
      this.rootElement.appendChild(component);

      this._mountedComponent = component;
      this._isMounted = true;

      // Register this ApplicationRoot as the current one
      setCurrentAppRoot(this);

      // Call onMount callback
      if (this.onMount) {
        this.onMount(component);
      }

      console.log('[ApplicationRoot] Component mounted successfully');
    } catch (error) {
      const err = error as Error;
      console.error('[ApplicationRoot] Mount failed:', err);

      if (this.onError) {
        this.onError(err);
      } else {
        throw err;
      }
    }
  };

  // Ensure DOM is ready before mounting
  if (document.readyState === 'loading') {
    console.log('[ApplicationRoot] Waiting for DOM ready...');
    document.addEventListener('DOMContentLoaded', () => {
      console.log('[ApplicationRoot] DOM ready, mounting now');
      mountInternal();
    });
  } else {
    console.log('[ApplicationRoot] DOM already ready, mounting immediately');
    mountInternal();
  }
};
