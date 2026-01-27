/**
 * Registry Inspector
 * Provides read-only access to Element Registry for debugging
 */

import type { IApplicationRoot } from '../../bootstrap/application-root.interface';
import type { IRegistryInspector } from './registry-inspector.types';

// Import prototype methods
import { getDepth } from './prototype/get-depth';
import { getElementDetails } from './prototype/get-element-details';
import { getElementTree } from './prototype/get-element-tree';
import { getOrphanedElements } from './prototype/get-orphaned-elements';
import { getPath } from './prototype/get-path';
import { getStats } from './prototype/get-stats';
import { searchElements } from './prototype/search-elements';

/**
 * RegistryInspector constructor function (prototype-based)
 * Provides debugging and visualization tools for Element Registry
 */
export const RegistryInspector = function (this: IRegistryInspector, appRoot: IApplicationRoot) {
  // Store ApplicationRoot reference
  Object.defineProperty(this, 'appRoot', {
    value: appRoot,
    writable: false,
    enumerable: true,
  });
} as unknown as { new (appRoot: IApplicationRoot): IRegistryInspector };

// Attach prototype methods
RegistryInspector.prototype.getElementTree = getElementTree;
RegistryInspector.prototype.getElementDetails = getElementDetails;
RegistryInspector.prototype.getOrphanedElements = getOrphanedElements;
RegistryInspector.prototype.getStats = getStats;
RegistryInspector.prototype.searchElements = searchElements;
RegistryInspector.prototype.getDepth = getDepth;
RegistryInspector.prototype.getPath = getPath;
