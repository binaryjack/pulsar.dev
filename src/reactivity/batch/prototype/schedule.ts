import { batchContext } from '../batch-context'
import { IBatchManager } from '../batch.types'

/**
 * Schedule an effect to run after batch completes
 * If not batching, runs immediately
 */
export const schedule = function(
  this: IBatchManager,
  effect: () => void
): void {
  if (batchContext.isBatching) {
    // Add to pending queue (Set prevents duplicates)
    batchContext.pendingEffects.add(effect)
  } else {
    // Not batching - run immediately
    effect()
  }
}
