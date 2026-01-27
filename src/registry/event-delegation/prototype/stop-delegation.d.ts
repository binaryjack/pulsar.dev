/**
 * Stop delegating a specific event type
 */
import type { IRegistryEventDelegator } from '../registry-event-delegator.types';
/**
 * Stop delegating a specific event type
 * Removes native listener from ApplicationRoot
 */
export declare const stopDelegation: (this: IRegistryEventDelegator, eventType: string) => void;
