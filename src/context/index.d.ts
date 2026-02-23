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
export declare function createContext<TValue>(defaultValue: TValue): IContext<TValue>;
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
export declare const useContext: <TValue>(context: IContext<TValue>) => TValue;
