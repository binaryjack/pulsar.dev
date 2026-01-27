/**
 * Event Inspector Types
 * Provides visibility into event delegation system
 */

import type { IApplicationRoot } from '../../bootstrap/application-root.interface';

/**
 * Handler information for debugging
 */
export interface IHandlerInfo {
  /** Element ID this handler is registered to */
  elementId: string;
  /** Event type (e.g., 'click', 'input') */
  eventType: string;
  /** Using synthetic event wrapper */
  isSynthetic: boolean;
  /** Capture phase listener */
  isCapture: boolean;
  /** Passive listener (scroll performance) */
  isPassive: boolean;
  /** Auto-cleanup after first fire */
  isOnce: boolean;
  /** Handler function source code or name */
  handlerSource: string;
}

/**
 * Event delegation statistics
 */
export interface IDelegationStats {
  /** Total number of registered handlers */
  totalHandlers: number;
  /** Handlers grouped by event type */
  handlersByType: Record<string, number>;
  /** Handlers using synthetic events */
  syntheticHandlers: number;
  /** Handlers using native events */
  nativeHandlers: number;
  /** Handlers in capture phase */
  capturePhaseHandlers: number;
  /** Handlers in bubbling phase */
  bubblingPhaseHandlers: number;
  /** One-time handlers */
  onceHandlers: number;
  /** Unique event types being delegated */
  uniqueEventTypes: number;
}

/**
 * Event Inspector
 * Provides visibility into event delegation system
 */
export interface IEventInspector {
  /**
   * Constructor signature
   */
  new (appRoot: IApplicationRoot): IEventInspector;

  /**
   * Reference to ApplicationRoot
   */
  readonly appRoot: IApplicationRoot;

  /**
   * Get all handlers for specific element
   *
   * @param elementId - Element ID to inspect
   * @returns Array of handler information
   */
  getHandlersByElement(elementId: string): IHandlerInfo[];

  /**
   * Get all handlers for specific event type
   *
   * @param eventType - Event type to inspect (e.g., 'click')
   * @returns Array of handler information
   */
  getHandlersByType(eventType: string): IHandlerInfo[];

  /**
   * Get all unique event types being delegated
   *
   * @returns Array of event type names
   */
  getDelegatedEventTypes(): string[];

  /**
   * Get event delegation statistics
   *
   * @returns Statistics summary
   */
  getDelegationStats(): IDelegationStats;

  /**
   * Test if element can receive specific event
   *
   * @param elementId - Element ID
   * @param eventType - Event type
   * @returns true if element has handler for this event
   */
  canReceiveEvent(elementId: string, eventType: string): boolean;

  /**
   * Get all handlers across entire application
   *
   * @returns Array of all handler information
   */
  getAllHandlers(): IHandlerInfo[];

  /**
   * Get elements with most event handlers (hotspots)
   *
   * @param limit - Maximum number of results
   * @returns Array of [elementId, handlerCount] tuples
   */
  getHandlerHotspots(limit?: number): Array<[string, number]>;
}
