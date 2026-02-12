/**
 * Reactive Insert Function (SolidJS-inspired)
 * Handles reactive JSX expression insertion with automatic effect wrapping
 */

import { $REGISTRY } from '../registry/core';

/**
 * Inserts content into a parent element with reactive tracking
 * @param parent - Parent element to insert into
 * @param accessor - Value or function returning value to insert
 * @param marker - Optional reference node for insertion position
 * @returns Disposer function to cleanup reactive tracking
 */
export function insert(
  parent: HTMLElement,
  accessor: any,
  marker?: Node | null,
): (() => void) | void {
  // If marker is undefined, append to end
  if (marker === undefined) {
    marker = null;
  }

  // Handle non-function (static) values
  if (typeof accessor !== 'function') {
    insertExpression(parent, accessor, marker);
    return;
  }

  // Reactive case: wrap in effect to track signal reads
  let current: Node | undefined;

  const disposer = $REGISTRY.wire(parent, '_reactive_child', () => {
    const value = accessor(); // Tracks signal reads
    
    // Handle different value types
    if (value === null || value === undefined) {
      // Remove current node if exists
      if (current && current.parentNode) {
        current.parentNode.removeChild(current);
        current = undefined;
      }
      return;
    }

    const normalized = normalizeIncomingValue(value);

    // Update or create text node
    if (typeof normalized === 'string' || typeof normalized === 'number') {
      if (current instanceof Text) {
        // Update existing text node
        if (current.data !== String(normalized)) {
          current.data = String(normalized);
        }
      } else {
        // Remove old node and create new text node
        if (current && current.parentNode) {
          current.parentNode.removeChild(current);
        }
        current = document.createTextNode(String(normalized));
        parent.insertBefore(current, marker);
      }
    } else if (normalized instanceof Node) {
      // Replace with new DOM node
      if (current && current !== normalized) {
        if (current.parentNode) {
          current.parentNode.removeChild(current);
        }
      }
      if (normalized !== current) {
        parent.insertBefore(normalized, marker);
        current = normalized;
      }
    } else if (Array.isArray(normalized)) {
      // Handle array of nodes
      // For simplicity, convert to text for now
      const text = normalized.join('');
      if (current instanceof Text) {
        if (current.data !== text) {
          current.data = text;
        }
      } else {
        if (current && current.parentNode) {
          current.parentNode.removeChild(current);
        }
        current = document.createTextNode(text);
        parent.insertBefore(current, marker);
      }
    }
  });

  // Return disposer for cleanup
  return disposer;
}

/**
 * Insert static expression (non-reactive)
 */
function insertExpression(
  parent: HTMLElement,
  value: any,
  marker: Node | null,
): void {
  if (value === null || value === undefined) {
    return;
  }

  const normalized = normalizeIncomingValue(value);

  if (typeof normalized === 'string' || typeof normalized === 'number') {
    const textNode = document.createTextNode(String(normalized));
    parent.insertBefore(textNode, marker);
  } else if (normalized instanceof Node) {
    parent.insertBefore(normalized, marker);
  } else if (Array.isArray(normalized)) {
    for (const item of normalized) {
      insertExpression(parent, item, marker);
    }
  }
}

/**
 * Normalize incoming values to renderable types
 */
function normalizeIncomingValue(value: any): any {
  // Handle boolean values
  if (typeof value === 'boolean') {
    return '';
  }

  // Handle arrays
  if (Array.isArray(value)) {
    return value.map(normalizeIncomingValue);
  }

  // Pass through primitives and nodes
  return value;
}
