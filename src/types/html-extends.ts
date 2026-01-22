/**
 * HTML element props extension types
 * Provides type-safe HTML element attributes for components
 */

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
   * HTML element props extension
   * Usage: interface IMyComponent extends Pulsar.HtmlExtends<'div'>
   */
  export type HtmlExtends<T extends keyof HTMLElementTagNameMap> = Partial<
    Omit<HTMLElementTagNameMap[T], 'children'>
  >;
}
