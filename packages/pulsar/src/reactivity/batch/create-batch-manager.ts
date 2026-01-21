import { BatchManager } from './batch-manager'
import { IBatchManager } from './batch.types'
import { end } from './prototype/end'
import { flush } from './prototype/flush'
import { isBatching } from './prototype/is-batching'
import { schedule } from './prototype/schedule'
import { start } from './prototype/start'

// Attach prototype methods
BatchManager.prototype.start = start
BatchManager.prototype.end = end
BatchManager.prototype.schedule = schedule
BatchManager.prototype.isBatching = isBatching
BatchManager.prototype.flush = flush

/**
 * Create a batch manager instance
 * Singleton pattern - returns the same instance
 */
let instance: IBatchManager | null = null

export function createBatchManager(): IBatchManager {
  if (!instance) {
    instance = new BatchManager()
  }
  return instance
}
