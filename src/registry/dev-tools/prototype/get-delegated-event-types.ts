/**
 * Get all delegated event types
 */

import type { IEventInspector } from '../event-inspector.types';

/**
 * Get all unique event types currently being delegated
 */
export const getDelegatedEventTypes = function (this: IEventInspector): string[] {
  const eventTypes = new Set<string>();
  const delegator = this.appRoot.eventDelegator;

  // Collect all unique event types
  for (const elementHandlers of delegator.handlers.values()) {
    for (const eventType of elementHandlers.keys()) {
      eventTypes.add(eventType);
    }
  }

  return Array.from(eventTypes).sort();
};
