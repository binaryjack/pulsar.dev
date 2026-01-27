import { EventHandler } from '../../synthetic-event/synthetic-event.types';
import { IEventDelegator } from '../event-delegator.types';
/**
 * Adds an event listener to an element with synthetic event wrapping
 * Returns a cleanup function
 */
export declare const addEventListener: (this: IEventDelegator, element: HTMLElement, eventType: string, handler: EventHandler, options?: AddEventListenerOptions) => () => void;
