/**
 * Registry Event Delegator
 * Global event delegation using Element Registry for O(1) target lookup
 */

import type { IApplicationRoot } from '../../bootstrap/application-root.interface';
import type { IRegistryEventDelegator } from './registry-event-delegator.types';

// Import prototype methods
import { destroy } from './prototype/destroy.js';
import { registerHandler } from './prototype/register-handler.js';
import { startDelegation } from './prototype/start-delegation.js';
import { stopDelegation } from './prototype/stop-delegation.js';
import { unregisterElement } from './prototype/unregister-element.js';
import { unregisterHandler } from './prototype/unregister-handler.js';

/**
 * RegistryEventDelegator constructor function (prototype-based class)
 * Manages global event delegation at ApplicationRoot level
 */
export const RegistryEventDelegator = function (
  this: IRegistryEventDelegator,
  appRoot: IApplicationRoot
) {
  // Store ApplicationRoot reference
  Object.defineProperty(this, 'appRoot', {
    value: appRoot,
    writable: false,
    configurable: false,
    enumerable: true,
  });

  // Event handler registry
  // Map<elementId, Map<eventType, handlerEntry>>
  Object.defineProperty(this, 'handlers', {
    value: new Map(),
    writable: false,
    configurable: false,
    enumerable: false,
  });

  // Active native listeners for cleanup
  // Map<eventType, cleanup function>
  Object.defineProperty(this, 'nativeListeners', {
    value: new Map(),
    writable: false,
    configurable: false,
    enumerable: false,
  });
} as unknown as {
  new (appRoot: IApplicationRoot): IRegistryEventDelegator;
};

// Attach prototype methods
Object.assign(RegistryEventDelegator.prototype, {
  registerHandler,
  unregisterHandler,
  unregisterElement,
  startDelegation,
  stopDelegation,
  destroy,
});
