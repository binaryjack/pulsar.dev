/**
 * HTML element props extension types
 * Provides type-safe HTML element attributes for components
 */
/**
 * JSX Children type - supports all valid JSX child patterns
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
export declare namespace Pulsar {
  /**
   * JSX Children type - supports all valid JSX child patterns
   */
  type Children = HTMLElement | HTMLElement[] | string | number | boolean | null | undefined;
  /**
   * HTML element props extension
   * Usage: interface IMyComponent extends Pulsar.HtmlExtends<'div'>
   */
  type HtmlExtends<T extends keyof HTMLElementTagNameMap> = Partial<
    Omit<HTMLElementTagNameMap[T], 'children'>
  >;
}
