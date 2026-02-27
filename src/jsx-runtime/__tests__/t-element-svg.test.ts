/**
 * Unit Tests — t_element SVG support
 *
 * Verifies that t_element() creates proper SVGElement instances for SVG tags
 * and applies geometry attributes via setAttribute rather than broken property
 * assignment, both for static and reactive values.
 */

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createSignal } from '../../reactivity/signal';
import { $REGISTRY } from '../../registry/core';
import { SVG_NAMESPACE } from '../../utils/svg-tags';
import { t_element } from '../t-element';

describe('t_element — SVG namespace support', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    $REGISTRY.reset();
  });

  afterEach(() => {
    $REGISTRY.reset();
  });

  // -------------------------------------------------------------------------
  // Namespace — element creation
  // -------------------------------------------------------------------------

  describe('SVG element creation', () => {
    it('creates SVG elements in the SVG namespace', () => {
      const circle = t_element('circle', {});
      expect(circle.namespaceURI).toBe(SVG_NAMESPACE);
    });

    it('created SVG element is an SVGElement instance', () => {
      const rect = t_element('rect', {});
      expect(rect).toBeInstanceOf(SVGElement);
    });

    it('creates all common SVG shape tags in the SVG namespace', () => {
      const tags = ['circle', 'ellipse', 'line', 'path', 'polygon', 'polyline', 'rect', 'svg', 'g'];
      for (const tag of tags) {
        const el = t_element(tag, {});
        expect(el.namespaceURI).toBe(SVG_NAMESPACE);
      }
    });

    it('still creates HTML elements in the HTML namespace', () => {
      const div = t_element('div', {});
      expect(div.namespaceURI).toBe('http://www.w3.org/1999/xhtml');
      expect(div).toBeInstanceOf(HTMLDivElement);
    });

    it('creates a <text> SVG element (not the HTML text node)', () => {
      const svgText = t_element('text', {});
      // Should be an SVGElement, not a plain HTMLElement
      expect(svgText).toBeInstanceOf(SVGElement);
      expect(svgText.namespaceURI).toBe(SVG_NAMESPACE);
    });
  });

  // -------------------------------------------------------------------------
  // Static geometry attributes
  // -------------------------------------------------------------------------

  describe('static geometry attributes', () => {
    it('sets cx attribute via setAttribute on a circle', () => {
      const circle = t_element('circle', { cx: '50' } as any);
      expect(circle.getAttribute('cx')).toBe('50');
    });

    it('sets cy and r on a circle', () => {
      const circle = t_element('circle', { cy: '80', r: '30' } as any);
      expect(circle.getAttribute('cy')).toBe('80');
      expect(circle.getAttribute('r')).toBe('30');
    });

    it('sets d attribute on a path element', () => {
      const path = t_element('path', { d: 'M 0 0 L 100 100' } as any);
      expect(path.getAttribute('d')).toBe('M 0 0 L 100 100');
    });

    it('sets points attribute on a polygon', () => {
      const poly = t_element('polygon', { points: '0,0 100,0 50,100' } as any);
      expect(poly.getAttribute('points')).toBe('0,0 100,0 50,100');
    });

    it('sets transform attribute on a group', () => {
      const g = t_element('g', { transform: 'translate(10, 20)' } as any);
      expect(g.getAttribute('transform')).toBe('translate(10, 20)');
    });

    it('maps className prop to the class attribute on SVG elements', () => {
      const circle = t_element('circle', { className: 'highlight' });
      expect(circle.getAttribute('class')).toBe('highlight');
    });

    it('sets fill and stroke as presentation attributes', () => {
      const rect = t_element('rect', { fill: '#ff0000', stroke: '#000' } as any);
      expect(rect.getAttribute('fill')).toBe('#ff0000');
      expect(rect.getAttribute('stroke')).toBe('#000');
    });

    it('sets id via property (not forced through setAttribute)', () => {
      // 'id' is in SVG_DOM_PROPERTIES — should still work as it's handled
      // by an earlier branch in t_element
      const circle = t_element('circle', { id: 'my-circle' });
      expect(circle.id).toBe('my-circle');
    });
  });

  // -------------------------------------------------------------------------
  // Reactive geometry attributes
  // -------------------------------------------------------------------------

  describe('reactive geometry attributes', () => {
    it('wires a reactive cx correctly', () => {
      const [x, setX] = createSignal(50);
      const circle = t_element('circle', { cx: () => String(x()) } as any);
      document.body.appendChild(circle);

      expect(circle.getAttribute('cx')).toBe('50');

      setX(120);
      expect(circle.getAttribute('cx')).toBe('120');
    });

    it('wires multiple reactive geometry attributes independently', () => {
      const [x, setX] = createSignal(10);
      const [y, setY] = createSignal(20);
      const [r, setR] = createSignal(30);

      const circle = t_element('circle', {
        cx: () => String(x()),
        cy: () => String(y()),
        r: () => String(r()),
      } as any);
      document.body.appendChild(circle);

      expect(circle.getAttribute('cx')).toBe('10');
      expect(circle.getAttribute('cy')).toBe('20');
      expect(circle.getAttribute('r')).toBe('30');

      setX(100);
      expect(circle.getAttribute('cx')).toBe('100');
      expect(circle.getAttribute('cy')).toBe('20'); // unchanged
      expect(circle.getAttribute('r')).toBe('30'); // unchanged

      setR(5);
      expect(circle.getAttribute('r')).toBe('5');
    });

    it('wires a reactive transform attribute', () => {
      const [tx, setTx] = createSignal(0);
      const [ty, setTy] = createSignal(0);

      const g = t_element('g', {
        transform: () => `translate(${tx()}, ${ty()})`,
      } as any);
      document.body.appendChild(g);

      expect(g.getAttribute('transform')).toBe('translate(0, 0)');

      setTx(50);
      setTy(100);
      expect(g.getAttribute('transform')).toBe('translate(50, 100)');
    });

    it('wires a reactive d attribute on a path', () => {
      const [x2, setX2] = createSignal(100);
      const path = t_element('path', {
        d: () => `M 0 0 L ${x2()} 100`,
      } as any);
      document.body.appendChild(path);

      expect(path.getAttribute('d')).toBe('M 0 0 L 100 100');

      setX2(200);
      expect(path.getAttribute('d')).toBe('M 0 0 L 200 100');
    });

    it('wires a reactive className to the class attribute', () => {
      const [active, setActive] = createSignal(false);
      const circle = t_element('circle', {
        className: () => (active() ? 'shape active' : 'shape'),
      });
      document.body.appendChild(circle);

      expect(circle.getAttribute('class')).toBe('shape');

      setActive(true);
      expect(circle.getAttribute('class')).toBe('shape active');
    });
  });

  // -------------------------------------------------------------------------
  // HTML style properties still work on SVG elements
  // -------------------------------------------------------------------------

  describe('style properties on SVG elements', () => {
    it('sets style.left reactively on an SVG element', () => {
      const [left, setLeft] = createSignal(10);
      const circle = t_element('circle', {
        style: { left: () => `${left()}px` },
      });
      document.body.appendChild(circle);

      expect((circle as HTMLElement).style.left).toBe('10px');

      setLeft(50);
      expect((circle as HTMLElement).style.left).toBe('50px');
    });
  });

  // -------------------------------------------------------------------------
  // HTML elements are unaffected
  // -------------------------------------------------------------------------

  describe('HTML element regression', () => {
    it('still sets textContent via property on div', () => {
      const div = t_element('div', {});
      $REGISTRY.wire(div, 'textContent', () => 'hello');
      expect(div.textContent).toBe('hello');
    });

    it('still sets style.left via property on div', () => {
      const [x, setX] = createSignal(10);
      const div = t_element('div', {});
      document.body.appendChild(div); // must be connected for el.isConnected guard
      $REGISTRY.wire(div, 'style.left', () => `${x()}px`);
      setX(99);
      expect((div as HTMLElement).style.left).toBe('99px');
    });
  });
});
