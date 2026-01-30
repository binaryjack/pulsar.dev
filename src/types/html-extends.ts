/**
 * HTML element props extension types
 * Provides type-safe HTML element attributes for components
 */

/**
 * JSX Children type - supports all valid JSX child patterns
 * Allows for conditional rendering, arrays, and primitive values
 * Similar to React.ReactNode
 */
export type Children = HTMLElement | HTMLElement[] | string | number | boolean | null | undefined;

/**
 * Extract intrinsic HTML element attributes
 * Similar to React.ComponentProps<'div'>
 */
export type HtmlExtends<T extends keyof HTMLElementTagNameMap> = Partial<
  Omit<HTMLElementTagNameMap[T], 'children'>
>;

/**
 * Namespace for Pulsar type utilities
 */
export namespace Pulsar {
  /**
   * JSX Children type - supports all valid JSX child patterns
   * Use this for component children props to enable declarative JSX
   */
  export type Children = HTMLElement | HTMLElement[] | string | number | boolean | null | undefined;

  /**
   * HTML element props extension
   * Usage: interface IMyComponent extends Pulsar.HtmlExtends<'div'>
   */
  export type HtmlExtends<T extends keyof HTMLElementTagNameMap> = Partial<
    Omit<HTMLElementTagNameMap[T], 'children'>
  >;
}
