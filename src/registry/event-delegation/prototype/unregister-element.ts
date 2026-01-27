/**
 * Unregister all handlers for an element
 */

import type { IRegistryEventDelegator } from '../registry-event-delegator.types';

/**
 * Unregister all handlers for an element
 */
export const unregisterElement = function (this: IRegistryEventDelegator, elementId: string): void {
  const elementHandlers = this.handlers.get(elementId);

  if (elementHandlers) {
    // Get all event types for this element
    const eventTypes = Array.from(elementHandlers.keys());

    // Unregister each handler (triggers cleanup logic)
    eventTypes.forEach((eventType) => {
      this.unregisterHandler(elementId, eventType);
    });
  }
};
