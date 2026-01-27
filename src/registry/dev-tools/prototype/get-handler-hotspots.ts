/**
 * Get handler hotspots (elements with most handlers)
 */

import type { IEventInspector } from '../event-inspector.types';

/**
 * Find elements with the most event handlers
 * Useful for identifying potential performance issues
 */
export const getHandlerHotspots = function (
  this: IEventInspector,
  limit: number = 10
): Array<[string, number]> {
  const delegator = this.appRoot.eventDelegator;
  const counts: Array<[string, number]> = [];

  // Count handlers per element
  for (const [elementId, elementHandlers] of delegator.handlers.entries()) {
    const count = elementHandlers.size;
    if (count > 0) {
      counts.push([elementId, count]);
    }
  }

  // Sort by count descending
  counts.sort((a, b) => b[1] - a[1]);

  // Return top N
  return counts.slice(0, limit);
};
