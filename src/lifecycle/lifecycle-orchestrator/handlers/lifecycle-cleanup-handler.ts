import { cleanup } from '../../lifecycle-hooks'
import { LifecycleHandler } from '../lifecycle-handler'
import type { ILifecycleHandler } from '../lifecycle-orchestrator.types'
import { LifecyclePhase } from '../lifecycle-orchestrator.types'

/**
 * Handler that runs lifecycle cleanup callbacks for mounted components
 */
export function createLifecycleCleanupHandler(): ILifecycleHandler {
  return new LifecycleHandler(
    'LifecycleCleanupHandler',
    (ctx) => ctx.phase === LifecyclePhase.PRE_UNMOUNT,
    async (ctx) => {
      const { appRoot } = ctx

      if (appRoot._mountedComponent) {
        console.log('[LifecycleCleanupHandler] Running lifecycle cleanup...')
        cleanup(appRoot._mountedComponent)
        console.log('[LifecycleCleanupHandler] Cleanup complete')
      }
    }
  )
}
