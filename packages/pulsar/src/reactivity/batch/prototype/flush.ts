import { batchContext } from '../batch-context'
import { IBatchManager } from '../batch.types'

/**
 * Flush all pending effects
 * Executes each effect and clears the queue
 */
export const flush = function(this: IBatchManager): void {
  // Copy pending effects to avoid modification during iteration
  const effects = Array.from(batchContext.pendingEffects)
  
  // Clear the queue
  batchContext.pendingEffects.clear()
  
  // Execute all pending effects
  effects.forEach(effect => {
    try {
      effect()
    } catch (error) {
      console.error('[pulsar] Error during batch flush:', error)
    }
  })
}
