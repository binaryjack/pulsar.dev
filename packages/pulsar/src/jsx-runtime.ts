/**
 * Pulsar JSX runtime
 * Provides JSX transformation functions for Pulsar framework
 */

export function jsx(type: any, props: any, key?: any): HTMLElement {
  return typeof type === 'function' ? type(props) : createElement(type, props);
}

export function jsxs(type: any, props: any, key?: any): HTMLElement {
  return jsx(type, props, key);
}

// Development mode JSX functions
export function jsxDEV(
  type: any,
  props: any,
  key?: any,
  isStaticChildren?: boolean,
  source?: any,
  self?: any
): HTMLElement {
  return jsx(type, props, key);
}

export function jsxsDEV(
  type: any,
  props: any,
  key?: any,
  isStaticChildren?: boolean,
  source?: any,
  self?: any
): HTMLElement {
  return jsx(type, props, key);
}

export function Fragment(props: { children?: any }): DocumentFragment {
  const fragment = document.createDocumentFragment();
  if (props.children) {
    const children = Array.isArray(props.children) ? props.children : [props.children];
    children.forEach((child) => {
      if (child instanceof Node) {
        fragment.appendChild(child);
      }
    });
  }
  return fragment;
}

function createElement(type: string, props: any): HTMLElement {
  const element = document.createElement(type);

  if (props) {
    Object.keys(props).forEach((key) => {
      if (key === 'children') {
        const children = Array.isArray(props.children) ? props.children : [props.children];
        children.forEach((child: any) => {
          if (child instanceof Node) {
            element.appendChild(child);
          } else if (typeof child === 'string' || typeof child === 'number') {
            element.appendChild(document.createTextNode(String(child)));
          }
        });
      } else if (key === 'className') {
        element.className = props[key];
      } else if (key === 'innerHTML') {
        element.innerHTML = props[key];
      } else if (key.startsWith('on')) {
        const eventName = key.toLowerCase().substring(2);
        element.addEventListener(eventName, props[key]);
      } else if (key.startsWith('aria-') || key.startsWith('data-') || key === 'role') {
        element.setAttribute(key, props[key]);
      } else if (typeof props[key] !== 'undefined' && props[key] !== null) {
        (element as any)[key] = props[key];
      }
    });
  }

  return element;
}

// JSX namespace for TypeScript
export namespace JSX {
  export type Element = HTMLElement;
  export type Child = HTMLElement | string | number | boolean | null | undefined;
  export type Children = Child | Child[];

  export interface IntrinsicElements {
    [elemName: string]: any;
  }

  export interface ElementChildrenAttribute {
    children: {};
  }
}
