/**
 * Registry Event Delegator Types
 * Global event delegation using Element Registry for O(1) target lookup
 */
import type { IApplicationRoot } from '../../bootstrap/application-root.interface';
import type { ISyntheticEvent } from '../../events/synthetic-event/synthetic-event.types';
export declare const SRegistryEventDelegator: unique symbol;
/**
 * Event handler function type
 * Can handle both native and synthetic events
 */
export type EventHandler = ((event: Event) => void) | ((event: ISyntheticEvent) => void);
/**
 * Event registration options
 */
export interface IEventOptions {
    /**
     * Use synthetic event wrapper (React-like)
     * Default: false (native events)
     */
    synthetic?: boolean;
    /**
     * Capture phase (vs bubbling)
     * Default: false (bubbling phase)
     */
    capture?: boolean;
    /**
     * Passive listener (improves scroll performance)
     * Default: false
     */
    passive?: boolean;
    /**
     * Auto-cleanup after first fire
     * Default: false
     */
    once?: boolean;
}
/**
 * Handler entry with options
 */
export interface IHandlerEntry {
    handler: EventHandler;
    options?: IEventOptions;
}
/**
 * Registry Event Delegator Interface
 * Provides global event delegation at ApplicationRoot level
 * using Element Registry for efficient target lookup
 */
export interface IRegistryEventDelegator {
    /**
     * Constructor signature
     */
    new (appRoot: IApplicationRoot): IRegistryEventDelegator;
    /**
     * ApplicationRoot instance
     */
    readonly appRoot: IApplicationRoot;
    /**
     * Event handler registry
     * Map<elementId, Map<eventType, handlerEntry>>
     */
    readonly handlers: Map<string, Map<string, IHandlerEntry>>;
    /**
     * Active native listeners for cleanup
     * Map<eventType, cleanup function>
     */
    readonly nativeListeners: Map<string, () => void>;
    /**
     * Register an event handler for an element
     * Returns cleanup function
     *
     * @param elementId - Element ID from registry
     * @param eventType - Event type (click, mousemove, etc.)
     * @param handler - Event handler function
     * @param options - Event options (synthetic, capture, passive, once)
     * @returns Cleanup function to unregister handler
     */
    registerHandler(elementId: string, eventType: string, handler: EventHandler, options?: IEventOptions): () => void;
    /**
     * Unregister a specific event handler
     *
     * @param elementId - Element ID from registry
     * @param eventType - Event type
     */
    unregisterHandler(elementId: string, eventType: string): void;
    /**
     * Unregister all handlers for an element
     *
     * @param elementId - Element ID from registry
     */
    unregisterElement(elementId: string): void;
    /**
     * Start delegating a specific event type
     * Adds native listener at ApplicationRoot level
     *
     * @param eventType - Event type to delegate
     */
    startDelegation(eventType: string): void;
    /**
     * Stop delegating a specific event type
     * Removes native listener from ApplicationRoot
     *
     * @param eventType - Event type to stop delegating
     */
    stopDelegation(eventType: string): void;
    /**
     * Destroy delegator and cleanup all listeners
     */
    destroy(): void;
}
