/**
 * Test if element can receive event
 */

import type { IEventInspector } from '../event-inspector.types';

/**
 * Check if an element has a handler registered for specific event type
 */
export const canReceiveEvent = function (
  this: IEventInspector,
  elementId: string,
  eventType: string
): boolean {
  const delegator = this.appRoot.eventDelegator;
  const elementHandlers = delegator.handlers.get(elementId);

  if (!elementHandlers) {
    return false;
  }

  return elementHandlers.has(eventType);
};
