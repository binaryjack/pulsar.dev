/**
 * SVG Utilities
 *
 * Helpers for SVG namespace element creation and attribute routing.
 * Used by t_element() and wire() to distinguish SVG geometry attributes
 * (which require setAttribute) from HTML DOM properties (which allow
 * direct property assignment).
 */

export const SVG_NAMESPACE = 'http://www.w3.org/2000/svg' as const;

/**
 * Complete set of SVG element tag names.
 * Used to decide whether createElementNS is required.
 */
export const SVG_TAGS: ReadonlySet<string> = new Set([
  // Structural
  'svg',
  'g',
  'defs',
  'use',
  'symbol',
  'switch',
  'a',
  // Shapes
  'circle',
  'ellipse',
  'line',
  'path',
  'polygon',
  'polyline',
  'rect',
  // Text
  'text',
  'tspan',
  'textPath',
  // Clipping & Masking
  'clipPath',
  'mask',
  // Paint servers
  'pattern',
  'linearGradient',
  'radialGradient',
  'stop',
  // Filters
  'filter',
  'feBlend',
  'feColorMatrix',
  'feComposite',
  'feConvolveMatrix',
  'feDiffuseLighting',
  'feDisplacementMap',
  'feFlood',
  'feGaussianBlur',
  'feImage',
  'feMerge',
  'feMorphology',
  'feOffset',
  'feSpecularLighting',
  'feTile',
  'feTurbulence',
  // Other visual elements
  'foreignObject',
  'image',
  'marker',
  // Metadata
  'title',
  'desc',
  // Animation
  'animate',
  'animateTransform',
  'animateMotion',
  'set',
]);

/**
 * DOM properties that exist on SVGElement and work correctly via property
 * assignment.  These are excluded from the setAttribute path in wire() so
 * they continue to behave as standard DOM properties.
 */
export const SVG_DOM_PROPERTIES: ReadonlySet<string> = new Set([
  'textContent',
  'innerHTML',
  'id',
]);

/**
 * Maps JSX prop names to their SVG attribute equivalents.
 * e.g. `className` → `class`
 */
export const SVG_ATTR_MAP: Readonly<Record<string, string>> = {
  className: 'class',
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Returns true when `tag` belongs to the SVG namespace and must be created
 * with `document.createElementNS`.
 */
export function isSvgTag(tag: string): boolean {
  return SVG_TAGS.has(tag);
}

/**
 * Returns true when `el` is an SVGElement.
 *
 * Safe in environments where `SVGElement` may not be defined (pure Node.js
 * without jsdom).
 */
export function isSvgElement(el: Element): boolean {
  return typeof SVGElement !== 'undefined' && el instanceof SVGElement;
}

/**
 * Determines whether `wire()` should use `setAttribute` rather than direct
 * property assignment for the given element and property path.
 *
 * Rules:
 * - Path must be a bare identifier (no dots) — dotted paths like `style.left`
 *   navigate the JS property chain and do not need setAttribute.
 * - Element must be an SVGElement.
 * - Path must not be a known DOM property that works via assignment
 *   (textContent, innerHTML, id).
 */
export function isSvgAttributePath(el: Element, path: string): boolean {
  if (path.includes('.')) return false;
  if (!isSvgElement(el)) return false;
  return !SVG_DOM_PROPERTIES.has(path);
}

/**
 * Resolves the canonical SVG attribute name from a JSX prop key.
 *
 * @example
 * resolveSvgAttrName('className') // → 'class'
 * resolveSvgAttrName('cx')        // → 'cx'
 */
export function resolveSvgAttrName(key: string): string {
  return SVG_ATTR_MAP[key] ?? key;
}
