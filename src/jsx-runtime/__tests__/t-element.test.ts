/**
 * Unit Tests for t_element
 * Tests SSR-aware element creation
 */

import { beforeEach, describe, expect, it } from 'vitest';
import { t_element } from '../t-element';

describe('t_element - Unit Tests', () => {
  beforeEach(() => {
    // Clear DOM
    if (typeof document !== 'undefined') {
      document.body.innerHTML = '';
    }
  });

  describe('Basic Element Creation', () => {
    it('should create element with tag name', () => {
      const el = t_element('div', {});

      expect(el).toBeInstanceOf(HTMLDivElement);
      expect(el.tagName).toBe('DIV');
    });

    it('should create different element types', () => {
      const div = t_element('div', {});
      const span = t_element('span', {});
      const button = t_element('button', {});

      expect(div.tagName).toBe('DIV');
      expect(span.tagName).toBe('SPAN');
      expect(button.tagName).toBe('BUTTON');
    });
  });

  describe('Attribute Setting', () => {
    it('should set className attribute', () => {
      const el = t_element('div', { className: 'box' });

      expect(el.className).toBe('box');
    });

    it('should set id attribute', () => {
      const el = t_element('div', { id: 'my-div' });

      expect(el.id).toBe('my-div');
    });

    it('should set multiple attributes', () => {
      const el = t_element('div', {
        className: 'box draggable',
        id: 'box-1',
        title: 'Draggable Box',
      });

      expect(el.className).toBe('box draggable');
      expect(el.id).toBe('box-1');
      expect(el.title).toBe('Draggable Box');
    });

    it('should set data attributes', () => {
      const el = t_element('div', {
        'data-id': '123',
        'data-type': 'box',
      });

      expect(el.getAttribute('data-id')).toBe('123');
      expect(el.getAttribute('data-type')).toBe('box');
    });

    it('should set style attribute', () => {
      const el = t_element('div', {
        style: 'color: red; font-size: 14px',
      });

      expect(el.style.color).toBe('red');
      expect(el.style.fontSize).toBe('14px');
    });
  });

  describe('SSR Hydration (data-hid)', () => {
    it('should pick existing element by data-hid', () => {
      // Simulate server-rendered HTML
      document.body.innerHTML = '<div data-hid="el_0" class="server-rendered">Hello</div>';

      const el = t_element('div', { 'data-hid': 'el_0' });

      expect(el.className).toBe('server-rendered');
      expect(el.textContent).toBe('Hello');
    });

    it('should create new element if data-hid not found', () => {
      // No matching element in DOM
      const el = t_element('div', { 'data-hid': 'el_999', className: 'new' });

      expect(el.className).toBe('new');
      expect(el.textContent).toBe('');
    });

    it('should update attributes on picked element', () => {
      document.body.innerHTML = '<div data-hid="el_0">Hello</div>';

      const el = t_element('div', {
        'data-hid': 'el_0',
        className: 'updated',
      });

      expect(el.className).toBe('updated');
      expect(el.textContent).toBe('Hello'); // Preserved from server
    });

    it('should handle multiple hydrations', () => {
      document.body.innerHTML = `
        <div data-hid="el_0">First</div>
        <div data-hid="el_1">Second</div>
        <div data-hid="el_2">Third</div>
      `;

      const el0 = t_element('div', { 'data-hid': 'el_0' });
      const el1 = t_element('div', { 'data-hid': 'el_1' });
      const el2 = t_element('div', { 'data-hid': 'el_2' });

      expect(el0.textContent).toBe('First');
      expect(el1.textContent).toBe('Second');
      expect(el2.textContent).toBe('Third');
    });
  });

  describe('Property vs Attribute', () => {
    it('should set textContent as property', () => {
      const el = t_element('div', { textContent: 'Hello World' });

      expect(el.textContent).toBe('Hello World');
    });

    it('should set value for input elements', () => {
      const el = t_element('input', { value: 'test' }) as HTMLInputElement;

      expect(el.value).toBe('test');
    });

    it('should set checked for checkboxes', () => {
      const el = t_element('input', {
        type: 'checkbox',
        checked: true,
      }) as HTMLInputElement;

      expect(el.checked).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty attributes object', () => {
      const el = t_element('div', {});

      expect(el.tagName).toBe('DIV');
    });

    it('should handle null/undefined attribute values', () => {
      const el = t_element('div', {
        className: null,
        title: undefined,
      } as any);

      // Should not throw
      expect(el.tagName).toBe('DIV');
    });

    it('should handle numeric attribute values', () => {
      const el = t_element('div', {
        'data-count': 42,
        'data-index': 0,
      } as any);

      expect(el.getAttribute('data-count')).toBe('42');
      expect(el.getAttribute('data-index')).toBe('0');
    });

    it('should handle boolean attributes', () => {
      const el = t_element('button', {
        disabled: true,
      } as any);

      expect((el as HTMLButtonElement).disabled).toBe(true);
    });

    it('should handle nested object attributes (style)', () => {
      const el = t_element('div', {
        style: {
          color: 'red',
          fontSize: '14px',
        },
      } as any);

      expect(el.style.color).toBe('red');
      expect(el.style.fontSize).toBe('14px');
    });
  });

  describe('Performance', () => {
    it('should handle rapid element creation', () => {
      const elements = [];

      for (let i = 0; i < 1000; i++) {
        const el = t_element('div', { className: `box-${i}` });
        elements.push(el);
      }

      expect(elements.length).toBe(1000);
      expect(elements[0].className).toBe('box-0');
      expect(elements[999].className).toBe('box-999');
    });

    it('should handle large attribute objects', () => {
      const attrs: any = {};
      for (let i = 0; i < 50; i++) {
        attrs[`data-prop-${i}`] = `value-${i}`;
      }

      const el = t_element('div', attrs);

      expect(el.getAttribute('data-prop-0')).toBe('value-0');
      expect(el.getAttribute('data-prop-49')).toBe('value-49');
    });
  });
});
