/**
 * Event Inspector
 * Provides visibility into event delegation system
 */

import type { IApplicationRoot } from '../../bootstrap/application-root.interface';
import type { IEventInspector } from './event-inspector.types';

// Import prototype methods
import { canReceiveEvent } from './prototype/can-receive-event';
import { getAllHandlers } from './prototype/get-all-handlers';
import { getDelegatedEventTypes } from './prototype/get-delegated-event-types';
import { getDelegationStats } from './prototype/get-delegation-stats';
import { getHandlerHotspots } from './prototype/get-handler-hotspots';
import { getHandlersByElement } from './prototype/get-handlers-by-element';
import { getHandlersByType } from './prototype/get-handlers-by-type';

/**
 * EventInspector constructor function (prototype-based)
 * Provides debugging and visualization tools for event delegation
 */
export const EventInspector = function (this: IEventInspector, appRoot: IApplicationRoot) {
  // Store ApplicationRoot reference
  Object.defineProperty(this, 'appRoot', {
    value: appRoot,
    writable: false,
    enumerable: true,
  });
} as unknown as { new (appRoot: IApplicationRoot): IEventInspector };

// Attach prototype methods
EventInspector.prototype.getHandlersByElement = getHandlersByElement;
EventInspector.prototype.getHandlersByType = getHandlersByType;
EventInspector.prototype.getDelegatedEventTypes = getDelegatedEventTypes;
EventInspector.prototype.getDelegationStats = getDelegationStats;
EventInspector.prototype.canReceiveEvent = canReceiveEvent;
EventInspector.prototype.getAllHandlers = getAllHandlers;
EventInspector.prototype.getHandlerHotspots = getHandlerHotspots;

// Type-only exports
export type { IDelegationStats, IEventInspector, IHandlerInfo } from './event-inspector.types';
