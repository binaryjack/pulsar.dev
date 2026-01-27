/**
 * Application Root
 * Represents a mounting point for the application
 */

import { IServiceManager } from '../di/service-manager.types';
import { ElementRegistry } from '../registry/core';
import { RegistryEventDelegator } from '../registry/event-delegation';
import { createIdContext } from '../registry/id-generator';
import { PortalContextStack } from '../registry/portal-context';
import '../registry/types/html-element.augment';
import { IApplicationRootInternal } from './application-root-internal.interface';

/**
 * ApplicationRoot constructor
 */
export const ApplicationRoot = function (
  this: IApplicationRootInternal,
  rootElement: HTMLElement,
  onMount?: (element: HTMLElement) => void,
  onUnmount?: () => void,
  onError?: (error: Error) => void,
  serviceManager?: IServiceManager
) {
  Object.defineProperty(this, 'rootElement', {
    value: rootElement,
    writable: false,
    enumerable: true,
  });

  // Initialize element registry (per-app-root)
  Object.defineProperty(this, 'registry', {
    value: new ElementRegistry(),
    writable: false,
    enumerable: true,
  });

  // Initialize ID generation context (per-app-root)
  Object.defineProperty(this, 'idContext', {
    value: createIdContext(),
    writable: false,
    enumerable: true,
  });
  // Initialize portal context stack (per-app-root)
  Object.defineProperty(this, 'portalStack', {
    value: new PortalContextStack(),
    writable: false,
    enumerable: true,
  });

  // Initialize event delegator (per-app-root)
  // Note: Pass 'this' which is the ApplicationRoot instance
  Object.defineProperty(this, 'eventDelegator', {
    value: new RegistryEventDelegator(this),
    writable: false,
    enumerable: true,
  });

  Object.defineProperty(this, 'serviceManager', {
    value: serviceManager,
    writable: false,
    enumerable: true,
  });

  Object.defineProperty(this, 'onMount', {
    value: onMount,
    writable: false,
    enumerable: true,
  });

  Object.defineProperty(this, 'onUnmount', {
    value: onUnmount,
    writable: false,
    enumerable: true,
  });

  Object.defineProperty(this, 'onError', {
    value: onError,
    writable: false,
    enumerable: true,
  });

  // Initialize MutationObserver for automatic cleanup of removed elements
  Object.defineProperty(this, 'cleanupObserver', {
    value: null,
    writable: true,
    enumerable: false,
  });

  // Set up MutationObserver to watch for removed nodes
  this.cleanupObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.removedNodes.forEach((node) => {
        if (node instanceof HTMLElement && node.__elementId) {
          // Automatically clean up event handlers for removed elements
          this.eventDelegator.unregisterElement(node.__elementId);
          // Also unregister from registry to prevent memory leaks
          this.registry.unregister(node.__elementId);
        }
      });
    });
  });

  // Start observing the root element
  this.cleanupObserver.observe(rootElement, {
    childList: true,
    subtree: true,
  });

  Object.defineProperty(this, '_mountedComponent', {
    value: null,
    writable: true,
    enumerable: false,
  });

  Object.defineProperty(this, '_isMounted', {
    value: false,
    writable: true,
    enumerable: false,
  });
} as unknown as {
  new (
    rootElement: HTMLElement,
    onMount?: (element: HTMLElement) => void,
    onUnmount?: () => void,
    onError?: (error: Error) => void,
    serviceManager?: IServiceManager
  ): IApplicationRootInternal;
};
