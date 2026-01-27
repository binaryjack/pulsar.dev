/**
 * Destroy delegator and cleanup all listeners
 */

import type { IRegistryEventDelegator } from '../registry-event-delegator.types';

/**
 * Destroy delegator and cleanup all listeners
 */
export const destroy = function (this: IRegistryEventDelegator): void {
  // Stop all event delegation
  const eventTypes = Array.from(this.nativeListeners.keys());
  eventTypes.forEach((eventType) => {
    this.stopDelegation(eventType);
  });

  // Clear all handler registrations
  this.handlers.clear();
};
