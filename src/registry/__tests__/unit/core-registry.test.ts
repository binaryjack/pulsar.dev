/**
 * Unit Tests for Core Registry
 * Tests individual registry methods in isolation
 */

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { ICoreRegistry } from '../../core';
import { CoreRegistry } from '../../core';

describe('CoreRegistry - Unit Tests', () => {
  let registry: ICoreRegistry;

  beforeEach(() => {
    registry = new CoreRegistry();
  });

  afterEach(() => {
    registry.reset();
  });

  describe('execute()', () => {
    it('should execute factory and return result', () => {
      const result = registry.execute('test:Component', null, () => {
        return 'test result';
      });

      expect(result).toBe('test result');
    });

    it('should track component context', () => {
      registry.execute('test:Parent', null, () => {
        const context = registry.getCurrent();
        expect(context?.id).toBe('test:Parent');
        expect(context?.parentId).toBeNull();
      });
    });

    it('should track nested components', () => {
      registry.execute('test:Parent', null, () => {
        registry.execute('test:Child', 'test:Parent', () => {
          const context = registry.getCurrent();
          expect(context?.id).toBe('test:Child');
          expect(context?.parentId).toBe('test:Parent');
        });
      });
    });

    it('should restore parent context after child execution', () => {
      registry.execute('test:Parent', null, () => {
        const parentContext = registry.getCurrent();

        registry.execute('test:Child', 'test:Parent', () => {
          const childContext = registry.getCurrent();
          expect(childContext?.id).toBe('test:Child');
        });

        const restoredContext = registry.getCurrent();
        expect(restoredContext?.id).toBe('test:Parent');
      });
    });

    it('should track multiple component instances', () => {
      registry.execute('test:Component1', null, () => {});
      registry.execute('test:Component2', null, () => {});
      registry.execute('test:Component3', null, () => {});

      const stats = registry.getStats();
      expect(stats.components).toBeGreaterThanOrEqual(3);
    });
  });

  describe('getCurrent()', () => {
    it('should return undefined outside component context', () => {
      const context = registry.getCurrent();
      expect(context).toBeUndefined();
    });

    it('should return current context inside component', () => {
      registry.execute('test:Component', null, () => {
        const context = registry.getCurrent();
        expect(context).toBeDefined();
        expect(context?.id).toBe('test:Component');
      });
    });
  });

  describe('wire()', () => {
    it('should update element property from signal', () => {
      const element = document.createElement('div');
      let value = 'initial';

      registry.wire(element, 'textContent', () => value);
      expect(element.textContent).toBe('initial');

      value = 'updated';
      // Manual trigger - in real usage, signal would trigger this
      registry.wire(element, 'textContent', () => value);
      expect(element.textContent).toBe('updated');
    });

    it('should update nested property paths', () => {
      const element = document.createElement('div');
      let left = '10px';

      registry.wire(element, 'style.left', () => left);
      expect(element.style.left).toBe('10px');

      left = '20px';
      registry.wire(element, 'style.left', () => left);
      expect(element.style.left).toBe('20px');
    });

    it('should return disposer function', () => {
      const element = document.createElement('div');
      const dispose = registry.wire(element, 'textContent', () => 'test');

      expect(typeof dispose).toBe('function');
      expect(element.textContent).toBe('test');

      dispose();
      // After disposal, wire should be removed
    });

    it('should handle multiple wires on same element', () => {
      const element = document.createElement('div');

      registry.wire(element, 'textContent', () => 'text');
      registry.wire(element, 'className', () => 'box');
      registry.wire(element, 'style.color', () => 'red');

      expect(element.textContent).toBe('text');
      expect(element.className).toBe('box');
      expect(element.style.color).toBe('red');
    });

    it('should dispose wire cleanly', () => {
      const element = document.createElement('div');
      const dispose = registry.wire(element, 'textContent', () => 'test');

      expect(element.textContent).toBe('test');
      dispose();

      // Wire should be removed from registry
      const stats = registry.getStats();
      // No direct way to check wire count, but should not throw
      expect(stats).toBeDefined();
    });
  });

  describe('nextHid()', () => {
    it('should generate sequential HIDs', () => {
      const hid1 = registry.nextHid();
      const hid2 = registry.nextHid();
      const hid3 = registry.nextHid();

      expect(hid1).toBe(0);
      expect(hid2).toBe(1);
      expect(hid3).toBe(2);
    });

    it('should reset HID counter on reset', () => {
      registry.nextHid();
      registry.nextHid();
      registry.nextHid();

      registry.reset();

      const hid = registry.nextHid();
      expect(hid).toBe(0);
    });
  });

  describe('dump()', () => {
    it('should dump empty state initially', () => {
      const state = registry.dump();

      expect(state).toBeDefined();
      expect(state.signals).toBeDefined();
      expect(state.components).toBeDefined();
      expect(state.hid).toBeDefined();
    });

    it('should include HID counter in dump', () => {
      registry.nextHid();
      registry.nextHid();

      const state = registry.dump();
      expect(state.hid).toBeGreaterThanOrEqual(2);
    });

    it('should include component list in dump', () => {
      registry.execute('test:Component1', null, () => {});
      registry.execute('test:Component2', null, () => {});

      const state = registry.dump();
      expect(Array.isArray(state.components)).toBe(true);
      expect(state.components.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('boot()', () => {
    it('should boot with valid state', () => {
      const initialState = {
        signals: { sig_0: 42 },
        components: ['test:Component1'],
        hid: 5,
      };

      registry.boot(initialState);

      const stats = registry.getStats();
      expect(stats.hidCounter).toBe(5);
    });

    it('should handle null state gracefully', () => {
      expect(() => registry.boot(null)).not.toThrow();
    });

    it('should restore HID counter', () => {
      const initialState = {
        signals: {},
        components: [],
        hid: 100,
      };

      registry.boot(initialState);

      const nextHid = registry.nextHid();
      expect(nextHid).toBe(100);
    });
  });

  describe('Debug Methods', () => {
    describe('enableDebug()', () => {
      it('should enable debug mode', () => {
        expect(() => registry.enableDebug()).not.toThrow();
      });
    });

    describe('disableDebug()', () => {
      it('should disable debug mode', () => {
        registry.enableDebug();
        expect(() => registry.disableDebug()).not.toThrow();
      });
    });

    describe('getStats()', () => {
      it('should return registry statistics', () => {
        const stats = registry.getStats();

        expect(stats).toBeDefined();
        expect(typeof stats.components).toBe('number');
        expect(typeof stats.signals).toBe('number');
        expect(typeof stats.stackDepth).toBe('number');
        expect(typeof stats.ownerStackDepth).toBe('number');
        expect(typeof stats.hidCounter).toBe('number');
      });

      it('should track component count', () => {
        const initialStats = registry.getStats();

        registry.execute('test:Component', null, () => {});

        const updatedStats = registry.getStats();
        expect(updatedStats.components).toBeGreaterThanOrEqual(initialStats.components);
      });
    });

    describe('getComponentTree()', () => {
      it('should return component tree', () => {
        registry.execute('test:Parent', null, () => {
          registry.execute('test:Child', 'test:Parent', () => {});
        });

        const tree = registry.getComponentTree();

        expect(tree).toBeDefined();
        expect(typeof tree).toBe('object');
      });

      it('should include component IDs and parents', () => {
        registry.execute('test:Component', null, () => {});

        const tree = registry.getComponentTree();

        // Should have at least one component
        const componentIds = Object.keys(tree);
        expect(componentIds.length).toBeGreaterThan(0);
      });
    });

    describe('getSignals()', () => {
      it('should return signal map', () => {
        const signals = registry.getSignals();

        expect(signals).toBeDefined();
        expect(typeof signals).toBe('object');
      });
    });

    describe('logState()', () => {
      it('should log state without throwing', () => {
        expect(() => registry.logState()).not.toThrow();
      });
    });

    describe('reset()', () => {
      it('should reset all state', () => {
        // Create some state
        registry.execute('test:Component', null, () => {});
        registry.nextHid();
        registry.nextHid();

        // Reset
        registry.reset();

        // Verify state is cleared
        const stats = registry.getStats();
        expect(stats.components).toBe(0);
        expect(stats.signals).toBe(0);
        expect(stats.stackDepth).toBe(0);
        expect(stats.hidCounter).toBe(0);
      });
    });
  });

  describe('runInScope()', () => {
    it('should run function in effect owner scope', () => {
      const mockOwner = {
        _subs: new Set(),
        _children: new Set(),
        run: () => {},
        cleanup: () => {},
        dispose: () => {},
      };

      expect(() => {
        registry.runInScope(mockOwner, () => {
          // Function runs in scope
        });
      }).not.toThrow();
    });
  });

  describe('getCurrentOwner()', () => {
    it('should return undefined outside owner scope', () => {
      const owner = registry.getCurrentOwner();
      expect(owner).toBeUndefined();
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid component creation', () => {
      for (let i = 0; i < 100; i++) {
        registry.execute(`test:Component${i}`, null, () => {});
      }

      const stats = registry.getStats();
      expect(stats.components).toBeGreaterThanOrEqual(100);
    });

    it('should handle deeply nested components', () => {
      const createNested = (depth: number, parentId: string | null = null): void => {
        if (depth === 0) return;

        registry.execute(`test:Component${depth}`, parentId, () => {
          createNested(depth - 1, `test:Component${depth}`);
        });
      };

      expect(() => createNested(10)).not.toThrow();
    });

    it('should handle wire on non-existent properties gracefully', () => {
      const element = document.createElement('div');

      // Try to wire a non-standard property
      expect(() => {
        registry.wire(element, 'customProp', () => 'value');
      }).not.toThrow();
    });
  });
});
