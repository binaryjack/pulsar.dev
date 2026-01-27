import { IEventDelegator } from './event-delegator.types';
/**
 * EventDelegator constructor function (prototype-based class)
 * Manages event listeners with automatic synthetic event wrapping and cleanup
 */
export declare const EventDelegator: {
    new (): IEventDelegator;
};
