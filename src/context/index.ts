/**
 * Context system for Pulsar Framework
 * Registry-based context API with stack support for nested providers
 *
 * Key features:
 * - Wait list pattern: children register first, Provider notifies when it arrives
 * - No deferred children needed (registry available immediately)
 * - Supports nested providers (same context used multiple times)
 * - Simple cleanup via useEffect
 */

import { useEffect } from '../hooks/use-effect';
import { createSignal } from '../reactivity/signal/create-signal';

/**
 * Context object interface
 */
export interface IContext<TValue> {
  /**
   * Provider component that wraps children and provides context value
   */
  Provider: (props: { value: TValue; children: HTMLElement }) => HTMLElement;

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
}

/**
 * Global context registry - stores current active signal for each context
 * Stores tuple of [getter, setter] for each context
 */
const contextRegistry = new Map<symbol, [() => any, (value: any) => void]>();

/**
 * Context stack - tracks nested providers for the same context
 * Enables proper cleanup when inner providers unmount
 */
const contextStack = new Map<symbol, unknown[]>();

/**
 * Wait list pattern - tracks components waiting for context that hasn't arrived yet
 * When Provider arrives, it notifies all waiting soldiers (children)
 * Each soldier gets a callback to receive the value when commandant arrives
 */
const contextWaitList = new Map<symbol, Set<(value: unknown) => void>>();

/**
 * Creates a new context
 * @param defaultValue - Default value when no provider is found
 * @returns Context object with Provider component
 *
 * @example
 * ```tsx
 * interface IAppContext {
 *     appName: string
 *     version: string
 * }
 *
 * const AppContext = createContext({
 *     appName: 'My App',
 *     version: '1.0.0'
 * })
 *
 * // Use in component
 * <AppContext.Provider value={{ appName: 'Todo App', version: '2.0.0' }}>
 *     {children}
 * </AppContext.Provider>
 * ```
 */
export function createContext<TValue>(defaultValue: TValue): IContext<TValue> {
  const contextId = Symbol('Context');

  // Create a signal to hold the context value
  // This allows reactive updates when Provider arrives
  const [getContextValue, setContextValue] = createSignal<TValue>(defaultValue);

  // REGISTER THE SIGNAL IMMEDIATELY!
  // Soldiers can now find the signal even if commandant hasn't arrived yet
  contextRegistry.set(contextId, [getContextValue, setContextValue]);

  const Provider = ({
    value,
    children,
  }: {
    value: TValue;
    children: HTMLElement | (() => HTMLElement);
  }): HTMLElement => {
    // COMMANDANT ARRIVES!
    // Update context value with provider's value
    // Stack management for nested providers
    if (!contextStack.has(contextId)) {
      contextStack.set(contextId, []);
    }
    contextStack.get(contextId)!.push(value);

    // Update the signal value - this will trigger all reactive dependencies!
    setContextValue(value);

    // NOTIFY ALL WAITING SOLDIERS!
    // Get all soldiers waiting for this commandant
    const waitingList = contextWaitList.get(contextId);
    if (waitingList && waitingList.size > 0) {
      // Notify each soldier that commandant has arrived with the value
      waitingList.forEach((notifySoldier) => {
        notifySoldier(value);
      });
      // Clear the wait list - soldiers have been notified
      contextWaitList.delete(contextId);
    }

    // Cleanup when component unmounts
    useEffect(() => {
      return () => {
        const stack = contextStack.get(contextId);
        if (stack && stack.length > 0) {
          stack.pop();

          // Restore previous provider's value
          if (stack.length > 0) {
            const previousValue = stack[stack.length - 1] as TValue;
            setContextValue(previousValue);
          } else {
            // No more providers, restore default value
            setContextValue(defaultValue);
          }
        }
      };
    }, [value]);

    // Support both deferred and immediate children evaluation
    // If children is a function, evaluate it AFTER setting context value
    // This ensures useContext() calls read the correct value
    const evaluatedChildren = typeof children === 'function' ? children() : children;
    return evaluatedChildren as HTMLElement;
  };

  // Expose setter so components can set context synchronously before rendering
  const setValue = (value: TValue) => {
    console.log('[Context setValue] Setting value:', value, 'for context:', contextId);
    setContextValue(value);
    console.log('[Context setValue] Signal now returns:', getContextValue());
  };

  return {
    Provider,
    defaultValue,
    _id: contextId,
    setValue, // Allow setting context value before Provider renders
  };
}

/**
 * Hook to access context value
 * @param context - The context created by createContext
 * @returns Current context value or default value
 *
 * @example
 * ```tsx
 * const AppContext = createContext({ appName: 'Default' })
 *
 * const MyComponent = () => {
 *     const appContext = useContext(AppContext)
 *     return <div>{appContext.appName}</div>
 * }
 * ```
 */
export const useContext = function <TValue>(context: IContext<TValue>): TValue {
  // Check if commandant (Provider) has already arrived and registered the signal
  const signal = contextRegistry.get(context._id);

  console.log('[useContext] Looking up context:', context._id);
  console.log('[useContext] Found signal:', signal);

  if (signal) {
    // Signal exists, read its current value reactively
    const [getValue] = signal as [() => TValue, (value: TValue) => void];
    const value = getValue();
    console.log('[useContext] Signal value:', value);
    return value;
  }

  // SOLDIER ARRIVES FIRST!
  // Commandant hasn't arrived yet, return default value for now
  // When Provider arrives, it will update the signal and trigger reactivity

  console.log('[useContext] No signal found, returning default:', context.defaultValue);
  return context.defaultValue;
};
