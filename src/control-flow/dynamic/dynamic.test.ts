/**
 * Dynamic Component Tests
 */

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createSignal } from '../../reactivity';
import { componentRegistry } from './component-registry';
import { Dynamic } from './dynamic-component';

describe('Dynamic Component', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    componentRegistry.clear();
  });

  afterEach(() => {
    document.body.removeChild(container);
    componentRegistry.clear();
  });

  describe('Function Components', () => {
    it('should render function component', () => {
      const TestComponent = (props: { text: string }) => {
        const el = document.createElement('div');
        el.textContent = props.text;
        return el;
      };

      const dynamicEl = Dynamic({
        component: TestComponent,
        text: 'Hello',
      });

      container.appendChild(dynamicEl);
      expect(dynamicEl.children[0].textContent).toBe('Hello');
    });

    it('should forward all props except component', () => {
      const TestComponent = (props: { title: string; value: number; flag: boolean }) => {
        const el = document.createElement('div');
        el.textContent = `${props.title}: ${props.value}, ${props.flag}`;
        return el;
      };

      const dynamicEl = Dynamic({
        component: TestComponent,
        title: 'Test',
        value: 42,
        flag: true,
      });

      container.appendChild(dynamicEl);
      expect(dynamicEl.children[0].textContent).toBe('Test: 42, true');
    });

    it('should render with signal-based component selection', async () => {
      const Button = (props: { text: string }) => {
        const el = document.createElement('button');
        el.textContent = props.text;
        return el;
      };

      const Link = (props: { text: string }) => {
        const el = document.createElement('a');
        el.textContent = props.text;
        return el;
      };

      const [component, setComponent] = createSignal(Button);

      const dynamicEl = Dynamic({
        component: component,
        text: 'Click me',
      });

      container.appendChild(dynamicEl);

      // Initially Button
      expect((dynamicEl.firstChild as HTMLElement).tagName).toBe('BUTTON');
      expect((dynamicEl.firstChild as HTMLElement).textContent).toBe('Click me');

      // Switch to Link
      setComponent(Link);

      // Wait for effect to run
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Should now be Link
      expect((dynamicEl.firstChild as HTMLElement).tagName).toBe('A');
      expect((dynamicEl.firstChild as HTMLElement).textContent).toBe('Click me');
    });
  });

  describe('String Component Resolution', () => {
    it('should resolve component from registry', () => {
      const Button = (props: { text: string }) => {
        const el = document.createElement('button');
        el.textContent = props.text;
        return el;
      };

      componentRegistry.register('Button', Button);

      const dynamicEl = Dynamic({
        component: 'Button',
        text: 'Click me',
      });

      container.appendChild(dynamicEl);
      expect(dynamicEl.children[0].tagName).toBe('BUTTON');
      expect(dynamicEl.children[0].textContent).toBe('Click me');
    });

    it('should show warning when component not found', async () => {
      const dynamicEl = Dynamic({
        component: 'NonExistentComponent',
        text: 'Test',
      });

      container.appendChild(dynamicEl);
      await new Promise((resolve) => setTimeout(resolve, 10)); // Longer timeout
      expect(dynamicEl.firstChild).toBeTruthy();
      expect((dynamicEl.firstChild as HTMLElement).innerHTML).toContain('Component Not Found');
      expect((dynamicEl.firstChild as HTMLElement).innerHTML).toContain('NonExistentComponent');
    });

    it('should switch between registered components', () => {
      const Button = (props: { text: string }) => {
        const el = document.createElement('button');
        el.textContent = props.text;
        return el;
      };

      const Link = (props: { text: string }) => {
        const el = document.createElement('a');
        el.textContent = props.text;
        return el;
      };

      componentRegistry.register('Button', Button);
      componentRegistry.register('Link', Link);

      const [type, setType] = createSignal<string>('Button');

      const dynamicEl = Dynamic({
        component: type,
        text: 'Click me',
      });

      container.appendChild(dynamicEl);

      // Initially Button
      expect(dynamicEl.children[0].tagName).toBe('BUTTON');

      // Switch to Link
      setType('Link');

      // Should now be Link
      expect(dynamicEl.children[0].tagName).toBe('A');
    });
  });

  describe('Component Registry', () => {
    it('should register and resolve components', () => {
      const TestComponent = () => document.createElement('div');

      componentRegistry.register('Test', TestComponent);

      expect(componentRegistry.has('Test')).toBe(true);
      expect(componentRegistry.resolve('Test')).toBe(TestComponent);
    });

    it('should throw error for invalid registration', () => {
      expect(() => {
        componentRegistry.register('', () => document.createElement('div'));
      }).toThrow('Component name must be a non-empty string');

      expect(() => {
        componentRegistry.register('Test', 'not-a-function' as any);
      }).toThrow('Component must be a function');
    });

    it('should clear all registered components', () => {
      componentRegistry.register('Button', () => document.createElement('button'));
      componentRegistry.register('Link', () => document.createElement('a'));

      expect(componentRegistry.has('Button')).toBe(true);
      expect(componentRegistry.has('Link')).toBe(true);

      componentRegistry.clear();

      expect(componentRegistry.has('Button')).toBe(false);
      expect(componentRegistry.has('Link')).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('should handle null component', async () => {
      const dynamicEl = Dynamic({
        component: null as any,
        text: 'Test',
      });

      container.appendChild(dynamicEl);
      await new Promise((resolve) => setTimeout(resolve, 10));
      expect(dynamicEl.firstChild).toBeTruthy();
      expect((dynamicEl.firstChild as HTMLElement).innerHTML).toContain('Component Not Found');
    });

    it('should handle undefined component', async () => {
      const dynamicEl = Dynamic({
        component: undefined as any,
        text: 'Test',
      });

      container.appendChild(dynamicEl);
      await new Promise((resolve) => setTimeout(resolve, 10));
      expect(dynamicEl.firstChild).toBeTruthy();
      expect((dynamicEl.firstChild as HTMLElement).innerHTML).toContain('Component Not Found');
    });

    it('should handle component that throws error', async () => {
      const ErrorComponent = () => {
        throw new Error('Component error');
      };

      const dynamicEl = Dynamic({
        component: ErrorComponent,
        text: 'Test',
      });

      container.appendChild(dynamicEl);
      await new Promise((resolve) => setTimeout(resolve, 10));
      expect(dynamicEl.firstChild).toBeTruthy();
      expect((dynamicEl.firstChild as HTMLElement).innerHTML).toContain('Dynamic Component Error');
      expect((dynamicEl.firstChild as HTMLElement).innerHTML).toContain('Component error');
    });

    it('should handle rapid component switches', async () => {
      const Button = () => document.createElement('button');
      const Link = () => document.createElement('a');
      const Div = () => document.createElement('div');

      const [component, setComponent] = createSignal(Button);

      const dynamicEl = Dynamic({
        component: component,
      });

      container.appendChild(dynamicEl);

      expect((dynamicEl.firstChild as HTMLElement).tagName).toBe('BUTTON');

      setComponent(Link);
      await new Promise((resolve) => setTimeout(resolve, 10));
      expect((dynamicEl.firstChild as HTMLElement).tagName).toBe('A');

      setComponent(Div);
      await new Promise((resolve) => setTimeout(resolve, 10));
      expect((dynamicEl.firstChild as HTMLElement).tagName).toBe('DIV');

      setComponent(Button);
      await new Promise((resolve) => setTimeout(resolve, 10));
      expect((dynamicEl.firstChild as HTMLElement).tagName).toBe('BUTTON');
    });

    it('should handle component with no props', async () => {
      const SimpleComponent = () => {
        const el = document.createElement('div');
        el.textContent = 'Simple';
        return el;
      };

      const dynamicEl = Dynamic({
        component: SimpleComponent,
      });

      container.appendChild(dynamicEl);
      await new Promise((resolve) => setTimeout(resolve, 10));
      expect(dynamicEl.firstChild).toBeTruthy();
      expect((dynamicEl.firstChild as HTMLElement).textContent).toBe('Simple');
    });
  });

  describe('Mixed Component Maps', () => {
    it('should work with component maps', () => {
      const Button = (props: { text: string }) => {
        const el = document.createElement('button');
        el.textContent = props.text;
        return el;
      };

      const Link = (props: { text: string }) => {
        const el = document.createElement('a');
        el.textContent = props.text;
        return el;
      };

      const Input = (props: { text: string }) => {
        const el = document.createElement('input');
        el.value = props.text;
        return el;
      };

      const componentMap: Record<string, (props: any) => HTMLElement> = {
        button: Button,
        link: Link,
        input: Input,
      };

      const [type, setType] = createSignal<'button' | 'link' | 'input'>('button');

      const dynamicEl = Dynamic({
        component: () => componentMap[type()],
        text: 'Test',
      });

      container.appendChild(dynamicEl);

      expect(dynamicEl.children[0].tagName).toBe('BUTTON');

      setType('link');
      expect(dynamicEl.children[0].tagName).toBe('A');

      setType('input');
      expect(dynamicEl.children[0].tagName).toBe('INPUT');
    });
  });

  describe('Reactive Props', () => {
    it('should work with reactive props', () => {
      const TestComponent = (props: { text: string }) => {
        const el = document.createElement('div');
        el.textContent = props.text;
        return el;
      };

      const [text, setText] = createSignal('Initial');

      const dynamicEl = Dynamic({
        component: TestComponent,
        text: text(),
      });

      container.appendChild(dynamicEl);
      expect(dynamicEl.children[0].textContent).toBe('Initial');

      // Note: Props are passed at creation time, not reactive
      // If you need reactive props, the component itself should use signals
      setText('Updated');
      // Text won't update because props are not reactive by default
      expect(dynamicEl.children[0].textContent).toBe('Initial');
    });
  });
});
