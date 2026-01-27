/**
 * Unregister event handler for an element
 */

import type { IRegistryEventDelegator } from '../registry-event-delegator.types';

/**
 * Unregister a specific event handler
 */
export const unregisterHandler = function (
  this: IRegistryEventDelegator,
  elementId: string,
  eventType: string
): void {
  const elementHandlers = this.handlers.get(elementId);

  if (elementHandlers) {
    elementHandlers.delete(eventType);

    // If element has no more handlers, remove element entry
    if (elementHandlers.size === 0) {
      this.handlers.delete(elementId);
    }
  }

  // Check if any elements still listen to this event type
  let hasListeners = false;
  for (const handlers of this.handlers.values()) {
    if (handlers.has(eventType)) {
      hasListeners = true;
      break;
    }
  }

  // If no elements listen to this event type, stop delegation
  if (!hasListeners) {
    this.stopDelegation(eventType);
  }
};
