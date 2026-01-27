/**
 * Portal Registry Integration
 * Utilities for integrating Portal with Element Registry
 */

import { getCurrentAppRoot } from './app-root-context';
import { generateId } from './id-generator';
import type { IContextStackEntry } from './portal-context';
import type { IElementEntry } from './types/element-entry.types';
import { ElementType } from './types/element-type.enum';

/**
 * Portal registration context
 */
export interface IPortalRegistrationContext {
  /** Parent element ID (logical hierarchy) */
  parentId?: string;
  /** Physical parent element ID (DOM location) */
  physicalParentId?: string;
  /** Portal content element */
  content: HTMLElement;
  /** Portal target container */
  target: HTMLElement;
}

/**
 * Register portal content with the registry
 * Returns the generated element ID and cleanup function
 */
export function registerPortalContent(ctx: IPortalRegistrationContext): {
  elementId: string;
  cleanup: () => void;
} {
  const appRoot = getCurrentAppRoot();

  if (!appRoot) {
    console.warn('[Portal] No ApplicationRoot found, skipping registry');
    return {
      elementId: '',
      cleanup: () => {},
    };
  }

  // Generate ID for portal content
  const elementId = generateId(appRoot.idContext, ctx.parentId, undefined);

  // Create registry entry
  const entry: IElementEntry = {
    element: ctx.content,
    type: ElementType.PORTAL_CONTENT,
    parentId: ctx.parentId, // Logical parent
    physicalParent: ctx.physicalParentId, // Physical parent (where it's mounted)
    isPortalContent: true,
  };

  // Register with registry
  appRoot.registry.register(elementId, ctx.content, entry);

  // Push to context stack
  const stackEntry: IContextStackEntry = {
    elementId,
    element: ctx.content,
    parentId: ctx.parentId,
    physicalParentId: ctx.physicalParentId,
    isPortal: true,
  };
  appRoot.portalStack.push(stackEntry);

  // Return cleanup function
  const cleanup = () => {
    if (appRoot.registry.has(elementId)) {
      appRoot.registry.unregister(elementId);
    }
    appRoot.portalStack.pop();
  };

  return { elementId, cleanup };
}

/**
 * Get logical parent ID for current portal context
 * Walks up the DOM to find parent with __elementId
 */
export function getLogicalParentId(element: HTMLElement): string | undefined {
  let current: HTMLElement | null = element.parentElement;

  while (current) {
    // Check if element has __elementId property
    if ('__elementId' in current) {
      return (current as any).__elementId as string;
    }
    current = current.parentElement;
  }

  return undefined;
}

/**
 * Get physical parent ID for portal target
 * Checks if target has __elementId
 */
export function getPhysicalParentId(target: HTMLElement): string | undefined {
  if ('__elementId' in target) {
    return (target as any).__elementId as string;
  }
  return undefined;
}
