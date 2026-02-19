/**
 * JSX Runtime Types
 * Type definitions for JSX transformation
 */

/**
 * JSX component function type
 */
export type JSXComponentFunction<P = Record<string, unknown>> = (props: P) => HTMLElement;

/**
 * JSX element type - can be string tag or component function
 */
export type JSXElementType<P = Record<string, unknown>> = string | JSXComponentFunction<P>;

/**
 * JSX key type for list reconciliation
 */
export type JSXKey = string | number | null | undefined;

/**
 * JSX props type with children
 */
export interface JSXProps {
  children?: JSXChild | JSXChild[];
  key?: JSXKey;
  [key: string]: unknown;
}

/**
 * JSX child types
 */
export type JSXChild =
  | HTMLElement
  | DocumentFragment
  | string
  | number
  | boolean
  | null
  | undefined;

/**
 * JSX dev mode source location
 */
export interface JSXSource {
  fileName: string;
  lineNumber: number;
  columnNumber: number;
}

// ============================================================================
// STRICT TYPE DEFINITIONS (Zero `any` types)
// ============================================================================

/**
 * Base primitive types that can be rendered
 */
export type RenderablePrimitive = string | number | boolean | null | undefined;

/**
 * A value that can be either static or reactive
 */
export type ReactiveValue<T> = T | (() => T);

/**
 * A single child element (can be reactive)
 */
export type ReactiveChild = RenderablePrimitive | Node | ReactiveValue<RenderablePrimitive | Node>;

/**
 * Children can be single or array
 */
export type ReactiveChildren = ReactiveChild | ReadonlyArray<ReactiveChild>;

/**
 * Normalized value after processing (no functions)
 */
export type NormalizedValue = string | number | Node | null | undefined;

/**
 * Element attributes with strict types
 */
export interface IElementAttributes {
  [key: string]: unknown;
  'data-hid'?: string;
  'data-comp-id'?: string;
  class?: string;
  className?: string;
  style?: string | Record<string, ReactiveValue<string | number>>;
  /** Ref callback - called with the DOM element after creation */
  ref?: (el: Element) => void;
}

/**
 * Style object with reactive values
 */
export type ReactiveStyle = {
  [K in keyof CSSStyleDeclaration]?: ReactiveValue<string | number>;
};

/**
 * Fragment props
 */
export interface IFragmentProps {
  children?: JSXChild | JSXChild[];
}

/**
 * Internal props for createElement
 */
export interface ICreateElementProps extends Record<string, unknown> {
  children?: JSXChild | JSXChild[];
  className?: string;
  innerHTML?: string;
  [key: `on${string}`]: ((event: Event) => void) | unknown;
  [key: `aria-${string}`]: string | unknown;
  [key: `data-${string}`]: string | unknown;
  role?: string;
}
