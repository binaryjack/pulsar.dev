/**
 * ApplicationRoot mount method
 */

import type { ILifecycleContext } from '../../../lifecycle/lifecycle-orchestrator';
import { LifecyclePhase } from '../../../lifecycle/lifecycle-orchestrator';
import { setCurrentAppRoot } from '../../../registry/app-root-context';
import { IApplicationRootInternal } from '../../application-root-internal.interface';

export const mount = async function (
  this: IApplicationRootInternal,
  component: HTMLElement
): Promise<void> {
  const mountInternal = async () => {
    if (this._isMounted) {
      console.warn('[ApplicationRoot] Already mounted, unmounting first');
      await this.unmount();
    }

    try {
      // Create lifecycle context
      const context: ILifecycleContext = {
        phase: LifecyclePhase.PRE_MOUNT,
        appRoot: this,
        component,
        metadata: {},
        timestamp: Date.now(),
      };

      // PRE-MOUNT phase (wait for unmount, verify clean state)
      await this.lifecycleOrchestrator.handle(context);

      // MOUNT-DOM phase
      context.phase = LifecyclePhase.MOUNT_DOM;
      console.log('[ApplicationRoot] Mounting component to DOM...');
      this.rootElement.innerHTML = '';
      this.rootElement.appendChild(component);
      this._mountedComponent = component;

      // MOUNT-LIFECYCLE phase
      context.phase = LifecyclePhase.MOUNT_LIFECYCLE;
      this._isMounted = true;

      // Register this ApplicationRoot as the current one
      setCurrentAppRoot(this);

      // Call onMount callback
      if (this.onMount) {
        this.onMount(component);
      }

      // POST-MOUNT phase (verification, logging)
      context.phase = LifecyclePhase.POST_MOUNT;
      await this.lifecycleOrchestrator.handle(context);

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
    return new Promise((resolve, reject) => {
      document.addEventListener('DOMContentLoaded', async () => {
        console.log('[ApplicationRoot] DOM ready, mounting now');
        try {
          await mountInternal();
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });
  } else {
    console.log('[ApplicationRoot] DOM already ready, mounting immediately');
    await mountInternal();
  }
};
