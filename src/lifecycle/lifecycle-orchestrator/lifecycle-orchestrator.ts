import type { IApplicationRootInternal } from '../../bootstrap/application-root-internal.interface';
import type {
  ILifecycleContext,
  ILifecycleHandler,
  ILifecycleOrchestrator,
} from './lifecycle-orchestrator.types';

/**
 * LifecycleOrchestrator constructor (prototype-based class)
 * Manages the handler chain for ApplicationRoot lifecycle phases
 */
export const LifecycleOrchestrator = function (
  this: ILifecycleOrchestrator,
  appRoot: IApplicationRootInternal
) {
  Object.defineProperty(this, 'appRoot', {
    value: appRoot,
    writable: false,
    configurable: false,
    enumerable: false,
  });

  Object.defineProperty(this, 'handlers', {
    value: null,
    writable: true,
    configurable: false,
    enumerable: false,
  });

  Object.defineProperty(this, 'pendingPhase', {
    value: null,
    writable: true,
    configurable: false,
    enumerable: false,
  });

  Object.defineProperty(this, 'isOperationInProgress', {
    value: false,
    writable: true,
    configurable: false,
    enumerable: false,
  });
} as unknown as { new (appRoot: IApplicationRootInternal): ILifecycleOrchestrator };

// Attach prototype methods
Object.assign(LifecycleOrchestrator.prototype, {
  registerHandler: function (this: ILifecycleOrchestrator, handler: ILifecycleHandler): void {
    if (!this.handlers) {
      this.handlers = handler;
    } else {
      this.handlers.setNext(handler);
    }
  },

  handle: async function (this: ILifecycleOrchestrator, context: ILifecycleContext): Promise<void> {
    // CRITICAL: Wait for any pending operation to complete
    if (this.isOperationInProgress) {
      console.warn(`[Lifecycle] Operation in progress (${this.pendingPhase}), waiting...`);
      await this.waitForCompletion();
      console.log(`[Lifecycle] Previous operation complete, proceeding with ${context.phase}`);
    }

    this.isOperationInProgress = true;
    this.pendingPhase = context.phase;

    try {
      if (this.handlers) {
        await this.handlers.handle(context);
      }
    } finally {
      this.isOperationInProgress = false;
      this.pendingPhase = null;
    }
  },

  waitForCompletion: async function (this: ILifecycleOrchestrator): Promise<void> {
    // Poll until operation completes (with timeout)
    const timeout = 5000;
    const start = Date.now();

    while (this.isOperationInProgress) {
      if (Date.now() - start > timeout) {
        throw new Error(`[Lifecycle] Timeout waiting for ${this.pendingPhase} to complete`);
      }
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
  },

  reset: function (this: ILifecycleOrchestrator): void {
    this.handlers = null;
    this.pendingPhase = null;
  },
});
