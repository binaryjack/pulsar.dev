import { IEventDelegator } from '../event-delegator.types';
/**
 * Checks if an element has a specific event listener
 */
export declare const hasListener: (this: IEventDelegator, element: HTMLElement, eventType: string) => boolean;
