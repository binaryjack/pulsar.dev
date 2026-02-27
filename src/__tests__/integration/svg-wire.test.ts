/**
 * Integration Tests — SVG Reactive Drawing
 *
 * Tests the complete signal → wire → SVGElement.setAttribute pipeline,
 * covering every scenario needed for vector-drawing-grade reactivity:
 *
 *   1. SVG element creation via t_element()
 *   2. wire() routing to setAttribute for geometry attributes
 *   3. wire() continues using property assignment for dotted paths (style.*)
 *   4. wire() handles null/undefined gracefully with a warning
 *   5. Change-detection skips redundant setAttribute calls
 *   6. batch() coalesces multiple geometry updates into a single effect pass
 *   7. Disposer stops attribute updates after cleanup
 *   8. scheduleFrame() + flushFrames() simulates a 60fps drag loop
 *   9. Full SVG scene: multiple shapes, linked signals, coordinated updates
 *  10. HTML wires are completely unaffected by all SVG changes
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { t_element } from '../../jsx-runtime/t-element';
import { batch } from '../../reactivity/batch';
import { clearFrames, flushFrames, scheduleFrame } from '../../reactivity/frame-scheduler';
import { createSignal } from '../../reactivity/signal';
import { $REGISTRY } from '../../registry/core';
import { SVG_NAMESPACE } from '../../utils/svg-tags';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Creates a proper SVGSVGElement and appends it to body. */
function makeSvg(): SVGSVGElement {
  const svg = document.createElementNS(SVG_NAMESPACE, 'svg') as SVGSVGElement;
  svg.setAttribute('width', '800');
  svg.setAttribute('height', '600');
  document.body.appendChild(svg);
  return svg;
}

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------

describe('SVG Reactive Drawing — Integration', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    $REGISTRY.reset();
    clearFrames();
  });

  afterEach(() => {
    $REGISTRY.reset();
    clearFrames();
    vi.restoreAllMocks();
  });

  // -------------------------------------------------------------------------
  // 1. SVG element creation
  // -------------------------------------------------------------------------

  describe('SVG element creation via t_element()', () => {
    it('produces an SVGCircleElement in the SVG namespace', () => {
      const circle = t_element('circle', {});
      expect(circle.namespaceURI).toBe(SVG_NAMESPACE);
      expect(circle).toBeInstanceOf(SVGElement);
    });

    it('circle with static geometry attributes stores them as attributes', () => {
      const circle = t_element('circle', { cx: '100', cy: '200', r: '50' } as any);
      expect(circle.getAttribute('cx')).toBe('100');
      expect(circle.getAttribute('cy')).toBe('200');
      expect(circle.getAttribute('r')).toBe('50');
    });
  });

  // -------------------------------------------------------------------------
  // 2. wire() → setAttribute for SVG geometry attributes
  // -------------------------------------------------------------------------

  describe('wire() routes SVG geometry to setAttribute', () => {
    it('wires cx/cy/r via setAttribute', () => {
      const [cx, setCx] = createSignal(50);
      const [cy, setCy] = createSignal(80);
      const [r, setR] = createSignal(20);

      const circle = t_element('circle', {});
      const svg = makeSvg();
      svg.appendChild(circle);

      $REGISTRY.wire(circle, 'cx', () => String(cx()));
      $REGISTRY.wire(circle, 'cy', () => String(cy()));
      $REGISTRY.wire(circle, 'r', () => String(r()));

      expect(circle.getAttribute('cx')).toBe('50');
      expect(circle.getAttribute('cy')).toBe('80');
      expect(circle.getAttribute('r')).toBe('20');

      setCx(150);
      expect(circle.getAttribute('cx')).toBe('150');
      expect(circle.getAttribute('cy')).toBe('80'); // unchanged

      setR(40);
      expect(circle.getAttribute('r')).toBe('40');
    });

    it('wires d attribute on a path', () => {
      const [x2, setX2] = createSignal(100);
      const path = t_element('path', {});
      makeSvg().appendChild(path);

      $REGISTRY.wire(path, 'd', () => `M 0 0 L ${x2()} 0`);

      expect(path.getAttribute('d')).toBe('M 0 0 L 100 0');

      setX2(300);
      expect(path.getAttribute('d')).toBe('M 0 0 L 300 0');
    });

    it('wires transform on a group element', () => {
      const [tx, setTx] = createSignal(0);
      const [ty, setTy] = createSignal(0);

      const g = t_element('g', {});
      makeSvg().appendChild(g);

      $REGISTRY.wire(g, 'transform', () => `translate(${tx()}, ${ty()})`);

      expect(g.getAttribute('transform')).toBe('translate(0, 0)');

      setTx(50);
      setTy(100);
      expect(g.getAttribute('transform')).toBe('translate(50, 100)');
    });

    it('maps className → class attribute', () => {
      const [active, setActive] = createSignal(false);
      const circle = t_element('circle', {});
      makeSvg().appendChild(circle);

      $REGISTRY.wire(circle, 'className', () => (active() ? 'node selected' : 'node'));

      expect(circle.getAttribute('class')).toBe('node');

      setActive(true);
      expect(circle.getAttribute('class')).toBe('node selected');
    });
  });

  // -------------------------------------------------------------------------
  // 3. Dotted paths (style.*) still use property assignment on SVG elements
  // -------------------------------------------------------------------------

  describe('style.* paths use property assignment on SVG elements', () => {
    it('wire style.left uses CSSStyleDeclaration property on SVGElement', () => {
      const [left, setLeft] = createSignal(10);
      const circle = t_element('circle', {});
      makeSvg().appendChild(circle);

      $REGISTRY.wire(circle, 'style.left', () => `${left()}px`);

      expect((circle as HTMLElement).style.left).toBe('10px');

      setLeft(99);
      expect((circle as HTMLElement).style.left).toBe('99px');
    });

    it('wire style.fill uses CSSStyleDeclaration property', () => {
      const [color, setColor] = createSignal('#ff0000');
      const rect = t_element('rect', {});
      makeSvg().appendChild(rect);

      $REGISTRY.wire(rect, 'style.fill', () => color());

      // JSDOM stores colors as-is (does not normalize to rgb()).
      expect((rect as HTMLElement).style.fill).toBe('#ff0000');

      setColor('#0000ff');
      expect((rect as HTMLElement).style.fill).toBe('#0000ff');
    });
  });

  // -------------------------------------------------------------------------
  // 4. Null/undefined handling with clear warning
  // -------------------------------------------------------------------------

  describe('null/undefined guard on SVG attribute wires', () => {
    it('emits a console.warn and does not set "null" as attribute text', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const [val, setVal] = createSignal<number | null>(50);
      const circle = t_element('circle', {});
      makeSvg().appendChild(circle);

      $REGISTRY.wire(circle, 'r', () => val() as unknown as string);

      expect(circle.getAttribute('r')).toBe('50');

      setVal(null);

      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('[WIRE] SVG attribute "r" received null'),
        expect.any(Object)
      );
      // The attribute must NOT have been updated to "null"
      expect(circle.getAttribute('r')).toBe('50');
    });
  });

  // -------------------------------------------------------------------------
  // 5. Change-detection skips redundant setAttribute calls
  // -------------------------------------------------------------------------

  describe('change-detection avoids redundant DOM mutations', () => {
    it('does not call setAttribute when the value has not changed', () => {
      const [cx, setCx] = createSignal(50);
      const circle = t_element('circle', {});
      makeSvg().appendChild(circle);

      const setAttributeSpy = vi.spyOn(circle, 'setAttribute');

      $REGISTRY.wire(circle, 'cx', () => String(cx()));

      // Initial wire runs once
      expect(setAttributeSpy).toHaveBeenCalledTimes(1);

      // Writing the SAME value
      setCx(50);
      expect(setAttributeSpy).toHaveBeenCalledTimes(1); // no extra call

      // Writing a new value
      setCx(100);
      expect(setAttributeSpy).toHaveBeenCalledTimes(2);
    });
  });

  // -------------------------------------------------------------------------
  // 6. batch() coalesces multiple geometry updates
  // -------------------------------------------------------------------------

  describe('batch() coalesces SVG attribute updates', () => {
    it('multiple signal writes in a batch run effects only once', () => {
      const [cx, setCx] = createSignal(0);
      const [cy, setCy] = createSignal(0);
      const [r, setR] = createSignal(10);

      const circle = t_element('circle', {});
      const svg = makeSvg();
      svg.appendChild(circle);

      let effectRunCount = 0;
      $REGISTRY.wire(circle, 'cx', () => {
        effectRunCount++;
        return String(cx());
      });
      $REGISTRY.wire(circle, 'cy', () => String(cy()));
      $REGISTRY.wire(circle, 'r', () => String(r()));

      const initialRuns = effectRunCount;

      // Batch update: move and resize the circle
      batch(() => {
        setCx(200);
        setCy(300);
        setR(50);
      });

      // cx effect should have run exactly once more
      expect(effectRunCount).toBe(initialRuns + 1);
      expect(circle.getAttribute('cx')).toBe('200');
      expect(circle.getAttribute('cy')).toBe('300');
      expect(circle.getAttribute('r')).toBe('50');
    });
  });

  // -------------------------------------------------------------------------
  // 7. Disposer stops attribute updates
  // -------------------------------------------------------------------------

  describe('wire disposer', () => {
    it('stops attribute updates after dispose()', () => {
      const [cx, setCx] = createSignal(50);
      const circle = t_element('circle', {});
      makeSvg().appendChild(circle);

      const dispose = $REGISTRY.wire(circle, 'cx', () => String(cx()));

      expect(circle.getAttribute('cx')).toBe('50');

      dispose();
      setCx(999);

      // Attribute must remain at pre-dispose value
      expect(circle.getAttribute('cx')).toBe('50');
    });
  });

  // -------------------------------------------------------------------------
  // 8. scheduleFrame() + flushFrames() — 60fps drag simulation
  // -------------------------------------------------------------------------

  describe('scheduleFrame() 60fps drag simulation', () => {
    it('coalesces rapid pointer events and updates SVG position once per frame', () => {
      const [cx, setCx] = createSignal(0);
      const [cy, setCy] = createSignal(0);

      const circle = t_element('circle', {});
      const svg = makeSvg();
      svg.appendChild(circle);

      $REGISTRY.wire(circle, 'cx', () => String(cx()));
      $REGISTRY.wire(circle, 'cy', () => String(cy()));

      // Simulate 50 rapid pointermove events
      for (let i = 1; i <= 50; i++) {
        const capturedX = i * 5;
        const capturedY = i * 3;
        scheduleFrame(() => {
          setCx(capturedX);
          setCy(capturedY);
        }, 'drag:circle');
      }

      // Verify: no updates have been applied yet (rAF hasn't fired)
      expect(circle.getAttribute('cx')).toBe('0');

      // Flush simulates the rAF callback
      flushFrames();

      // Only the LAST position (50th event) should have been applied
      expect(circle.getAttribute('cx')).toBe('250'); // 50 * 5
      expect(circle.getAttribute('cy')).toBe('150'); // 50 * 3
    });

    it('scheduleFrame + batch combination wraps multi-attr update atomically', () => {
      const [cx, setCx] = createSignal(0);
      const [cy, setCy] = createSignal(0);
      const circle = t_element('circle', {});
      makeSvg().appendChild(circle);

      $REGISTRY.wire(circle, 'cx', () => String(cx()));
      $REGISTRY.wire(circle, 'cy', () => String(cy()));

      scheduleFrame(
        () =>
          batch(() => {
            setCx(100);
            setCy(200);
          }),
        'drag:xy'
      );

      flushFrames();

      expect(circle.getAttribute('cx')).toBe('100');
      expect(circle.getAttribute('cy')).toBe('200');
    });
  });

  // -------------------------------------------------------------------------
  // 9. Full SVG scene — multiple shapes, shared signals
  // -------------------------------------------------------------------------

  describe('full SVG scene', () => {
    it('tracks multiple shapes with shared and independent signals', () => {
      const [scaleX, setScaleX] = createSignal(1);
      const [nodeAx, setNodeAx] = createSignal(100);
      const [nodeAy, setNodeAy] = createSignal(100);
      const [nodeBx, setNodeBx] = createSignal(300);
      const [nodeBy, setNodeBy] = createSignal(200);

      const svg = makeSvg();

      // Node A: draggable circle
      const circleA = t_element('circle', { r: '20' } as any);
      $REGISTRY.wire(circleA, 'cx', () => String(nodeAx()));
      $REGISTRY.wire(circleA, 'cy', () => String(nodeAy()));

      // Node B: draggable circle
      const circleB = t_element('circle', { r: '20' } as any);
      $REGISTRY.wire(circleB, 'cx', () => String(nodeBx()));
      $REGISTRY.wire(circleB, 'cy', () => String(nodeBy()));

      // Edge: line connecting A to B
      const edge = t_element('line', {});
      $REGISTRY.wire(edge, 'x1', () => String(nodeAx()));
      $REGISTRY.wire(edge, 'y1', () => String(nodeAy()));
      $REGISTRY.wire(edge, 'x2', () => String(nodeBx()));
      $REGISTRY.wire(edge, 'y2', () => String(nodeBy()));

      // Scale group
      const g = t_element('g', {});
      $REGISTRY.wire(g, 'transform', () => `scale(${scaleX()}, 1)`);

      svg.appendChild(g);
      g.appendChild(circleA);
      g.appendChild(circleB);
      g.appendChild(edge);

      // Initial state
      expect(circleA.getAttribute('cx')).toBe('100');
      expect(edge.getAttribute('x1')).toBe('100');
      expect(edge.getAttribute('x2')).toBe('300');
      expect(g.getAttribute('transform')).toBe('scale(1, 1)');

      // Drag node A
      batch(() => {
        setNodeAx(150);
        setNodeAy(120);
      });

      expect(circleA.getAttribute('cx')).toBe('150');
      expect(circleA.getAttribute('cy')).toBe('120');
      expect(edge.getAttribute('x1')).toBe('150'); // edge follows node A
      expect(edge.getAttribute('y1')).toBe('120');
      expect(circleB.getAttribute('cx')).toBe('300'); // node B unaffected

      // Zoom
      setScaleX(2);
      expect(g.getAttribute('transform')).toBe('scale(2, 1)');
    });
  });

  // -------------------------------------------------------------------------
  // 10. HTML element regression — completely unaffected
  // -------------------------------------------------------------------------

  describe('HTML wires are unaffected', () => {
    it('textContent still uses property assignment on div', () => {
      const [msg, setMsg] = createSignal('hello');
      const div = t_element('div', {});
      document.body.appendChild(div);
      $REGISTRY.wire(div, 'textContent', () => msg());

      expect(div.textContent).toBe('hello');

      setMsg('world');
      expect(div.textContent).toBe('world');
    });

    it('style.left still uses CSSStyleDeclaration on div', () => {
      const [x, setX] = createSignal(10);
      const div = t_element('div', {});
      document.body.appendChild(div);
      $REGISTRY.wire(div, 'style.left', () => `${x()}px`);

      expect((div as HTMLElement).style.left).toBe('10px');

      setX(50);
      expect((div as HTMLElement).style.left).toBe('50px');
    });

    it('className via wire uses DOM property on div (not setAttribute)', () => {
      const [cls, setCls] = createSignal('box');
      const div = t_element('div', {});
      document.body.appendChild(div);
      $REGISTRY.wire(div, 'className', () => cls());

      expect(div.className).toBe('box');

      setCls('box active');
      expect(div.className).toBe('box active');
    });
  });
});
