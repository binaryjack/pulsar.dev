/**
 * Register event handler for an element
 */
import type { EventHandler, IEventOptions, IRegistryEventDelegator } from '../registry-event-delegator.types';
/**
 * Register an event handler for an element
 * Returns cleanup function
 */
export declare const registerHandler: (this: IRegistryEventDelegator, elementId: string, eventType: string, handler: EventHandler, options?: IEventOptions) => () => void;
