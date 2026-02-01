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
  console.log('[REGISTRY.execute] START:', id, 'parentId:', parentId);

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
    const result = factory();
    console.log(
      '[REGISTRY.execute] RESULT:',
      id,
      'result:',
      result,
      'instanceof HTMLElement:',
      result instanceof HTMLElement
    );
    return result;
  } finally {
    // Always pop context, even if factory throws
    this._stack.pop();
  }
};
