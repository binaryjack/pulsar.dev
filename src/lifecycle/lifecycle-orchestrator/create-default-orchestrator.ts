import type { IApplicationRootInternal } from '../../bootstrap/application-root-internal.interface'
import {
    createClearRegistryHandler,
    createDisposeWiresHandler,
    createDomClearHandler,
    createLifecycleCleanupHandler,
    createVerifyWiresHandler,
    createWaitUnmountHandler
} from './handlers'
import { LifecycleOrchestrator } from './lifecycle-orchestrator'
import type { ILifecycleOrchestrator } from './lifecycle-orchestrator.types'

/**
 * Creates a LifecycleOrchestrator with default handlers registered
 * in the correct execution order
 */
export function createDefaultLifecycleOrchestrator(
  appRoot: IApplicationRootInternal
): ILifecycleOrchestrator {
  const orchestrator = new LifecycleOrchestrator(appRoot)

  // Register handlers in execution order:

  // UNMOUNT CHAIN (executed during unmount)
  orchestrator.registerHandler(createLifecycleCleanupHandler()) // 1. Run component cleanup callbacks
  orchestrator.registerHandler(createClearRegistryHandler())    // 2. Clear per-app registry
  orchestrator.registerHandler(createDisposeWiresHandler())     // 3. Dispose reactive wires
  orchestrator.registerHandler(createDomClearHandler())         // 4. Clear DOM (AFTER wires)

  // MOUNT CHAIN (executed during mount)
  orchestrator.registerHandler(createWaitUnmountHandler())      // 1. Wait for unmount to complete
  orchestrator.registerHandler(createVerifyWiresHandler())      // 2. Verify wire integrity post-mount

  return orchestrator
}
