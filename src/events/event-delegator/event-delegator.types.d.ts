import { EventHandler } from '../synthetic-event/synthetic-event.types';
export declare const SEventDelegator: unique symbol;
export interface IEventDelegator {
    new (): IEventDelegator;
    readonly handlers: WeakMap<HTMLElement, Map<string, EventHandler>>;
    readonly cleanupFunctions: WeakMap<HTMLElement, Map<string, () => void>>;
    addEventListener: (element: HTMLElement, eventType: string, handler: EventHandler, options?: AddEventListenerOptions) => () => void;
    removeEventListener: (element: HTMLElement, eventType: string) => void;
    removeAllListeners: (element: HTMLElement) => void;
    hasListener: (element: HTMLElement, eventType: string) => boolean;
}
