import { vi } from 'vitest';
import { DEV, invariant, warn } from './index';

describe('Dev Utilities', () => {
  // Store original console methods
  const originalWarn = console.warn;
  const originalError = console.error;

  beforeEach(() => {
    console.warn = vi.fn();
    console.error = vi.fn();
  });

  afterEach(() => {
    console.warn = originalWarn;
    console.error = originalError;
  });

  describe('warn()', () => {
    it('should log warning with string', () => {
      warn('Test warning');

      if (DEV) {
        expect(console.warn).toHaveBeenCalledWith('[pulsar] Test warning');
      } else {
        expect(console.warn).not.toHaveBeenCalled();
      }
    });

    it('should format warning with component', () => {
      warn({
        message: 'Invalid prop',
        component: 'Show',
      });

      if (DEV) {
        expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('[Show] Invalid prop'));
      }
    });

    it('should include hint in warning', () => {
      warn({
        message: 'Missing key',
        component: 'For',
        hint: 'Add key function for better performance',
      });

      if (DEV) {
        expect(console.warn).toHaveBeenCalledWith(
          expect.stringContaining('Hint: Add key function')
        );
      }
    });
  });

  describe('invariant()', () => {
    it('should not throw when condition is true', () => {
      expect(() => {
        invariant(true, 'Should not throw');
      }).not.toThrow();
    });

    it('should throw when condition is false in dev', () => {
      if (DEV) {
        expect(() => {
          invariant(false, 'Should throw');
        }).toThrow('Should throw');
      } else {
        // Should not throw in production
        expect(() => {
          invariant(false, 'Should throw');
        }).not.toThrow();
      }
    });

    it('should include component in error', () => {
      if (DEV) {
        expect(() => {
          invariant(false, 'Error message', 'TestComponent');
        }).toThrow('[TestComponent]');
      }
    });

    it('should include hint in error', () => {
      if (DEV) {
        expect(() => {
          invariant(false, 'Error message', 'TestComponent', 'Try doing X instead');
        }).toThrow('Hint: Try doing X');
      }
    });
  });

  describe('DEV flag', () => {
    it('should be boolean', () => {
      expect(typeof DEV).toBe('boolean');
    });

    it('should match NODE_ENV', () => {
      if (typeof process !== 'undefined') {
        expect(DEV).toBe(process.env.NODE_ENV !== 'production');
      }
    });
  });
});
