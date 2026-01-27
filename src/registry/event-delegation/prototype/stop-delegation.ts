/**
 * Stop delegating a specific event type
 */

import type { IRegistryEventDelegator } from '../registry-event-delegator.types';

/**
 * Stop delegating a specific event type
 * Removes native listener from ApplicationRoot
 */
export const stopDelegation = function (this: IRegistryEventDelegator, eventType: string): void {
  const cleanup = this.nativeListeners.get(eventType);

  if (cleanup) {
    cleanup();
    this.nativeListeners.delete(eventType);
  }
};
