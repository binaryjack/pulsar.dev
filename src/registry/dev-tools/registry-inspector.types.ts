/**
 * Registry Inspector Types
 * Provides read-only access to Element Registry for debugging
 */

import type { IApplicationRoot } from '../../bootstrap/application-root.interface';
import type { IElementMetadata } from '../types';
import { ElementType } from '../types';

export const SRegistryInspector = Symbol.for('IRegistryInspector');

/**
 * Element tree node for hierarchy visualization
 */
export interface IElementTreeNode {
  /** Unique element ID */
  elementId: string;
  /** HTML tag name */
  tagName: string;
  /** Element type (static/dynamic/portal/component) */
  type: ElementType;
  /** Parent element ID if exists */
  parentId?: string;
  /** Child nodes */
  children: IElementTreeNode[];
  /** Metadata summary */
  metadata?: {
    effectCount: number;
    signalCount: number;
    hasCleanup: boolean;
    renderCount?: number;
  };
}

/**
 * Detailed element information
 */
export interface IElementDetails {
  /** Unique element ID */
  elementId: string;
  /** Actual DOM element reference */
  element: HTMLElement;
  /** HTML tag name */
  tagName: string;
  /** Element type */
  type: ElementType;
  /** Parent element ID */
  parentId?: string;
  /** Array of child element IDs */
  childIds: string[];
  /** Element metadata (effects, signals, cleanup) */
  metadata?: IElementMetadata;
  /** HTML attributes */
  attributes: Record<string, string>;
  /** CSS classes */
  classList: string[];
  /** Number of event handlers attached */
  eventHandlerCount: number;
}

/**
 * Registry statistics summary
 */
export interface IRegistryStats {
  /** Total registered elements */
  totalElements: number;
  /** Elements grouped by type */
  elementsByType: Record<string, number>;
  /** Elements without parents (potential leaks) */
  orphanedElements: number;
  /** Maximum nesting depth */
  deepestNesting: number;
  /** Average number of children per parent */
  averageChildrenPerParent: number;
  /** Estimated memory usage in bytes */
  memoryEstimate: number;
}

/**
 * Search query for finding elements
 */
export interface ISearchQuery {
  /** Filter by tag name */
  tagName?: string;
  /** Filter by element type */
  type?: ElementType;
  /** Filter by having specific attribute */
  attribute?: string;
  /** Filter by CSS class */
  className?: string;
  /** Filter by having event handlers */
  hasEventHandlers?: boolean;
  /** Filter by having effects */
  hasEffects?: boolean;
}

/**
 * Registry Inspector
 * Provides read-only access to Element Registry for debugging
 */
export interface IRegistryInspector {
  /**
   * Constructor signature
   */
  new (appRoot: IApplicationRoot): IRegistryInspector;

  /**
   * Reference to ApplicationRoot
   */
  readonly appRoot: IApplicationRoot;

  /**
   * Get hierarchical tree of registered elements
   * Returns root elements (no parent) with nested children
   *
   * @returns Array of root element tree nodes
   */
  getElementTree(): IElementTreeNode[];

  /**
   * Get detailed information for specific element
   *
   * @param elementId - Element ID to inspect
   * @returns Element details or null if not found
   */
  getElementDetails(elementId: string): IElementDetails | null;

  /**
   * Find elements without parents
   * These might indicate memory leaks or improper cleanup
   *
   * @returns Array of orphaned elements
   */
  getOrphanedElements(): IElementDetails[];

  /**
   * Get registry statistics summary
   *
   * @returns Statistics about registry state
   */
  getStats(): IRegistryStats;

  /**
   * Search for elements matching criteria
   *
   * @param query - Search criteria
   * @returns Array of matching elements
   */
  searchElements(query: ISearchQuery): IElementDetails[];

  /**
   * Calculate nesting depth for an element
   *
   * @param elementId - Element ID
   * @returns Depth level (0 for root)
   */
  getDepth(elementId: string): number;

  /**
   * Get full path from root to element
   *
   * @param elementId - Element ID
   * @returns Array of element IDs from root to target
   */
  getPath(elementId: string): string[];
}
