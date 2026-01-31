/**
 * Standard JSX Runtime (Backward Compatible)
 * Original JSX functions without registry integration
 */

import type {
  ICreateElementProps,
  IFragmentProps,
  JSXChild,
  JSXElementType,
  JSXKey,
  JSXProps,
  JSXSource,
} from './jsx-runtime.types';

export function jsx<P extends JSXProps = JSXProps>(
  type: JSXElementType<P>,
  props: P,
  key?: JSXKey
): HTMLElement {
  return typeof type === 'function'
    ? type(props)
    : createElement(type, props as ICreateElementProps);
}

export function jsxs<P extends JSXProps = JSXProps>(
  type: JSXElementType<P>,
  props: P,
  key?: JSXKey
): HTMLElement {
  return jsx(type, props, key);
}

// Development mode JSX functions
export function jsxDEV<P extends JSXProps = JSXProps>(
  type: JSXElementType<P>,
  props: P,
  key?: JSXKey,
  isStaticChildren?: boolean,
  source?: JSXSource,
  self?: unknown
): HTMLElement {
  return jsx(type, props, key);
}

export function jsxsDEV<P extends JSXProps = JSXProps>(
  type: JSXElementType<P>,
  props: P,
  key?: JSXKey,
  isStaticChildren?: boolean,
  source?: JSXSource,
  self?: unknown
): HTMLElement {
  return jsx(type, props, key);
}

export function Fragment(props: IFragmentProps): DocumentFragment {
  const fragment = document.createDocumentFragment();
  if (props.children) {
    const children = Array.isArray(props.children) ? props.children : [props.children];
    children.forEach((child: JSXChild) => {
      if (child instanceof Node) {
        fragment.appendChild(child);
      }
    });
  }
  return fragment;
}

function createElement(type: string, props: ICreateElementProps): HTMLElement {
  const element = document.createElement(type);

  if (props) {
    Object.keys(props).forEach((key) => {
      if (key === 'children') {
        const children = Array.isArray(props.children) ? props.children : [props.children];
        children.forEach((child: JSXChild) => {
          if (child instanceof Node) {
            element.appendChild(child);
          } else if (typeof child === 'string' || typeof child === 'number') {
            element.appendChild(document.createTextNode(String(child)));
          }
        });
      } else if (key === 'className') {
        element.className = props[key] as string;
      } else if (key === 'innerHTML') {
        element.innerHTML = props[key] as string;
      } else if (key.startsWith('on')) {
        const eventName = key.toLowerCase().substring(2);
        element.addEventListener(eventName, props[key] as EventListener);
      } else if (key.startsWith('aria-') || key.startsWith('data-') || key === 'role') {
        element.setAttribute(key, String(props[key]));
      } else if (key === 'style' && typeof props[key] === 'object') {
        // Handle style objects by applying to element.style
        Object.assign(element.style, props[key]);
      } else if (typeof props[key] !== 'undefined' && props[key] !== null) {
        (element as unknown as Record<string, unknown>)[key] = props[key];
      }
    });
  }

  return element;
}
