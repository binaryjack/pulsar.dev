import { IBatchManager } from './batch.types'

/**
 * Batch manager constructor
 * Manages batched effect execution
 */
export const BatchManager = function(this: IBatchManager) {
  // No internal state - uses global batchContext
} as unknown as { new (): IBatchManager }
