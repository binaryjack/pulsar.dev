import { $REGISTRY } from '../../../registry/core'
import { LifecycleHandler } from '../lifecycle-handler'
import type { ILifecycleHandler } from '../lifecycle-orchestrator.types'
import { LifecyclePhase } from '../lifecycle-orchestrator.types'

/**
 * Handler that disposes all wire effects from the global $REGISTRY
 * CRITICAL: This must run BEFORE clearing innerHTML to prevent orphaned effects
 */
export function createDisposeWiresHandler(): ILifecycleHandler {
  return new LifecycleHandler(
    'DisposeWiresHandler',
    (ctx) => ctx.phase === LifecyclePhase.UNMOUNT_WIRES,
    async (ctx) => {
      const { appRoot } = ctx

      console.log('[DisposeWiresHandler] Disposing wires from $REGISTRY...')

      // Dispose all wire effects for this app's elements
      $REGISTRY.disposeTree(appRoot.rootElement)

      console.log('[DisposeWiresHandler] Wires disposed')
    }
  )
}
