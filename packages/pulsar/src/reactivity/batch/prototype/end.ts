import { batchContext } from '../batch-context'
import { IBatchManager } from '../batch.types'

/**
 * End a batch context
 * Decrements depth and flushes when reaching zero
 */
export const end = function(this: IBatchManager): void {
  batchContext.depth--
  
  if (batchContext.depth === 0) {
    batchContext.isBatching = false
    this.flush()
  }
  
  // Prevent negative depth
  if (batchContext.depth < 0) {
    batchContext.depth = 0
  }
}
