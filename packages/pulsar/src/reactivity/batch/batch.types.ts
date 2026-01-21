/**
 * Batch system types for pulsar reactivity
 */

/**
 * Function that performs batched updates
 */
export type BatchFn = () => void

/**
 * Internal batch context interface
 */
export interface IBatchContext {
  /**
   * Currently batching flag
   */
  isBatching: boolean
  
  /**
   * Queue of pending effect executions
   */
  pendingEffects: Set<() => void>
  
  /**
   * Depth counter for nested batches
   */
  depth: number
}

/**
 * Batch manager interface
 */
export interface IBatchManager {
  /**
   * Start a batch context
   */
  start(): void
  
  /**
   * End a batch context and flush pending effects
   */
  end(): void
  
  /**
   * Schedule an effect to run after batch completes
   */
  schedule(effect: () => void): void
  
  /**
   * Check if currently batching
   */
  isBatching(): boolean
  
  /**
   * Flush all pending effects immediately
   */
  flush(): void
}
