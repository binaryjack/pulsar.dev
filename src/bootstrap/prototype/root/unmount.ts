/**
 * ApplicationRoot unmount method
 */

import type { ILifecycleContext } from '../../../lifecycle/lifecycle-orchestrator';
import { LifecyclePhase } from '../../../lifecycle/lifecycle-orchestrator';
import { clearCurrentAppRoot } from '../../../registry/app-root-context';
import { IApplicationRootInternal } from '../../application-root-internal.interface';

export const unmount = async function (this: IApplicationRootInternal): Promise<void> {
  if (!this._isMounted) {
    console.warn('[ApplicationRoot] Not mounted');
    return;
  }

  try {
    // Create lifecycle context
    const context: ILifecycleContext = {
      phase: LifecyclePhase.PRE_UNMOUNT,
      appRoot: this,
      metadata: {},
      timestamp: Date.now(),
    };

    // PRE-UNMOUNT phase (lifecycle cleanup)
    await this.lifecycleOrchestrator.handle(context);

    // Call onUnmount callback
    if (this.onUnmount) {
      this.onUnmount();
    }

    // UNMOUNT-REGISTRY phase (clear per-app registry and portal stack)
    context.phase = LifecyclePhase.UNMOUNT_REGISTRY;
    await this.lifecycleOrchestrator.handle(context);

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

    // UNMOUNT-WIRES phase (dispose reactive bindings from $REGISTRY)
    // CRITICAL: This must happen BEFORE clearing DOM
    context.phase = LifecyclePhase.UNMOUNT_WIRES;
    await this.lifecycleOrchestrator.handle(context);

    // UNMOUNT-DOM phase (clear DOM after wires disposed)
    context.phase = LifecyclePhase.UNMOUNT_DOM;
    await this.lifecycleOrchestrator.handle(context);

    this._mountedComponent = null;
    this._isMounted = false;

    // POST-UNMOUNT phase (verification)
    context.phase = LifecyclePhase.POST_UNMOUNT;
    await this.lifecycleOrchestrator.handle(context);

    console.log('[ApplicationRoot] Component unmounted successfully');
  } catch (error) {
    const err = error as Error;
    console.error('[ApplicationRoot] Unmount failed:', err);

    if (this.onError) {
      this.onError(err);
    }
  }
};
