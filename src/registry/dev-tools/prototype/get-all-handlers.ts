/**
 * Get all handlers across entire application
 */

import type { IEventInspector, IHandlerInfo } from '../event-inspector.types';

/**
 * Get all event handlers registered in the application
 */
export const getAllHandlers = function (this: IEventInspector): IHandlerInfo[] {
  const handlers: IHandlerInfo[] = [];
  const delegator = this.appRoot.eventDelegator;

  // Iterate through all elements and their handlers
  for (const [elementId, elementHandlers] of delegator.handlers.entries()) {
    for (const [eventType, handlerEntry] of elementHandlers.entries()) {
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
  }

  return handlers;
};
