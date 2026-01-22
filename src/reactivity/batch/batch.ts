import { BatchFn } from './batch.types'
import { createBatchManager } from './create-batch-manager'

const batchManager = createBatchManager()

/**
 * Execute a function within a batch context
 * All signal writes during execution are batched
 * Effects only run once after the function completes
 * 
 * @example
 * ```typescript
 * batch(() => {
 *   setCount(1)
 *   setName('Bob')
 *   setAge(30)
 * })
 * // Only triggers effects once, not three times
 * ```
 */
export function batch(fn: BatchFn): void {
  batchManager.start()
  
  try {
    fn()
  } finally {
    // Always end batch, even if fn throws
    batchManager.end()
  }
}

/**
 * Check if currently in a batch context
 */
export function isBatching(): boolean {
  return batchManager.isBatching()
}

/**
 * Schedule an effect to run after current batch
 * If not batching, runs immediately
 */
export function scheduleBatchedEffect(effect: () => void): void {
  batchManager.schedule(effect)
}
