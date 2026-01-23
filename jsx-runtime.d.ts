/**
 * Pulsar JSX runtime type definitions
 */

export function jsx(
  type: string | ((props: any) => HTMLElement),
  props: any,
  key?: string | number
): HTMLElement;

export function jsxs(
  type: string | ((props: any) => HTMLElement),
  props: any,
  key?: string | number
): HTMLElement;

export function Fragment(props: { children?: any }): DocumentFragment;

export namespace JSX {
  type Element = HTMLElement;
  type Child = HTMLElement | string | number | boolean | null | undefined;
  type Children = Child | Child[];

  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
