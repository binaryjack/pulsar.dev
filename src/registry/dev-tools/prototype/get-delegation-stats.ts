/**
 * Get event delegation statistics
 */

import type { IDelegationStats, IEventInspector } from '../event-inspector.types';

/**
 * Get comprehensive statistics about event delegation
 */
export const getDelegationStats = function (this: IEventInspector): IDelegationStats {
  const delegator = this.appRoot.eventDelegator;
  let totalHandlers = 0;
  let syntheticHandlers = 0;
  let nativeHandlers = 0;
  let capturePhaseHandlers = 0;
  let bubblingPhaseHandlers = 0;
  let onceHandlers = 0;
  const handlersByType: Record<string, number> = {};

  // Analyze all handlers
  for (const elementHandlers of delegator.handlers.values()) {
    for (const [eventType, handlerEntry] of elementHandlers.entries()) {
      totalHandlers++;

      // Count by event type
      handlersByType[eventType] = (handlersByType[eventType] || 0) + 1;

      // Count by options
      const { options } = handlerEntry;
      if (options?.synthetic) {
        syntheticHandlers++;
      } else {
        nativeHandlers++;
      }

      if (options?.capture) {
        capturePhaseHandlers++;
      } else {
        bubblingPhaseHandlers++;
      }

      if (options?.once) {
        onceHandlers++;
      }
    }
  }

  const uniqueEventTypes = Object.keys(handlersByType).length;

  return {
    totalHandlers,
    handlersByType,
    syntheticHandlers,
    nativeHandlers,
    capturePhaseHandlers,
    bubblingPhaseHandlers,
    onceHandlers,
    uniqueEventTypes,
  };
};
