/**
 * Registry Event Delegation Module
 * Export all event delegation components
 */

// Export constructor
export { RegistryEventDelegator } from './registry-event-delegator';

// Export types
export { SRegistryEventDelegator } from './registry-event-delegator.types';
export type {
  EventHandler,
  IEventOptions,
  IHandlerEntry,
  IRegistryEventDelegator,
} from './registry-event-delegator.types';

// Export prototype methods (for testing)
export { destroy } from './prototype/destroy.js';
export { registerHandler } from './prototype/register-handler.js';
export { startDelegation } from './prototype/start-delegation.js';
export { stopDelegation } from './prototype/stop-delegation.js';
export { unregisterElement } from './prototype/unregister-element.js';
export { unregisterHandler } from './prototype/unregister-handler.js';
