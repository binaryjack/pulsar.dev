/**
 * createElementWithRegistry Tests
 */

import { vi } from 'vitest';
import { ApplicationRoot } from '../../bootstrap/application-root';
import { clearCurrentAppRoot, setCurrentAppRoot } from '../../registry/app-root-context';
import { ElementType } from '../../registry/types/element-type.enum';
import type { IRegistryContext } from '../create-element-with-registry';
import { appendChildren, createElementWithRegistry } from '../create-element-with-registry';

describe('createElementWithRegistry', () => {
  let appRoot: any;
  let rootElement: HTMLElement;

  beforeEach(() => {
    rootElement = document.createElement('div');
    appRoot = new (ApplicationRoot as any)(rootElement);
    setCurrentAppRoot(appRoot);
  });

  afterEach(() => {
    clearCurrentAppRoot();
  });

  describe('intrinsic elements', () => {
    it('should create a simple div element', () => {
      const element = createElementWithRegistry('div', {});

      expect(element.tagName).toBe('DIV');
      expect(element).toBeInstanceOf(HTMLDivElement);
    });

    it('should apply className', () => {
      const element = createElementWithRegistry('div', {
        className: 'test-class',
      });

      expect(element.className).toBe('test-class');
    });

    it('should attach event listeners', () => {
      const handleClick = vi.fn();
      const element = createElementWithRegistry('button', {
        onclick: handleClick,
      });

      element.click();
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should set attributes', () => {
      const element = createElementWithRegistry('button', {
        'aria-label': 'Test button',
        'data-testid': 'my-button',
        role: 'button',
      });

      expect(element.getAttribute('aria-label')).toBe('Test button');
      expect(element.getAttribute('data-testid')).toBe('my-button');
      expect(element.getAttribute('role')).toBe('button');
    });

    it('should apply style object', () => {
      const element = createElementWithRegistry('div', {
        style: {
          color: 'red',
          fontSize: '16px',
        },
      });

      expect(element.style.color).toBe('red');
      expect(element.style.fontSize).toBe('16px');
    });
  });

  describe('component elements', () => {
    it('should call component function', () => {
      const MyComponent = vi.fn((props: any) => {
        const el = document.createElement('div');
        el.textContent = props.text;
        return el;
      });

      const element = createElementWithRegistry(MyComponent, { text: 'Hello' });

      expect(MyComponent).toHaveBeenCalledWith({ text: 'Hello' });
      expect(element.textContent).toBe('Hello');
    });
  });

  describe('registry integration', () => {
    it('should register element with registry', () => {
      const registryCtx: IRegistryContext = {
        elementType: ElementType.COMPONENT,
      };

      const element = createElementWithRegistry('div', {}, registryCtx);

      // Element should have __elementId
      expect('__elementId' in element).toBe(true);
      const elementId = (element as any).__elementId;

      // Should be registered
      expect(appRoot.registry.has(elementId)).toBe(true);

      // Entry should have correct type
      const entry = appRoot.registry.get(elementId);
      expect(entry?.type).toBe(ElementType.COMPONENT);
      expect(entry?.element).toBe(element);
    });

    it('should generate hierarchical IDs', () => {
      const parentCtx: IRegistryContext = {
        elementType: ElementType.COMPONENT,
      };
      const parent = createElementWithRegistry('div', {}, parentCtx);
      const parentId = (parent as any).__elementId;

      const childCtx: IRegistryContext = {
        parentId,
        index: 0,
        elementType: ElementType.COMPONENT,
      };
      const child = createElementWithRegistry('span', {}, childCtx);
      const childId = (child as any).__elementId;

      // Child ID should contain parent ID
      expect(childId).toContain(parentId);

      // Registry should track parent-child relationship
      const childEntry = appRoot.registry.get(childId);
      expect(childEntry?.parentId).toBe(parentId);

      // Parent should have child in children set
      const children = appRoot.registry.getChildren(parentId);
      expect(children).toContain(childId);
    });

    it('should store parent ID on element', () => {
      const parentId = 'a.0.0.0';
      const registryCtx: IRegistryContext = {
        parentId,
        index: 0,
        elementType: ElementType.COMPONENT,
      };

      const element = createElementWithRegistry('div', {}, registryCtx);

      expect('__parentId' in element).toBe(true);
      expect((element as any).__parentId).toBe(parentId);
    });

    it('should work without ApplicationRoot (graceful degradation)', () => {
      clearCurrentAppRoot();

      const element = createElementWithRegistry(
        'div',
        {},
        {
          elementType: ElementType.COMPONENT,
        }
      );

      // Should still create element
      expect(element).toBeInstanceOf(HTMLDivElement);

      // But no __elementId
      expect('__elementId' in element).toBe(false);
    });
  });

  describe('appendChildren', () => {
    it('should append HTMLElement children', () => {
      const parent = document.createElement('div');
      const child1 = document.createElement('span');
      const child2 = document.createElement('p');

      appendChildren(parent, [child1, child2]);

      expect(parent.children.length).toBe(2);
      expect(parent.children[0]).toBe(child1);
      expect(parent.children[1]).toBe(child2);
    });

    it('should append text children', () => {
      const parent = document.createElement('div');

      appendChildren(parent, ['Hello', 123]);

      expect(parent.childNodes.length).toBe(2);
      expect(parent.childNodes[0].textContent).toBe('Hello');
      expect(parent.childNodes[1].textContent).toBe('123');
    });

    it('should handle mixed children', () => {
      const parent = document.createElement('div');
      const span = document.createElement('span');

      appendChildren(parent, ['Text before ', span, ' text after']);

      expect(parent.childNodes.length).toBe(3);
      expect(parent.childNodes[0].textContent).toBe('Text before ');
      expect(parent.childNodes[1]).toBe(span);
      expect(parent.childNodes[2].textContent).toBe(' text after');
    });

    it('should update parent relationship in registry', () => {
      const parentId = 'a.0.0.0';
      const parentCtx: IRegistryContext = {
        elementType: ElementType.COMPONENT,
      };
      const parent = createElementWithRegistry('div', {}, parentCtx);
      Object.defineProperty(parent, '__elementId', { value: parentId });

      const childCtx: IRegistryContext = {
        elementType: ElementType.COMPONENT,
      };
      const child = createElementWithRegistry('span', {}, childCtx);
      const childId = (child as any).__elementId;

      // Initially no parent
      let entry = appRoot.registry.get(childId);
      expect(entry?.parentId).toBeUndefined();

      // Append with parent ID tracking
      appendChildren(parent, child, parentId);

      // Now should have parent
      entry = appRoot.registry.get(childId);
      expect(entry?.parentId).toBe(parentId);
    });
  });

  describe('complex scenarios', () => {
    it('should handle nested component tree', () => {
      // Root
      const rootCtx: IRegistryContext = {
        elementType: ElementType.COMPONENT,
      };
      const root = createElementWithRegistry('div', {}, rootCtx);
      const rootId = (root as any).__elementId;

      // Child 1
      const child1Ctx: IRegistryContext = {
        parentId: rootId,
        index: 0,
        elementType: ElementType.COMPONENT,
      };
      const child1 = createElementWithRegistry('div', {}, child1Ctx);
      const child1Id = (child1 as any).__elementId;

      // Child 2
      const child2Ctx: IRegistryContext = {
        parentId: rootId,
        index: 1,
        elementType: ElementType.COMPONENT,
      };
      const child2 = createElementWithRegistry('div', {}, child2Ctx);
      const child2Id = (child2 as any).__elementId;

      // Grandchild
      const grandchildCtx: IRegistryContext = {
        parentId: child1Id,
        index: 0,
        elementType: ElementType.COMPONENT,
      };
      const grandchild = createElementWithRegistry('span', {}, grandchildCtx);
      const grandchildId = (grandchild as any).__elementId;

      // Verify registry structure
      expect(appRoot.registry.size()).toBe(4);

      // Root has 2 children
      const rootChildren = appRoot.registry.getChildren(rootId);
      expect(rootChildren.length).toBe(2);
      expect(rootChildren).toContain(child1Id);
      expect(rootChildren).toContain(child2Id);

      // Child1 has 1 child
      const child1Children = appRoot.registry.getChildren(child1Id);
      expect(child1Children.length).toBe(1);
      expect(child1Children).toContain(grandchildId);

      // Child2 has no children
      const child2Children = appRoot.registry.getChildren(child2Id);
      expect(child2Children.length).toBe(0);
    });

    it('should handle component with intrinsic children', () => {
      const Container = (props: any) => {
        const div = createElementWithRegistry(
          'div',
          { className: 'container' },
          {
            elementType: ElementType.COMPONENT,
          }
        );
        return div;
      };

      const container = createElementWithRegistry(
        Container,
        {},
        {
          elementType: ElementType.COMPONENT,
        }
      );

      expect(container.className).toBe('container');
      expect('__elementId' in container).toBe(true);
    });
  });
});
