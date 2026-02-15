import { IComponentContext } from './registry';

/**
 * Higher-order function to define a component.
 * In the current architecture, components are just functions,
 * but this wrapper can be used for future enhancements (HMR, validation, etc).
 */
export function component<T>(fn: (props: T) => any): (props: T) => any {
  return (props: T) => {
    // Logic could be added here
    return fn(props);
  };
}
