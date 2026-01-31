import type { IComponentContext, ICoreRegistry } from '../registry.types';

/**
 * Get the current component context from the stack
 */
export const getCurrent = function (this: ICoreRegistry): IComponentContext | undefined {
  return this._stack[this._stack.length - 1];
};
