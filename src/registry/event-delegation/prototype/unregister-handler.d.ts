/**
 * Unregister event handler for an element
 */
import type { IRegistryEventDelegator } from '../registry-event-delegator.types';
/**
 * Unregister a specific event handler
 */
export declare const unregisterHandler: (this: IRegistryEventDelegator, elementId: string, eventType: string) => void;
