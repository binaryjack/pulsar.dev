/**
 * ApplicationRoot unmount method
 */

import { cleanup } from '../../../lifecycle';
import { clearCurrentAppRoot } from '../../../registry/app-root-context';
import { IApplicationRootInternal } from '../../application-root-internal.interface';

export const unmount = function (this: IApplicationRootInternal): void {
  if (!this._isMounted) {
    console.warn('[ApplicationRoot] Not mounted');
    return;
  }

  try {
    // Run lifecycle cleanup for all components
    if (this._mountedComponent) {
      cleanup(this._mountedComponent);
    }

    // Call onUnmount callback
    if (this.onUnmount) {
      this.onUnmount();
    }

    // Clear registry (cleanup all tracked elements)
    this.registry.clear();
    console.log('[ApplicationRoot] Registry cleared');

    // Clear portal stack
    this.portalStack.clear();
    console.log('[ApplicationRoot] Portal stack cleared');

    // Cleanup event delegator (remove all listeners)
    this.eventDelegator.destroy();
    console.log('[ApplicationRoot] Event delegator destroyed');

    // Disconnect MutationObserver to prevent memory leaks
    if (this.cleanupObserver) {
      this.cleanupObserver.disconnect();
      this.cleanupObserver = null;
      console.log('[ApplicationRoot] Cleanup observer disconnected');
    }

    // Clear current ApplicationRoot reference
    clearCurrentAppRoot();

    // Clear root element
    this.rootElement.innerHTML = '';

    this._mountedComponent = null;
    this._isMounted = false;

    console.log('[ApplicationRoot] Component unmounted successfully');
  } catch (error) {
    const err = error as Error;
    console.error('[ApplicationRoot] Unmount failed:', err);

    if (this.onError) {
      this.onError(err);
    }
  }
};
