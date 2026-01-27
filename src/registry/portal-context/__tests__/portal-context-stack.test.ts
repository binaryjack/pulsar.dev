/**
 * Portal Context Stack Tests
 */

import { PortalContextStack } from '../portal-context-stack';
import type { IContextStackEntry } from '../portal-context-stack.types';

describe('PortalContextStack', () => {
  let stack: ReturnType<typeof PortalContextStack>;

  beforeEach(() => {
    stack = new (PortalContextStack as any)();
  });

  describe('push and pop', () => {
    it('should push context entries', () => {
      const entry: IContextStackEntry = {
        elementId: 'a.0.0.0',
        element: document.createElement('div'),
        isPortal: false,
      };

      stack.push(entry);

      expect(stack.size()).toBe(1);
      expect(stack.current()).toBe(entry);
    });

    it('should pop context entries', () => {
      const entry1: IContextStackEntry = {
        elementId: 'a.0.0.0',
        element: document.createElement('div'),
        isPortal: false,
      };
      const entry2: IContextStackEntry = {
        elementId: 'a.0.0.1',
        element: document.createElement('div'),
        parentId: 'a.0.0.0',
        isPortal: false,
      };

      stack.push(entry1);
      stack.push(entry2);

      expect(stack.size()).toBe(2);

      const popped = stack.pop();
      expect(popped).toBe(entry2);
      expect(stack.size()).toBe(1);
      expect(stack.current()).toBe(entry1);
    });

    it('should return undefined when popping empty stack', () => {
      expect(stack.pop()).toBeUndefined();
    });
  });

  describe('current and parent', () => {
    it('should return current context entry', () => {
      const entry1: IContextStackEntry = {
        elementId: 'a.0.0.0',
        element: document.createElement('div'),
        isPortal: false,
      };
      const entry2: IContextStackEntry = {
        elementId: 'a.0.0.1',
        element: document.createElement('div'),
        parentId: 'a.0.0.0',
        isPortal: false,
      };

      stack.push(entry1);
      stack.push(entry2);

      expect(stack.current()).toBe(entry2);
    });

    it('should return undefined for current when stack is empty', () => {
      expect(stack.current()).toBeUndefined();
    });

    it('should return parent context entry', () => {
      const entry1: IContextStackEntry = {
        elementId: 'a.0.0.0',
        element: document.createElement('div'),
        isPortal: false,
      };
      const entry2: IContextStackEntry = {
        elementId: 'a.0.0.1',
        element: document.createElement('div'),
        parentId: 'a.0.0.0',
        isPortal: false,
      };

      stack.push(entry1);
      stack.push(entry2);

      expect(stack.parent()).toBe(entry1);
    });

    it('should return undefined for parent when only one entry', () => {
      const entry: IContextStackEntry = {
        elementId: 'a.0.0.0',
        element: document.createElement('div'),
        isPortal: false,
      };

      stack.push(entry);
      expect(stack.parent()).toBeUndefined();
    });

    it('should return undefined for parent when stack is empty', () => {
      expect(stack.parent()).toBeUndefined();
    });
  });

  describe('find', () => {
    it('should find context entry by element ID', () => {
      const entry1: IContextStackEntry = {
        elementId: 'a.0.0.0',
        element: document.createElement('div'),
        isPortal: false,
      };
      const entry2: IContextStackEntry = {
        elementId: 'a.0.0.1',
        element: document.createElement('div'),
        parentId: 'a.0.0.0',
        isPortal: false,
      };

      stack.push(entry1);
      stack.push(entry2);

      const found = stack.find('a.0.0.0');
      expect(found).toBe(entry1);
    });

    it('should return undefined when entry not found', () => {
      const found = stack.find('nonexistent');
      expect(found).toBeUndefined();
    });
  });

  describe('getLogicalChain', () => {
    it('should return logical parent chain', () => {
      const root: IContextStackEntry = {
        elementId: 'a.0.0.0',
        element: document.createElement('div'),
        isPortal: false,
      };
      const child: IContextStackEntry = {
        elementId: 'a.0.0.1',
        element: document.createElement('div'),
        parentId: 'a.0.0.0',
        isPortal: false,
      };
      const grandchild: IContextStackEntry = {
        elementId: 'a.0.0.2',
        element: document.createElement('div'),
        parentId: 'a.0.0.1',
        isPortal: false,
      };

      stack.push(root);
      stack.push(child);
      stack.push(grandchild);

      const chain = stack.getLogicalChain('a.0.0.2');
      expect(chain).toEqual([root, child, grandchild]);
    });

    it('should return empty chain for nonexistent element', () => {
      const chain = stack.getLogicalChain('nonexistent');
      expect(chain).toEqual([]);
    });

    it('should handle root element (no parent)', () => {
      const root: IContextStackEntry = {
        elementId: 'a.0.0.0',
        element: document.createElement('div'),
        isPortal: false,
      };

      stack.push(root);

      const chain = stack.getLogicalChain('a.0.0.0');
      expect(chain).toEqual([root]);
    });

    it('should handle portal content with logical parent', () => {
      const parent: IContextStackEntry = {
        elementId: 'a.0.0.0',
        element: document.createElement('div'),
        isPortal: false,
      };
      const portalContent: IContextStackEntry = {
        elementId: 'a.0.0.1',
        element: document.createElement('div'),
        parentId: 'a.0.0.0', // Logical parent
        physicalParentId: 'body-root', // Physical location
        isPortal: true,
      };

      stack.push(parent);
      stack.push(portalContent);

      const chain = stack.getLogicalChain('a.0.0.1');
      // Chain follows logical hierarchy, not physical
      expect(chain).toEqual([parent, portalContent]);
    });
  });

  describe('clear and size', () => {
    it('should clear all entries', () => {
      const entry1: IContextStackEntry = {
        elementId: 'a.0.0.0',
        element: document.createElement('div'),
        isPortal: false,
      };
      const entry2: IContextStackEntry = {
        elementId: 'a.0.0.1',
        element: document.createElement('div'),
        parentId: 'a.0.0.0',
        isPortal: false,
      };

      stack.push(entry1);
      stack.push(entry2);

      expect(stack.size()).toBe(2);

      stack.clear();

      expect(stack.size()).toBe(0);
      expect(stack.current()).toBeUndefined();
    });

    it('should report correct size', () => {
      expect(stack.size()).toBe(0);

      stack.push({
        elementId: 'a.0.0.0',
        element: document.createElement('div'),
        isPortal: false,
      });
      expect(stack.size()).toBe(1);

      stack.push({
        elementId: 'a.0.0.1',
        element: document.createElement('div'),
        parentId: 'a.0.0.0',
        isPortal: false,
      });
      expect(stack.size()).toBe(2);

      stack.pop();
      expect(stack.size()).toBe(1);
    });
  });
});
