import { LifecycleHandler } from '../lifecycle-handler'
import type { ILifecycleHandler } from '../lifecycle-orchestrator.types'
import { LifecyclePhase } from '../lifecycle-orchestrator.types'

/**
 * Handler that clears the DOM after wires have been disposed
 * CRITICAL: Must run AFTER wire disposal to avoid clearing new component
 */
export function createDomClearHandler(): ILifecycleHandler {
  return new LifecycleHandler(
    'DomClearHandler',
    (ctx) => ctx.phase === LifecyclePhase.UNMOUNT_DOM,
    async (ctx) => {
      const { appRoot } = ctx

      console.log('[DomClearHandler] Clearing DOM...')

      // NOW safe to clear innerHTML - wires already disposed
      appRoot.rootElement.innerHTML = ''

      console.log('[DomClearHandler] DOM cleared')
    }
  )
}
