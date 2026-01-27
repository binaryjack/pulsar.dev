/**
 * ElementRegistry integration tests
 * Tests real-world usage patterns
 */
import { beforeEach, describe, expect, it } from 'vitest';
import type { IElementRegistry } from '../../index';
import { ElementRegistry, ElementType } from '../../index';

describe('ElementRegistry integration', () => {
  let registry: IElementRegistry;

  beforeEach(() => {
    registry = new ElementRegistry();
  });

  describe('Dynamic form scenario', () => {
    it('should handle form with dynamic fields', () => {
      // Create form structure
      const form = document.createElement('form');
      const nameInput = document.createElement('input');
      const emailInput = document.createElement('input');

      // Register form
      registry.register('form-1', form, {
        element: form,
        type: ElementType.STATIC,
      });

      // Register dynamic inputs
      registry.register('field-name', nameInput, {
        element: nameInput,
        type: ElementType.DYNAMIC,
        parentId: 'form-1',
      });

      registry.register('field-email', emailInput, {
        element: emailInput,
        type: ElementType.DYNAMIC,
        parentId: 'form-1',
      });

      // Verify structure
      expect(registry.size()).toBe(3);
      expect(registry.getChildren('form-1')).toEqual(['field-name', 'field-email']);
    });

    it('should clean up removed fields', () => {
      const form = document.createElement('form');
      const field1 = document.createElement('input');
      const field2 = document.createElement('input');

      registry.register('form', form, {
        element: form,
        type: ElementType.STATIC,
      });

      registry.register('field-1', field1, {
        element: field1,
        type: ElementType.DYNAMIC,
        parentId: 'form',
      });

      registry.register('field-2', field2, {
        element: field2,
        type: ElementType.DYNAMIC,
        parentId: 'form',
      });

      // Remove one field
      registry.unregister('field-1');

      expect(registry.size()).toBe(2);
      expect(registry.getChildren('form')).toEqual(['field-2']);
    });
  });

  describe('Array rendering scenario', () => {
    it('should handle dynamic list items', () => {
      const list = document.createElement('ul');
      const items = [
        document.createElement('li'),
        document.createElement('li'),
        document.createElement('li'),
      ];

      // Register list
      registry.register('list-1', list, {
        element: list,
        type: ElementType.STATIC,
      });

      // Register list items with indices
      items.forEach((item, index) => {
        registry.register(`item-${index}`, item, {
          element: item,
          type: ElementType.ARRAY_ITEM,
          parentId: 'list-1',
          index,
        });
      });

      expect(registry.size()).toBe(4);
      expect(registry.getChildren('list-1').length).toBe(3);
    });

    it('should update indices when items reordered', () => {
      const list = document.createElement('ul');
      const item0 = document.createElement('li');
      const item1 = document.createElement('li');

      registry.register('list', list, {
        element: list,
        type: ElementType.STATIC,
      });

      registry.register('item-0', item0, {
        element: item0,
        type: ElementType.ARRAY_ITEM,
        parentId: 'list',
        index: 0,
      });

      registry.register('item-1', item1, {
        element: item1,
        type: ElementType.ARRAY_ITEM,
        parentId: 'list',
        index: 1,
      });

      // Simulate reordering - unregister and re-register with new index
      registry.unregister('item-0');
      registry.register('item-0', item0, {
        element: item0,
        type: ElementType.ARRAY_ITEM,
        parentId: 'list',
        index: 1,
      });

      const entry = registry.get('item-0');
      expect(entry?.index).toBe(1);
    });
  });

  describe('Nested component hierarchy', () => {
    it('should handle deeply nested components', () => {
      const root = document.createElement('div');
      const header = document.createElement('header');
      const nav = document.createElement('nav');
      const link1 = document.createElement('a');
      const link2 = document.createElement('a');

      registry.register('root', root, {
        element: root,
        type: ElementType.STATIC,
      });

      registry.register('header', header, {
        element: header,
        type: ElementType.STATIC,
        parentId: 'root',
      });

      registry.register('nav', nav, {
        element: nav,
        type: ElementType.DYNAMIC,
        parentId: 'header',
      });

      registry.register('link-1', link1, {
        element: link1,
        type: ElementType.DYNAMIC,
        parentId: 'nav',
      });

      registry.register('link-2', link2, {
        element: link2,
        type: ElementType.DYNAMIC,
        parentId: 'nav',
      });

      // Verify hierarchy
      expect(registry.getChildren('root')).toEqual(['header']);
      expect(registry.getChildren('header')).toEqual(['nav']);
      expect(registry.getChildren('nav')).toContain('link-1');
      expect(registry.getChildren('nav')).toContain('link-2');
    });

    it('should remove entire subtree when parent unmounted', () => {
      const root = document.createElement('div');
      const child = document.createElement('div');
      const grandchild1 = document.createElement('span');
      const grandchild2 = document.createElement('span');
      const greatGrandchild = document.createElement('i');

      registry.register('root', root, {
        element: root,
        type: ElementType.STATIC,
      });

      registry.register('child', child, {
        element: child,
        type: ElementType.DYNAMIC,
        parentId: 'root',
      });

      registry.register('gc-1', grandchild1, {
        element: grandchild1,
        type: ElementType.DYNAMIC,
        parentId: 'child',
      });

      registry.register('gc-2', grandchild2, {
        element: grandchild2,
        type: ElementType.DYNAMIC,
        parentId: 'child',
      });

      registry.register('ggc', greatGrandchild, {
        element: greatGrandchild,
        type: ElementType.DYNAMIC,
        parentId: 'gc-1',
      });

      expect(registry.size()).toBe(5);

      // Unmount child subtree
      registry.unregisterSubtree('child');

      expect(registry.size()).toBe(1);
      expect(registry.has('root')).toBe(true);
      expect(registry.has('child')).toBe(false);
      expect(registry.has('gc-1')).toBe(false);
      expect(registry.has('gc-2')).toBe(false);
      expect(registry.has('ggc')).toBe(false);
    });
  });

  describe('Portal content scenario', () => {
    it('should track portal content with physical parent', () => {
      const logicalParent = document.createElement('div');
      const portalContent = document.createElement('div');

      registry.register('logical-parent', logicalParent, {
        element: logicalParent,
        type: ElementType.DYNAMIC,
      });

      // Portal content has logical parent but different physical parent
      registry.register('portal-content', portalContent, {
        element: portalContent,
        type: ElementType.PORTAL_CONTENT,
        parentId: 'logical-parent', // Logical hierarchy
        physicalParent: 'body-portal-root', // Physical location
        isPortalContent: true,
      });

      const entry = registry.get('portal-content');
      expect(entry?.parentId).toBe('logical-parent');
      expect(entry?.physicalParent).toBe('body-portal-root');
      expect(entry?.isPortalContent).toBe(true);
    });
  });

  describe('Memory and performance', () => {
    it('should handle many elements efficiently', () => {
      const root = document.createElement('div');

      registry.register('root', root, {
        element: root,
        type: ElementType.STATIC,
      });

      const startTime = performance.now();

      // Register 1000 elements
      for (let i = 0; i < 1000; i++) {
        const el = document.createElement('div');
        registry.register(`el-${i}`, el, {
          element: el,
          type: ElementType.DYNAMIC,
          parentId: 'root',
        });
      }

      const duration = performance.now() - startTime;

      expect(registry.size()).toBe(1001);
      expect(registry.getChildren('root').length).toBe(1000);
      expect(duration).toBeLessThan(50); // Should be <50ms for 1000 elements
    });

    it('should clear large registry efficiently', () => {
      const root = document.createElement('div');

      registry.register('root', root, {
        element: root,
        type: ElementType.STATIC,
      });

      // Register 500 elements
      for (let i = 0; i < 500; i++) {
        const el = document.createElement('div');
        registry.register(`el-${i}`, el, {
          element: el,
          type: ElementType.DYNAMIC,
          parentId: 'root',
        });
      }

      const startTime = performance.now();
      registry.clear();
      const duration = performance.now() - startTime;

      expect(registry.size()).toBe(0);
      expect(duration).toBeLessThan(20); // Should be <20ms to clear
    });
  });
});
