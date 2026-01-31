import type { IComponentContext, ICoreRegistry } from '../registry.types';

/**
 * Execute a component factory within a tracked context
 * Creates a new component context and pushes it onto the stack
 */
export const execute = function <T>(
  this: ICoreRegistry,
  id: string,
  parentId: string | null,
  factory: () => T
): T {
  // Create component context
  const context: IComponentContext = {
    id,
    parentId,
    provides: Object.create(null),
  };

  // Store instance
  this._instances.set(id, context);

  // Push onto stack
  this._stack.push(context);

  try {
    // Execute factory in context
    return factory();
  } finally {
    // Always pop context, even if factory throws
    this._stack.pop();
  }
};
