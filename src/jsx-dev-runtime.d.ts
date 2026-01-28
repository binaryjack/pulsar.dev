/**
 * JSX Dev Runtime Type Definitions
 * Re-exports jsxDEV and related development-mode JSX functions
 */

export { Fragment, jsxDEV, jsxs } from './jsx-runtime';

export namespace JSX {
  export type Element = HTMLElement;
  export type Child = HTMLElement | string | number | boolean | null | undefined;
  export type Children = Child | Child[];

  export interface IntrinsicElements {
    [elemName: string]: Record<string, unknown>;
  }

  export interface ElementChildrenAttribute {
    children: Record<string, never>;
  }
}
