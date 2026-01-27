/**
 * Get all handlers for specific element
 */

import type { IEventInspector, IHandlerInfo } from '../event-inspector.types';

/**
 * Get all event handlers registered for a specific element
 */
export const getHandlersByElement = function (
  this: IEventInspector,
  elementId: string
): IHandlerInfo[] {
  const handlers: IHandlerInfo[] = [];
  const delegator = this.appRoot.eventDelegator;

  // Get element's handler map
  const elementHandlers = delegator.handlers.get(elementId);
  if (!elementHandlers) {
    return handlers;
  }

  // Convert to handler info
  for (const [eventType, handlerEntry] of elementHandlers.entries()) {
    const { handler, options } = handlerEntry;

    // Try to get function source (name or code preview)
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
