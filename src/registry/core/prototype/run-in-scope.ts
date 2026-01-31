import type { ICoreRegistry, IEffectOwner } from '../registry.types';

/**
 * Run a function within an effect owner scope
 * Pushes the owner onto the stack before execution
 */
export const runInScope = function (
  this: ICoreRegistry,
  owner: IEffectOwner,
  fn: () => void
): void {
  this._ownerStack.push(owner);

  try {
    fn();
  } finally {
    this._ownerStack.pop();
  }
};
