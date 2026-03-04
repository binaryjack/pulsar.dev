/**
 * Context system for Pulsar Framework
 * Call-stack based context with plain-ref fallback
 *
 * Key design:
 * - Sync call-stack (_syncStack): Provider pushes before children(), pops after.
 *   Fastest path — always correct for components rendered synchronously inside
 *   the Provider's children() execution.
 * - Plain mutable ref (_ref): written BEFORE children() so any component that
 *   mounts after the synchronous pass (reactive slots, Show, lazy lists) reads
 *   the correct value without registering a signal dependency.
 *
 * Why not a reactive signal:
 *   insert.ts sets $REGISTRY._currentEffect before calling accessor(). Any
 *   signal read inside that scope gets registered as a dependency. Using a
 *   signal for context would cause every reactive slot that calls useContext
 *   to re-evaluate whenever the context value changes — wrong semantics.
 *   Context is a static carrier; reactivity lives inside the value it delivers.
 */

/**
 * Global plain-ref registry — one mutable ref per context for post-render access.
 * No signal tracking, no subscription, no re-render on context change.
 */
const contextRefs = new Map<symbol, { current: unknown }>();

/**
 * Context object interface
 */
export interface IContext<TValue> {
  /**
   * Provider component that wraps children and provides context value
   */
  Provider: (props: { value: TValue; children: HTMLElement | (() => HTMLElement) }) => HTMLElement;

  /**
   * Default value for the context
   */
  defaultValue: TValue;

  /**
   * Internal context identifier (unique symbol)
   */
  _id: symbol;

  /**
   * Set context value (updates the plain ref — useful outside Provider)
   */
  setValue: (value: TValue) => void;

  /**
   * Internal synchronous call-stack.
   * Provider pushes before children(), pops after.
   * Do not read directly — use useContext().
   */
  _syncStack: TValue[];
}

export function createContext<TValue>(defaultValue: TValue): IContext<TValue> {
  const contextId = Symbol('Context');

  // Plain mutable ref — written before children(), read by any deferred consumer.
  const ref: { current: TValue } = { current: defaultValue };
  contextRefs.set(contextId, ref as { current: unknown });

  const contextObj: IContext<TValue> = {
    defaultValue,
    _id: contextId,
    _syncStack: [],
    Provider: null as any,
    setValue: null as any,
  };

  contextObj.Provider = ({
    value,
    children,
  }: {
    value: TValue;
    children: HTMLElement | (() => HTMLElement);
  }): HTMLElement => {
    // 1. Write ref BEFORE children() so any component that mounts during or
    //    after this render pass (reactive slots, deferred inserts) reads the
    //    correct value even when _syncStack has already been popped.
    ref.current = value;

    // 2. Push onto sync call-stack — synchronous useContext() calls inside
    //    children() take this faster path (no map lookup needed).
    contextObj._syncStack.push(value);

    // 3. Evaluate children synchronously.
    const evaluated = typeof children === 'function' ? children() : children;

    // 4. Pop immediately — synchronous children() execution is complete.
    contextObj._syncStack.pop();

    return evaluated as HTMLElement;
  };

  contextObj.setValue = (value: TValue) => {
    ref.current = value;
  };

  return contextObj;
}

export const useContext = function <TValue>(context: IContext<TValue>): TValue {
  // 1. Sync call-stack — fastest path, always correct during Provider's
  //    synchronous children() execution.
  if (context._syncStack.length > 0) {
    return context._syncStack[context._syncStack.length - 1];
  }

  // 2. Plain ref — correct for deferred mounts (reactive slots, Show, lazy
  //    lists) because it was written before children() ran. No signal
  //    dependency registered — context is a static carrier, not reactive.
  const ref = contextRefs.get(context._id);
  if (ref) {
    return ref.current as TValue;
  }

  // 3. No Provider has ever rendered — return default.
  return context.defaultValue;
};
