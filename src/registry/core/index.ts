/**
 * Core registry exports
 */

// New Registry Pattern Implementation
import { CoreRegistry } from './registry';
import type { ICoreRegistry } from './registry.types';

/**
 * Global Registry Instance ($REGISTRY)
 * Singleton instance for component lifecycle and state management
 */
export const $REGISTRY: ICoreRegistry = new CoreRegistry();

export { CoreRegistry } from './registry';
export type {
  IComponentContext,
  ICoreRegistry,
  IEffectOwner,
  WireDisposer,
  WireSet,
} from './registry.types';

// Legacy exports (for backward compatibility during migration)
export { ElementRegistry } from './element-registry';
export type { IElementRegistry } from './element-registry.types';
