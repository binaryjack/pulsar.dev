import { IBatchContext } from './batch.types'

/**
 * Global batch context
 * Tracks whether we're currently batching and pending effects
 */
export const batchContext: IBatchContext = {
  isBatching: false,
  pendingEffects: new Set<() => void>(),
  depth: 0
}
