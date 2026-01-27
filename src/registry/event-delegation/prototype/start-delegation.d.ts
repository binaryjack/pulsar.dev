/**
 * Start delegating a specific event type
 */
import '../../../registry/types/html-element.augment';
import type { IRegistryEventDelegator } from '../registry-event-delegator.types';
/**
 * Start delegating a specific event type
 * Adds native listener at ApplicationRoot level
 */
export declare const startDelegation: (this: IRegistryEventDelegator, eventType: string) => void;
