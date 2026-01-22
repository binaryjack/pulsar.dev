// Export constructor
export { LifecycleManager } from './lifecycle-manager'

// Export types
export { SLifecycleManager } from './lifecycle-manager.types'
export type { ILifecycleManager, LifecycleCallback } from './lifecycle-manager.types'

// Note: Prototype methods are NOT exported to avoid conflicts with lifecycle-hooks
// They are attached to the prototype internally in lifecycle-manager.ts

