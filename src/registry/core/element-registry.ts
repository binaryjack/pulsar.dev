/**
 * Element Registry implementation
 * Prototype-based constructor for element registry
 */
import type { IElementEntry, IElementMetadata } from '../types';
import type { IElementRegistry } from './element-registry.types';

/**
 * Element Registry constructor
 * Creates a new registry instance with Map and WeakMap storage
 */
export const ElementRegistry = function (this: IElementRegistry) {
  // Primary registry storage
  Object.defineProperty(this, 'registry', {
    value: new Map<string, IElementEntry>(),
    writable: false,
    configurable: false,
    enumerable: false,
  });

  // Metadata storage (auto-GC)
  Object.defineProperty(this, 'metadata', {
    value: new WeakMap<HTMLElement, IElementMetadata>(),
    writable: false,
    configurable: false,
    enumerable: false,
  });

  // Parent-child tracking
  Object.defineProperty(this, 'parentChildren', {
    value: new Map<string, Set<string>>(),
    writable: false,
    configurable: false,
    enumerable: false,
  });
} as unknown as { new (): IElementRegistry };

// Import prototype methods
import { clear } from './prototype/clear';
import { get } from './prototype/get';
import { getChildren } from './prototype/get-children';
import { has } from './prototype/has';
import { register } from './prototype/register';
import { size } from './prototype/size';
import { unregister } from './prototype/unregister';
import { unregisterSubtree } from './prototype/unregister-subtree';

// Attach prototype methods
Object.assign(ElementRegistry.prototype, {
  register,
  unregister,
  get,
  has,
  getChildren,
  unregisterSubtree,
  clear,
  size,
});
