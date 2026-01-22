/**
 * Server-Side Rendering - Render to String
 */

import type { ComponentFunction, IRenderResult, IRenderToStringOptions } from './ssr.types';
import { escapeHtml } from './utils/escape-html';
import { createHydrationScript } from './utils/serialize-data';

/**
 * Render a Pulsar component to an HTML string
 */
export const renderToString = function renderToString(
  component: ComponentFunction,
  options: IRenderToStringOptions = {}
): IRenderResult {
  const {
    context = {},
    collectStyles = false,
    collectScripts = false,
    serializeState = false,
  } = options;

  // Set server rendering flag
  const ssrContext = {
    ...context,
    isServer: true,
    styles: collectStyles ? [] : undefined,
    scripts: collectScripts ? [] : undefined,
  };

  try {
    // Execute the component function
    const vnode = component();

    // Render the virtual node to HTML
    const html = renderVNode(vnode);

    // Apply wrapper if provided
    const finalHtml = options.wrapper ? options.wrapper(html) : html;

    // Build result
    const result: IRenderResult = {
      html: finalHtml,
    };

    if (collectStyles && ssrContext.styles) {
      result.styles = ssrContext.styles;
    }

    if (collectScripts && ssrContext.scripts) {
      result.scripts = ssrContext.scripts;
    }

    if (serializeState && context.data) {
      result.state = createHydrationScript(context.data);
    }

    return result;
  } catch (error) {
    console.error('SSR Error:', error);
    throw new Error(`Failed to render component: ${(error as Error).message}`);
  }
};

/**
 * Render a virtual node to HTML string
 */
const renderVNode = function renderVNode(vnode: any): string {
  // Null or undefined
  if (vnode == null) {
    return '';
  }

  // String or number (text nodes)
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    return escapeHtml(String(vnode));
  }

  // Boolean (skip)
  if (typeof vnode === 'boolean') {
    return '';
  }

  // Array of vnodes
  if (Array.isArray(vnode)) {
    return vnode.map((child) => renderVNode(child)).join('');
  }

  // Function (component or signal)
  if (typeof vnode === 'function') {
    // Execute function to get value
    const result = vnode();
    return renderVNode(result);
  }

  // JSX element
  if (vnode && typeof vnode === 'object' && vnode.type) {
    return renderElement(vnode);
  }

  // Unknown type
  return '';
};

/**
 * Render a JSX element to HTML
 */
const renderElement = function renderElement(element: any): string {
  const { type, props } = element;

  // Component function
  if (typeof type === 'function') {
    // Execute component with props
    const vnode = type(props || {});
    return renderVNode(vnode);
  }

  // HTML tag
  if (typeof type === 'string') {
    return renderHtmlElement(type, props);
  }

  return '';
};

/**
 * Render an HTML element
 */
const renderHtmlElement = function renderHtmlElement(
  tag: string,
  props: Record<string, any> = {}
): string {
  const { children, ...attributes } = props;

  // Self-closing tags
  const voidTags = new Set([
    'area',
    'base',
    'br',
    'col',
    'embed',
    'hr',
    'img',
    'input',
    'link',
    'meta',
    'param',
    'source',
    'track',
    'wbr',
  ]);

  // Build opening tag
  let html = `<${tag}`;

  // Add attributes
  for (const [key, value] of Object.entries(attributes)) {
    if (value == null || value === false) continue;

    // Skip event handlers
    if (key.startsWith('on')) continue;

    // Boolean attributes
    if (value === true) {
      html += ` ${key}`;
      continue;
    }

    // Convert camelCase to kebab-case for attributes
    const attrName = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    const attrValue = escapeHtml(String(value));
    html += ` ${attrName}="${attrValue}"`;
  }

  html += '>';

  // Self-closing tags don't have children
  if (voidTags.has(tag)) {
    return html;
  }

  // Render children
  if (children != null) {
    html += renderVNode(children);
  }

  // Closing tag
  html += `</${tag}>`;

  return html;
};
