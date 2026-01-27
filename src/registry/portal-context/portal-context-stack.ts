/**
 * Portal Context Stack Implementation
 */

import type { IContextStackEntry, IPortalContextStack } from './portal-context-stack.types';

/**
 * PortalContextStack constructor
 */
export const PortalContextStack = function (this: IPortalContextStack) {
  Object.defineProperty(this, 'stack', {
    value: [],
    writable: false,
    enumerable: true,
  });
} as unknown as { new (): IPortalContextStack };

/**
 * Push context entry
 */
function push(this: IPortalContextStack, entry: IContextStackEntry): void {
  (this.stack as IContextStackEntry[]).push(entry);
}

/**
 * Pop context entry
 */
function pop(this: IPortalContextStack): IContextStackEntry | undefined {
  return (this.stack as IContextStackEntry[]).pop();
}

/**
 * Get current context (top of stack)
 */
function current(this: IPortalContextStack): IContextStackEntry | undefined {
  return this.stack[this.stack.length - 1];
}

/**
 * Get parent context
 */
function parent(this: IPortalContextStack): IContextStackEntry | undefined {
  const length = this.stack.length;
  return length >= 2 ? this.stack[length - 2] : undefined;
}

/**
 * Find context entry by element ID
 */
function find(this: IPortalContextStack, elementId: string): IContextStackEntry | undefined {
  return this.stack.find((entry) => entry.elementId === elementId);
}

/**
 * Get logical parent chain for element
 * Returns chain from root to element (inclusive)
 */
function getLogicalChain(this: IPortalContextStack, elementId: string): IContextStackEntry[] {
  const chain: IContextStackEntry[] = [];

  // Find the target entry
  const targetEntry = this.find(elementId);
  if (!targetEntry) {
    return chain;
  }

  // Build chain by following parentId links
  let currentEntry: IContextStackEntry | undefined = targetEntry;

  while (currentEntry) {
    chain.unshift(currentEntry); // Add to front (root to element)

    if (currentEntry.parentId) {
      currentEntry = this.find(currentEntry.parentId);
    } else {
      break;
    }
  }

  return chain;
}

/**
 * Clear the stack
 */
function clear(this: IPortalContextStack): void {
  (this.stack as IContextStackEntry[]).length = 0;
}

/**
 * Get stack size
 */
function size(this: IPortalContextStack): number {
  return this.stack.length;
}

// Attach prototype methods
Object.assign(PortalContextStack.prototype, {
  push,
  pop,
  current,
  parent,
  find,
  getLogicalChain,
  clear,
  size,
});
