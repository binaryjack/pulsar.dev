// Export constructor
export { SyntheticEvent } from './synthetic-event'

// Export types
export { SSyntheticEvent } from './synthetic-event.types'
export type { EventHandler, ISyntheticEvent } from './synthetic-event.types'

// Export factory
export { createSyntheticEvent } from './create-synthetic-event'

// Export prototype methods
export { isDefaultPrevented } from './prototype/is-default-prevented'
export { isPropagationStopped } from './prototype/is-propagation-stopped'
export { preventDefault } from './prototype/prevent-default'
export { stopImmediatePropagation } from './prototype/stop-immediate-propagation'
export { stopPropagation } from './prototype/stop-propagation'

