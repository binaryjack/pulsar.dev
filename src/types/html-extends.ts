/**
 * HTML element props extension types
 * Provides type-safe HTML element attributes for components
 */

/**
 * JSX-compatible CSS Properties that accept both string and number values
 */
type CSSNumberProperty = {
  left?: string | number;
  right?: string | number;
  top?: string | number;
  bottom?: string | number;
  zIndex?: string | number;
  opacity?: string | number;
  flex?: string | number;
  flexGrow?: string | number;
  flexShrink?: string | number;
  order?: string | number;
  fontSize?: string | number;
  lineHeight?: string | number;
  fontWeight?: string | number;
  width?: string | number;
  height?: string | number;
  minWidth?: string | number;
  minHeight?: string | number;
  maxWidth?: string | number;
  maxHeight?: string | number;
  padding?: string | number;
  margin?: string | number;
  paddingTop?: string | number;
  paddingRight?: string | number;
  paddingBottom?: string | number;
  paddingLeft?: string | number;
  marginTop?: string | number;
  marginRight?: string | number;
  marginBottom?: string | number;
  marginLeft?: string | number;
  borderWidth?: string | number;
  borderRadius?: string | number;
  strokeWidth?: string | number;
  tabSize?: string | number;
  columnCount?: string | number;
  columns?: string | number;
  size?: string | number;
  span?: string | number;
  colSpan?: string | number;
  rowSpan?: string | number;
  start?: string | number;
};

/**
 * JSX Children type - supports all valid JSX child patterns
 * Allows for conditional rendering, arrays, and primitive values
 * Similar to React.ReactNode
 */
export type Children = HTMLElement | HTMLElement[] | string | number | boolean | null | undefined;

/**
 * Extract intrinsic HTML element attributes with JSX-compatible style properties
 * Similar to React.ComponentProps<'div'> but with proper CSS numeric property support
 */
export type HtmlExtends<T extends keyof HTMLElementTagNameMap> = Partial<
  Omit<HTMLElementTagNameMap[T], 'children' | 'style'> & {
    style?: Partial<CSSStyleDeclaration & CSSNumberProperty>;
  }
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
   * HTML element props extension with JSX-compatible style properties
   * Usage: interface IMyComponent extends Pulsar.HtmlExtends<'div'>
   */
  export type HtmlExtends<T extends keyof HTMLElementTagNameMap> = Partial<
    Omit<HTMLElementTagNameMap[T], 'children' | 'style'> & {
      style?: Partial<CSSStyleDeclaration & CSSNumberProperty>;
    }
  >;
}
