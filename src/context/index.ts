/**
 * Context system for Pulsar Framework
 * Call-stack based context with reactive signal support
 *
 * Key design:
 * - Sync call-stack (_syncStack) on each context object: Provider pushes before
 *   children(), pops after. No module-level mutable state — survives HMR and
 *   any number of module re-evaluations.
 * - Reactive signal: updated by Provider for any reactive subscriptions that
 *   fire after the initial synchronous render (effects, re-renders).
 */

import { createSignal } from '../reactivity/signal/create-signal';

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
   * Set context value synchronously (before rendering)
   * Allows components to set context before children execute
   */
  setValue: (value: TValue) => void;

  /**
   * Internal synchronous call-stack.
   * Provider pushes before children(), pops after.
   * Do not read directly — use useContext().
   */
  _syncStack: TValue[];
}

/**
 * Global context registry — reactive signal per context for post-render access.
 */
const contextRegistry = new Map<symbol, [() => any, (value: any) => void]>();

export function createContext<TValue>(defaultValue: TValue): IContext<TValue> {
  const contextId = Symbol('Context');

  // Reactive signal — for effects and re-renders that run outside the
  // synchronous Provider→children() call chain.
  const [getContextValue, setContextValue] = createSignal<TValue>(defaultValue);
  contextRegistry.set(contextId, [getContextValue, setContextValue]);

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
    // 1. Push onto sync call-stack before children() — all synchronous
    //    useContext() calls inside children() see the correct value.
    contextObj._syncStack.push(value);

    // 2. Evaluate children BEFORE writing the signal.
    //    This prevents $REGISTRY.execute's reactive tracking scope from
    //    registering a dependency on the context signal, which would cause
    //    a deferred re-run of consumer components (e.g. TextField) after
    //    the stack is already popped.
    const evaluated = typeof children === 'function' ? children() : children;

    // 3. Pop immediately — synchronous children() execution is complete.
    contextObj._syncStack.pop();

    // 4. Update the reactive signal AFTER children() so that effects and
    //    subscriptions created inside children see the correct value on
    //    their next reactive re-run, without triggering an immediate
    //    re-schedule during this render pass.
    setContextValue(value);

    return evaluated as HTMLElement;
  };

  contextObj.setValue = (value: TValue) => {
    setContextValue(value);
  };

  return contextObj;
}

export const useContext = function <TValue>(context: IContext<TValue>): TValue {
  // 1. Sync call-stack — populated when we are inside a Provider's synchronous
  //    children() execution. This is always current regardless of scheduler
  //    batching because it uses a plain array push/pop.
  if (context._syncStack.length > 0) {
    return context._syncStack[context._syncStack.length - 1];
  }

  // 2. Reactive signal — for cases where useContext runs outside the
  //    Provider's synchronous call (effects, deferred renders, async code).
  const signal = contextRegistry.get(context._id);
  if (signal) {
    const [getValue] = signal as [() => TValue, (value: TValue) => void];
    return getValue();
  }

  // 3. No Provider in scope — return default.
  return context.defaultValue;
};
