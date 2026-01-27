/**
 * ElementRegistry unit tests
 * Tests core registry functionality
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ElementRegistry } from '../../core/element-registry';
import type { IElementRegistry } from '../../core/element-registry.types';
import { ElementType } from '../../types';

describe('ElementRegistry', () => {
  let registry: IElementRegistry;

  beforeEach(() => {
    registry = new ElementRegistry();
  });

  describe('constructor', () => {
    it('should create registry with empty Map', () => {
      expect(registry.registry).toBeInstanceOf(Map);
      expect(registry.registry.size).toBe(0);
    });

    it('should create metadata with WeakMap', () => {
      expect(registry.metadata).toBeInstanceOf(WeakMap);
    });

    it('should create parentChildren with empty Map', () => {
      expect(registry.parentChildren).toBeInstanceOf(Map);
      expect(registry.parentChildren.size).toBe(0);
    });
  });

  describe('register()', () => {
    it('should register element with ID', () => {
      const el = document.createElement('div');

      registry.register('test-1', el, {
        element: el,
        type: ElementType.DYNAMIC,
      });

      expect(registry.has('test-1')).toBe(true);
      expect(registry.get('test-1')?.element).toBe(el);
    });

    it('should store element entry with metadata', () => {
      const el = document.createElement('div');

      registry.register('test-1', el, {
        element: el,
        type: ElementType.ARRAY_ITEM,
        parentId: 'parent-1',
        index: 0,
      });

      const entry = registry.get('test-1');
      expect(entry?.type).toBe(ElementType.ARRAY_ITEM);
      expect(entry?.parentId).toBe('parent-1');
      expect(entry?.index).toBe(0);
    });

    it('should throw error on duplicate IDs', () => {
      const el = document.createElement('div');

      registry.register('test-1', el, {
        element: el,
        type: ElementType.DYNAMIC,
      });

      expect(() => {
        registry.register('test-1', el, {
          element: el,
          type: ElementType.DYNAMIC,
        });
      }).toThrow('Element with ID "test-1" is already registered');
    });

    it('should validate element is HTMLElement', () => {
      expect(() => {
        registry.register('test-1', null as unknown as HTMLElement, {
          element: null as unknown as HTMLElement,
          type: ElementType.DYNAMIC,
        });
      }).toThrow('Element must be an HTMLElement instance');
    });

    it('should validate ID is non-empty string', () => {
      const el = document.createElement('div');

      expect(() => {
        registry.register('', el, {
          element: el,
          type: ElementType.DYNAMIC,
        });
      }).toThrow('Element ID must be a non-empty string');
    });

    it('should track parent-child relationships', () => {
      const parent = document.createElement('div');
      const child = document.createElement('span');

      registry.register('parent-1', parent, {
        element: parent,
        type: ElementType.DYNAMIC,
      });

      registry.register('child-1', child, {
        element: child,
        type: ElementType.DYNAMIC,
        parentId: 'parent-1',
      });

      const children = registry.getChildren('parent-1');
      expect(children).toContain('child-1');
      expect(children.length).toBe(1);
    });

    it('should create metadata for element', () => {
      const el = document.createElement('div');

      registry.register('test-1', el, {
        element: el,
        type: ElementType.DYNAMIC,
      });

      const metadata = registry.metadata.get(el);
      expect(metadata).toBeDefined();
      expect(metadata?.effects).toBeInstanceOf(Set);
      expect(metadata?.signals).toBeInstanceOf(Set);
    });
  });

  describe('unregister()', () => {
    it('should remove element from registry', () => {
      const el = document.createElement('div');

      registry.register('test-1', el, {
        element: el,
        type: ElementType.DYNAMIC,
      });

      registry.unregister('test-1');

      expect(registry.has('test-1')).toBe(false);
      expect(registry.get('test-1')).toBeUndefined();
    });

    it('should remove from parent-child tracking', () => {
      const parent = document.createElement('div');
      const child = document.createElement('span');

      registry.register('parent-1', parent, {
        element: parent,
        type: ElementType.DYNAMIC,
      });

      registry.register('child-1', child, {
        element: child,
        type: ElementType.DYNAMIC,
        parentId: 'parent-1',
      });

      registry.unregister('child-1');

      const children = registry.getChildren('parent-1');
      expect(children).not.toContain('child-1');
      expect(children.length).toBe(0);
    });

    it('should call cleanup callback if exists', () => {
      const el = document.createElement('div');
      const cleanup = vi.fn();

      registry.register('test-1', el, {
        element: el,
        type: ElementType.DYNAMIC,
      });

      const metadata = registry.metadata.get(el);
      if (metadata) {
        metadata.cleanup = cleanup;
      }

      registry.unregister('test-1');

      expect(cleanup).toHaveBeenCalled();
    });

    it('should handle non-existent IDs gracefully', () => {
      expect(() => {
        registry.unregister('non-existent');
      }).not.toThrow();
    });

    it('should clean up empty parent-child sets', () => {
      const parent = document.createElement('div');
      const child = document.createElement('span');

      registry.register('parent-1', parent, {
        element: parent,
        type: ElementType.DYNAMIC,
      });

      registry.register('child-1', child, {
        element: child,
        type: ElementType.DYNAMIC,
        parentId: 'parent-1',
      });

      registry.unregister('child-1');

      expect(registry.parentChildren.has('parent-1')).toBe(false);
    });
  });

  describe('get()', () => {
    it('should retrieve registered element', () => {
      const el = document.createElement('div');

      registry.register('test-1', el, {
        element: el,
        type: ElementType.DYNAMIC,
      });

      const entry = registry.get('test-1');
      expect(entry).toBeDefined();
      expect(entry?.element).toBe(el);
    });

    it('should return undefined for non-existent ID', () => {
      const entry = registry.get('non-existent');
      expect(entry).toBeUndefined();
    });
  });

  describe('has()', () => {
    it('should return true for registered element', () => {
      const el = document.createElement('div');

      registry.register('test-1', el, {
        element: el,
        type: ElementType.DYNAMIC,
      });

      expect(registry.has('test-1')).toBe(true);
    });

    it('should return false for non-existent element', () => {
      expect(registry.has('non-existent')).toBe(false);
    });
  });

  describe('getChildren()', () => {
    it('should return all child IDs for parent', () => {
      const parent = document.createElement('div');
      const child1 = document.createElement('span');
      const child2 = document.createElement('span');

      registry.register('parent-1', parent, {
        element: parent,
        type: ElementType.DYNAMIC,
      });

      registry.register('child-1', child1, {
        element: child1,
        type: ElementType.DYNAMIC,
        parentId: 'parent-1',
      });

      registry.register('child-2', child2, {
        element: child2,
        type: ElementType.DYNAMIC,
        parentId: 'parent-1',
      });

      const children = registry.getChildren('parent-1');
      expect(children).toContain('child-1');
      expect(children).toContain('child-2');
      expect(children.length).toBe(2);
    });

    it('should return empty array for parent with no children', () => {
      const children = registry.getChildren('non-existent');
      expect(children).toEqual([]);
    });
  });

  describe('unregisterSubtree()', () => {
    it('should remove element and all descendants', () => {
      const parent = document.createElement('div');
      const child1 = document.createElement('span');
      const child2 = document.createElement('span');
      const grandchild = document.createElement('i');

      registry.register('parent', parent, {
        element: parent,
        type: ElementType.DYNAMIC,
      });

      registry.register('child-1', child1, {
        element: child1,
        type: ElementType.DYNAMIC,
        parentId: 'parent',
      });

      registry.register('child-2', child2, {
        element: child2,
        type: ElementType.DYNAMIC,
        parentId: 'parent',
      });

      registry.register('grandchild', grandchild, {
        element: grandchild,
        type: ElementType.DYNAMIC,
        parentId: 'child-1',
      });

      registry.unregisterSubtree('parent');

      expect(registry.has('parent')).toBe(false);
      expect(registry.has('child-1')).toBe(false);
      expect(registry.has('child-2')).toBe(false);
      expect(registry.has('grandchild')).toBe(false);
    });

    it('should handle nested hierarchies', () => {
      const root = document.createElement('div');
      const level1 = document.createElement('div');
      const level2 = document.createElement('div');
      const level3 = document.createElement('div');

      registry.register('root', root, {
        element: root,
        type: ElementType.DYNAMIC,
      });

      registry.register('level1', level1, {
        element: level1,
        type: ElementType.DYNAMIC,
        parentId: 'root',
      });

      registry.register('level2', level2, {
        element: level2,
        type: ElementType.DYNAMIC,
        parentId: 'level1',
      });

      registry.register('level3', level3, {
        element: level3,
        type: ElementType.DYNAMIC,
        parentId: 'level2',
      });

      registry.unregisterSubtree('root');

      expect(registry.size()).toBe(0);
    });

    it('should call cleanup for all removed elements', () => {
      const parent = document.createElement('div');
      const child = document.createElement('span');
      const parentCleanup = vi.fn();
      const childCleanup = vi.fn();

      registry.register('parent', parent, {
        element: parent,
        type: ElementType.DYNAMIC,
      });

      registry.register('child', child, {
        element: child,
        type: ElementType.DYNAMIC,
        parentId: 'parent',
      });

      const parentMeta = registry.metadata.get(parent);
      const childMeta = registry.metadata.get(child);

      if (parentMeta) parentMeta.cleanup = parentCleanup;
      if (childMeta) childMeta.cleanup = childCleanup;

      registry.unregisterSubtree('parent');

      expect(parentCleanup).toHaveBeenCalled();
      expect(childCleanup).toHaveBeenCalled();
    });
  });

  describe('clear()', () => {
    it('should remove all registry entries', () => {
      const el1 = document.createElement('div');
      const el2 = document.createElement('span');

      registry.register('test-1', el1, {
        element: el1,
        type: ElementType.DYNAMIC,
      });

      registry.register('test-2', el2, {
        element: el2,
        type: ElementType.DYNAMIC,
      });

      registry.clear();

      expect(registry.size()).toBe(0);
      expect(registry.has('test-1')).toBe(false);
      expect(registry.has('test-2')).toBe(false);
    });

    it('should call all cleanup callbacks', () => {
      const el1 = document.createElement('div');
      const el2 = document.createElement('span');
      const cleanup1 = vi.fn();
      const cleanup2 = vi.fn();

      registry.register('test-1', el1, {
        element: el1,
        type: ElementType.DYNAMIC,
      });

      registry.register('test-2', el2, {
        element: el2,
        type: ElementType.DYNAMIC,
      });

      const meta1 = registry.metadata.get(el1);
      const meta2 = registry.metadata.get(el2);

      if (meta1) meta1.cleanup = cleanup1;
      if (meta2) meta2.cleanup = cleanup2;

      registry.clear();

      expect(cleanup1).toHaveBeenCalled();
      expect(cleanup2).toHaveBeenCalled();
    });

    it('should clear parent-child tracking', () => {
      const parent = document.createElement('div');
      const child = document.createElement('span');

      registry.register('parent', parent, {
        element: parent,
        type: ElementType.DYNAMIC,
      });

      registry.register('child', child, {
        element: child,
        type: ElementType.DYNAMIC,
        parentId: 'parent',
      });

      registry.clear();

      expect(registry.parentChildren.size).toBe(0);
    });
  });

  describe('size()', () => {
    it('should return 0 for empty registry', () => {
      expect(registry.size()).toBe(0);
    });

    it('should return correct count of registered elements', () => {
      const el1 = document.createElement('div');
      const el2 = document.createElement('span');
      const el3 = document.createElement('i');

      registry.register('test-1', el1, {
        element: el1,
        type: ElementType.DYNAMIC,
      });

      expect(registry.size()).toBe(1);

      registry.register('test-2', el2, {
        element: el2,
        type: ElementType.DYNAMIC,
      });

      expect(registry.size()).toBe(2);

      registry.register('test-3', el3, {
        element: el3,
        type: ElementType.DYNAMIC,
      });

      expect(registry.size()).toBe(3);

      registry.unregister('test-2');

      expect(registry.size()).toBe(2);
    });
  });
});
