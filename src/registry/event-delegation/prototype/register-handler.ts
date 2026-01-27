/**
 * Register event handler for an element
 */

import type {
  EventHandler,
  IEventOptions,
  IRegistryEventDelegator,
} from '../registry-event-delegator.types';

/**
 * Register an event handler for an element
 * Returns cleanup function
 */
export const registerHandler = function (
  this: IRegistryEventDelegator,
  elementId: string,
  eventType: string,
  handler: EventHandler,
  options?: IEventOptions
): () => void {
  // Ensure handler map exists for element
  if (!this.handlers.has(elementId)) {
    this.handlers.set(elementId, new Map());
  }

  const elementHandlers = this.handlers.get(elementId)!;

  // Store handler with options
  elementHandlers.set(eventType, { handler, options });

  // Start delegation for this event type (if not already started)
  this.startDelegation(eventType);

  // Return cleanup function
  return () => this.unregisterHandler(elementId, eventType);
};
