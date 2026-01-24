/**
 * Context system for Visual Schema Builder
 * Provides React-like context API with createContext and useContext
 */

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
   * Internal context identifier
   */
  _id: symbol;
}

/**
 * Context registry to store context values
 */
const contextRegistry = new Map<symbol, unknown>();

/**
 * Stack to track current provider values during render
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
    const container = document.createElement('div');
    container.className = 'context-provider';
    container.setAttribute('data-context-id', contextId.toString());

    // Push value onto the stack
    if (!contextStack.has(contextId)) {
      contextStack.set(contextId, []);
    }
    contextStack.get(contextId)!.push(value);

    // Store reference to the context value on the container
    Object.defineProperty(container, '__contextId', {
      value: contextId,
      enumerable: false,
      writable: false,
    });

    Object.defineProperty(container, '__contextValue', {
      value,
      enumerable: false,
      writable: false,
    });

    // Register the context value BEFORE evaluating children
    contextRegistry.set(contextId, value);

    // Evaluate children if it's a thunk (deferred evaluation)
    const evaluatedChildren = typeof children === 'function' ? children() : children;

    // Append children
    container.appendChild(evaluatedChildren);

    // Cleanup when removed from DOM
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.removedNodes.forEach((node) => {
          if (node === container) {
            // Pop from stack
            const stack = contextStack.get(contextId);
            if (stack && stack.length > 0) {
              stack.pop();
              if (stack.length === 0) {
                contextStack.delete(contextId);
                contextRegistry.delete(contextId);
              } else {
                contextRegistry.set(contextId, stack[stack.length - 1]);
              }
            }
            observer.disconnect();
          }
        });
      });
    });

    if (container.parentElement) {
      observer.observe(container.parentElement, { childList: true });
    }

    return container;
  };

  // Mark Provider to defer children evaluation (transformer will wrap children in arrow function)
  Object.defineProperty(Provider, '_deferChildren', {
    value: true,
    writable: false,
    enumerable: false,
    configurable: false,
  });

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

/**
 * Higher-order function to create a context provider component
 * @param contextValue - Initial context value
 * @returns Function that creates Provider component
 *
 * @example
 * ```tsx
 * const withAppContext = createContextProvider<IAppContext>({
 *     appName: 'My App',
 *     version: '1.0.0'
 * })
 *
 * const ProviderComponent = withAppContext((children) => {
 *     return <div className="app-wrapper">{children}</div>
 * })
 * ```
 */
export const createContextProvider = function <TValue>(
  defaultValue: TValue
): (render: (children: HTMLElement, value: TValue) => HTMLElement) => IContext<TValue>['Provider'] {
  return (render) => {
    const context = createContext(defaultValue);

    return ({ value, children }) => {
      const wrapper = render(children, value);
      return context.Provider({ value, children: wrapper });
    };
  };
};

// Export AppContextProvider and related utilities
export { AppContext, AppContextProvider, useAppContext } from './app-context-provider';
export type { IAppContext, IAppContextProviderProps } from './app-context-provider';
