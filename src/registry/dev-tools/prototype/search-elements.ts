/**
 * Search for elements matching criteria
 */

import type {
  IElementDetails,
  IRegistryInspector,
  ISearchQuery,
} from '../registry-inspector.types';

/**
 * Search registry for elements matching query criteria
 */
export const searchElements = function (
  this: IRegistryInspector,
  query: ISearchQuery
): IElementDetails[] {
  const registry = this.appRoot.registry;
  const results: IElementDetails[] = [];

  // Search through all registered elements
  for (const [elementId] of Array.from(registry.registry.entries())) {
    const details = this.getElementDetails(elementId);
    if (!details) {
      continue;
    }

    // Apply filters
    let matches = true;

    // Filter by tag name
    if (query.tagName && details.tagName.toLowerCase() !== query.tagName.toLowerCase()) {
      matches = false;
    }

    // Filter by type
    if (query.type !== undefined && details.type !== query.type) {
      matches = false;
    }

    // Filter by attribute
    if (query.attribute && !details.attributes[query.attribute]) {
      matches = false;
    }

    // Filter by class name
    if (query.className && !details.classList.includes(query.className)) {
      matches = false;
    }

    // Filter by event handlers
    if (query.hasEventHandlers !== undefined) {
      const hasHandlers = details.eventHandlerCount > 0;
      if (query.hasEventHandlers !== hasHandlers) {
        matches = false;
      }
    }

    // Filter by effects
    if (query.hasEffects !== undefined) {
      const hasEffects = details.metadata?.effects && details.metadata.effects.size > 0;
      if (query.hasEffects !== !!hasEffects) {
        matches = false;
      }
    }

    if (matches) {
      results.push(details);
    }
  }

  return results;
};
