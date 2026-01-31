import type { ICoreRegistry, IEffectOwner } from '../registry.types';

/**
 * Get the current effect owner from the stack
 */
export const getCurrentOwner = function (this: ICoreRegistry): IEffectOwner | undefined {
  return this._ownerStack[this._ownerStack.length - 1];
};
