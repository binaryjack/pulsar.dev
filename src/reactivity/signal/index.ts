// Export constructor
export { Signal } from './signal'

// Export types
export { SSignal } from './signal.types'
export type { ISignal, ISignalOptions, ISignalSubscriber } from './signal.types'

// Export factory
export { createSignal } from './create-signal'

// Export prototype methods (for testing/advanced usage)
export { dispose } from './prototype/dispose'
export { read } from './prototype/read'
export { subscribe } from './prototype/subscribe'
export { unsubscribe } from './prototype/unsubscribe'
export { write } from './prototype/write'

