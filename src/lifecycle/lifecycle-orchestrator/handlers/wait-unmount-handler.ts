import { LifecycleHandler } from '../lifecycle-handler';
import type { ILifecycleHandler } from '../lifecycle-orchestrator.types';
import { LifecyclePhase } from '../lifecycle-orchestrator.types';

/**
 * Handler that waits for any pending unmount to complete before mounting
 * Prevents HMR race conditions
 */
export function createWaitUnmountHandler(): ILifecycleHandler {
  return new LifecycleHandler(
    'WaitUnmountHandler',
    (ctx) => ctx.phase === LifecyclePhase.PRE_MOUNT,
    async (ctx) => {
      // Note: The orchestrator's handle() method already waits for any
      // pending operation, so this handler mainly logs for debugging
      console.log('[WaitUnmountHandler] Pre-mount verification complete');
    }
  );
}
