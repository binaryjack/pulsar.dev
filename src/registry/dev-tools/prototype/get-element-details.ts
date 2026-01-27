/**
 * Get detailed information for specific element
 */

import type { IElementDetails, IRegistryInspector } from '../registry-inspector.types';

/**
 * Get detailed information about a specific registered element
 */
export const getElementDetails = function (
  this: IRegistryInspector,
  elementId: string
): IElementDetails | null {
  const registry = this.appRoot.registry;
  const entry = registry.get(elementId);

  if (!entry) {
    return null;
  }

  const element = entry.element;

  // Get metadata
  const metadata = registry.metadata.get(element);

  // Get attributes
  const attributes: Record<string, string> = {};
  for (let i = 0; i < element.attributes.length; i++) {
    const attr = element.attributes[i];
    attributes[attr.name] = attr.value;
  }

  // Get class list
  const classList = Array.from(element.classList);

  // Get child IDs
  const childIds = registry.getChildren(elementId);

  // Count event handlers
  const elementHandlers = this.appRoot.eventDelegator.handlers.get(elementId);
  const eventHandlerCount = elementHandlers ? elementHandlers.size : 0;

  return {
    elementId,
    element,
    tagName: element.tagName,
    type: entry.type,
    parentId: entry.parentId,
    childIds,
    metadata,
    attributes,
    classList,
    eventHandlerCount,
  };
};
