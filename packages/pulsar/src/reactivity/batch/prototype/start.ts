import { batchContext } from '../batch-context'
import { IBatchManager } from '../batch.types'

/**
 * Start a batch context
 * Increments depth to support nested batches
 */
export const start = function(this: IBatchManager): void {
  batchContext.depth++
  
  if (batchContext.depth === 1) {
    batchContext.isBatching = true
  }
}
