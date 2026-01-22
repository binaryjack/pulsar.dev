import { batchContext } from '../batch-context'
import { IBatchManager } from '../batch.types'

/**
 * Check if currently batching
 */
export const isBatching = function(this: IBatchManager): boolean {
  return batchContext.isBatching
}
