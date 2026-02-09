/**
 * Application root interface
 */

import { IServiceManager } from '../di/service-manager.types';
import type { ILifecycleOrchestrator } from '../lifecycle/lifecycle-orchestrator';
import type { IElementRegistry } from '../registry/core';
import type { IRegistryEventDelegator } from '../registry/event-delegation';
import type { IIdGenerationContext } from '../registry/id-generator';
import type { IPortalContextStack } from '../registry/portal-context';

export interface IApplicationRoot {
  /**
   * Root DOM element
   */
  readonly rootElement: HTMLElement;

  /**
   * Element registry instance (per-app-root)
   */
  readonly registry: IElementRegistry;

  /**
   * ID generation context (per-app-root)
   */
  readonly idContext: IIdGenerationContext;

  /**
   * Portal context stack (per-app-root)
   */
  readonly portalStack: IPortalContextStack;

  /**
   * Event delegator (per-app-root)
   */
  readonly eventDelegator: IRegistryEventDelegator;

  /**
   * MutationObserver for automatic cleanup (internal)
   */
  cleanupObserver: MutationObserver | null;

  /**Lifecycle orchestrator for coordinating mount/unmount phases
   */
  readonly lifecycleOrchestrator: ILifecycleOrchestrator;

  /**
   *
   * Service manager instance (if configured)
   */
  readonly serviceManager?: IServiceManager;

  /**
   * Mount a component to the root
   * Returns a Promise to ensure proper sequencing
   */
  mount(component: HTMLElement): Promise<void>;

  /**
   * Unmount the current component
   * Returns a Promise to ensure proper cleanup sequencing
   */
  unmount(): Promise<void>;

  /**
   * Error handler
   */
  readonly onError?: (error: Error) => void;

  /**
   * Mount callback
   */
  readonly onMount?: (element: HTMLElement) => void;

  /**
   * Unmount callback
   */
  readonly onUnmount?: () => void;
}
