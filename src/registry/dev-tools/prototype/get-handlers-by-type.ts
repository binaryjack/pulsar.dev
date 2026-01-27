/**
 * Get all handlers for specific event type
 */

import type { IEventInspector, IHandlerInfo } from '../event-inspector.types';

/**
 * Get all event handlers for a specific event type across all elements
 */
export const getHandlersByType = function (
  this: IEventInspector,
  eventType: string
): IHandlerInfo[] {
  const handlers: IHandlerInfo[] = [];
  const delegator = this.appRoot.eventDelegator;

  // Search through all elements
  for (const [elementId, elementHandlers] of delegator.handlers.entries()) {
    const handlerEntry = elementHandlers.get(eventType);
    if (!handlerEntry) {
      continue;
    }

    const { handler, options } = handlerEntry;

    // Get function source
    let handlerSource = handler.name || 'anonymous';
    if (!handler.name) {
      const fnStr = handler.toString();
      handlerSource = fnStr.length > 50 ? fnStr.substring(0, 47) + '...' : fnStr;
    }

    handlers.push({
      elementId,
      eventType,
      isSynthetic: options?.synthetic || false,
      isCapture: options?.capture || false,
      isPassive: options?.passive || false,
      isOnce: options?.once || false,
      handlerSource,
    });
  }

  return handlers;
};
