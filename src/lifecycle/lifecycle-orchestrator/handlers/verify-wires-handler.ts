import { $REGISTRY } from '../../../registry/core'
import { LifecycleHandler } from '../lifecycle-handler'
import type { ILifecycleHandler } from '../lifecycle-orchestrator.types'
import { LifecyclePhase } from '../lifecycle-orchestrator.types'

/**
 * Handler that verifies wire integrity after mount
 * Useful for debugging and ensuring proper cleanup
 */
export function createVerifyWiresHandler(): ILifecycleHandler {
  return new LifecycleHandler(
    'VerifyWiresHandler',
    (ctx) => ctx.phase === LifecyclePhase.POST_MOUNT,
    async (ctx) => {
      const { appRoot, component } = ctx

      console.log('[VerifyWiresHandler] Verifying wire integrity...')

      // Count wire subscriptions by walking the DOM tree (including text nodes)
      let wireCount = 0

      if (component) {
        const walker = document.createTreeWalker(
          component,
          NodeFilter.SHOW_ALL, // Include all node types (elements + text)
          null
        )

        let node: Node | null = walker.currentNode
        while (node) {
          if ($REGISTRY._nodes.has(node)) {
            wireCount += $REGISTRY._nodes.get(node)!.size
          }
          node = walker.nextNode()
        }
      }

      console.log(`[VerifyWiresHandler] Found ${wireCount} active wires`)

      // Store in metadata for debugging
      ctx.metadata.wireCount = wireCount
    }
  )
}
