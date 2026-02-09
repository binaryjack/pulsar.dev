import { LifecycleHandler } from '../lifecycle-handler'
import type { ILifecycleHandler } from '../lifecycle-orchestrator.types'
import { LifecyclePhase } from '../lifecycle-orchestrator.types'

/**
 * Handler that clears the ApplicationRoot's per-instance registry and portal stack
 */
export function createClearRegistryHandler(): ILifecycleHandler {
  return new LifecycleHandler(
    'ClearRegistryHandler',
    (ctx) => ctx.phase === LifecyclePhase.UNMOUNT_REGISTRY,
    async (ctx) => {
      const { appRoot } = ctx

      console.log('[ClearRegistryHandler] Clearing registry...')

      appRoot.registry.clear()
      appRoot.portalStack.clear()

      console.log('[ClearRegistryHandler] Registry cleared')
    }
  )
}
