/**
 * Context system for Pulsar Framework
 * Registry-based context API with stack support for nested providers
 *
 * Key features:
 * - No deferred children needed (registry available immediately)
 * - Supports nested providers (same context used multiple times)
 * - Simple cleanup via useEffect
 */

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
}

/**
 * Global context registry - stores current active value for each context
 */
const contextRegistry = new Map<symbol, unknown>();

/**
 * Context stack - tracks nested providers for the same context
 * Enables proper cleanup when inner providers unmount
 */
const contextStack = new Map<symbol, unknown[]>();

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

  const Provider = ({
    value,
    children,
  }: {
    value: TValue;
    children: HTMLElement | (() => HTMLElement);
  }): HTMLElement => {
    // Import useEffect dynamically to avoid circular dependency
    const { useEffect } = require('../hooks/use-effect');

    // Register context value immediately (no timing issues!)
    useEffect(() => {
      // Push value onto stack (supports nesting)
      if (!contextStack.has(contextId)) {
        contextStack.set(contextId, []);
      }
      contextStack.get(contextId)!.push(value);

      // Set current value in registry
      contextRegistry.set(contextId, value);

      // Cleanup: restore previous value or delete
      return () => {
        const stack = contextStack.get(contextId);
        if (stack && stack.length > 0) {
          stack.pop();

          // Restore previous provider's value
          if (stack.length > 0) {
            contextRegistry.set(contextId, stack[stack.length - 1]);
          } else {
            // No more providers, clean up completely
            contextStack.delete(contextId);
            contextRegistry.delete(contextId);
          }
        }
      };
    }, [value]);

    // Evaluate children if it's a function
    const evaluatedChildren = typeof children === 'function' ? children() : children;

    // Return children directly (no wrapper div needed)
    return evaluatedChildren;
  };

  return {
    Provider,
    defaultValue,
    _id: contextId,
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
  // Check if we have a value in the registry
  if (contextRegistry.has(context._id)) {
    return contextRegistry.get(context._id) as TValue;
  }

  // Return default value if no provider found
  return context.defaultValue;
};

// Export AppContextProvider and related utilities
export { AppContext, AppContextProvider, useAppContext } from './app-context-provider';
export type { IAppContext, IAppContextProviderProps } from './app-context-provider';
