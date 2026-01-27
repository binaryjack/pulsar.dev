/**
 * ID Generator tests
 */
import { describe, expect, it } from 'vitest';
import {
  createIdContext,
  decodeBase36,
  encodeBase36,
  generateId,
  getGeneration,
  getParentId,
  incrementGeneration,
  isArrayItemId,
  parseId,
  resetFragmentCounter,
} from '../../id-generator';

describe('Base36 Encoding', () => {
  describe('encodeBase36', () => {
    it('should encode 0', () => {
      expect(encodeBase36(0)).toBe('0');
    });

    it('should encode single digits', () => {
      expect(encodeBase36(1)).toBe('1');
      expect(encodeBase36(9)).toBe('9');
    });

    it('should encode base36 digits', () => {
      expect(encodeBase36(10)).toBe('a');
      expect(encodeBase36(35)).toBe('z');
    });

    it('should encode multi-character values', () => {
      expect(encodeBase36(36)).toBe('10');
      expect(encodeBase36(100)).toBe('2s');
      expect(encodeBase36(1000)).toBe('rs');
    });

    it('should throw on negative numbers', () => {
      expect(() => encodeBase36(-1)).toThrow('Base36 encoding requires non-negative integer');
    });

    it('should throw on non-integers', () => {
      expect(() => encodeBase36(3.14)).toThrow('Base36 encoding requires non-negative integer');
    });
  });

  describe('decodeBase36', () => {
    it('should decode single characters', () => {
      expect(decodeBase36('0')).toBe(0);
      expect(decodeBase36('9')).toBe(9);
      expect(decodeBase36('a')).toBe(10);
      expect(decodeBase36('z')).toBe(35);
    });

    it('should handle uppercase', () => {
      expect(decodeBase36('A')).toBe(10);
      expect(decodeBase36('Z')).toBe(35);
    });

    it('should decode multi-character values', () => {
      expect(decodeBase36('10')).toBe(36);
      expect(decodeBase36('2s')).toBe(100);
      expect(decodeBase36('rs')).toBe(1000);
    });

    it('should throw on invalid characters', () => {
      expect(() => decodeBase36('!')).toThrow('Invalid base36 character');
      expect(() => decodeBase36('a!b')).toThrow('Invalid base36 character');
    });

    it('should throw on empty string', () => {
      expect(() => decodeBase36('')).toThrow('Base36 decoding requires non-empty string');
    });

    it('should roundtrip encode/decode', () => {
      const values = [0, 1, 10, 35, 36, 100, 1000, 10000];
      values.forEach((val) => {
        expect(decodeBase36(encodeBase36(val))).toBe(val);
      });
    });
  });
});

describe('ID Generation', () => {
  describe('createIdContext', () => {
    it('should create context with generation 0', () => {
      const ctx = createIdContext();
      expect(ctx.generation).toBe(0);
      expect(ctx.fragmentCounter).toBe(0);
    });

    it('should create context with custom generation', () => {
      const ctx = createIdContext(5);
      expect(ctx.generation).toBe(5);
      expect(ctx.fragmentCounter).toBe(0);
    });
  });

  describe('generateId', () => {
    it('should generate root element ID', () => {
      const ctx = createIdContext();
      const id = generateId(ctx);

      // Format: generation.parent.index.fragment
      expect(id).toBe('0.0.0.0'); // g=0, p=0, i=0, f=0
    });

    it('should increment fragment counter', () => {
      const ctx = createIdContext();

      const id1 = generateId(ctx);
      const id2 = generateId(ctx);
      const id3 = generateId(ctx);

      expect(id1).toBe('0.0.0.0');
      expect(id2).toBe('0.0.0.1');
      expect(id3).toBe('0.0.0.2');
    });

    it('should generate ID with parent', () => {
      const ctx = createIdContext();
      const id = generateId(ctx, 'parent-1');

      expect(id).toBe('0.parent-1.0.0');
    });

    it('should generate ID with index', () => {
      const ctx = createIdContext();
      const id = generateId(ctx, undefined, 5);

      expect(id).toBe('0.0.5.0');
    });

    it('should generate ID with parent and index', () => {
      const ctx = createIdContext();
      const id = generateId(ctx, 'list-1', 3);

      expect(id).toBe('0.list-1.3.0');
    });

    it('should use different generations', () => {
      const ctx = createIdContext(10);
      const id = generateId(ctx);

      expect(id).toBe('a.0.0.0'); // 10 in base36 = 'a'
    });

    it('should encode large values in base36', () => {
      const ctx = createIdContext(100);
      ctx.fragmentCounter = 50;

      const id = generateId(ctx, undefined, 25);

      expect(id).toBe('2s.0.p.1e'); // 100='2s', 25='p', 50='1e'
    });
  });

  describe('resetFragmentCounter', () => {
    it('should reset fragment counter to 0', () => {
      const ctx = createIdContext();
      generateId(ctx);
      generateId(ctx);

      expect(ctx.fragmentCounter).toBe(2);

      resetFragmentCounter(ctx);

      expect(ctx.fragmentCounter).toBe(0);
    });
  });

  describe('incrementGeneration', () => {
    it('should increment generation and reset fragment', () => {
      const ctx = createIdContext(5);
      ctx.fragmentCounter = 10;

      incrementGeneration(ctx);

      expect(ctx.generation).toBe(6);
      expect(ctx.fragmentCounter).toBe(0);
    });
  });
});

describe('ID Parsing', () => {
  describe('parseId', () => {
    it('should parse simple ID', () => {
      const parsed = parseId('0.0.0.0');

      expect(parsed.generation).toBe(0);
      expect(parsed.parentId).toBe('0');
      expect(parsed.index).toBe(0);
      expect(parsed.fragment).toBe(0);
      expect(parsed.original).toBe('0.0.0.0');
    });

    it('should parse ID with encoded values', () => {
      const parsed = parseId('a.parent-1.5.f');

      expect(parsed.generation).toBe(10); // 'a' = 10
      expect(parsed.parentId).toBe('parent-1');
      expect(parsed.index).toBe(5);
      expect(parsed.fragment).toBe(15); // 'f' = 15
    });

    it('should parse ID with large base36 values', () => {
      const parsed = parseId('2s.root.p.1e');

      expect(parsed.generation).toBe(100); // '2s' = 100
      expect(parsed.parentId).toBe('root');
      expect(parsed.index).toBe(25); // 'p' = 25
      expect(parsed.fragment).toBe(50); // '1e' = 50
    });

    it('should throw on invalid format', () => {
      expect(() => parseId('invalid')).toThrow('expected at least 4 parts');
      expect(() => parseId('a.b')).toThrow('expected at least 4 parts');
    });

    it('should throw on empty ID', () => {
      expect(() => parseId('')).toThrow('ID must be a non-empty string');
    });

    it('should roundtrip generate/parse', () => {
      const ctx = createIdContext(5);
      const id = generateId(ctx, 'parent-x', 7);
      const parsed = parseId(id);

      expect(parsed.generation).toBe(5);
      expect(parsed.parentId).toBe('parent-x');
      expect(parsed.index).toBe(7);
      expect(parsed.fragment).toBe(0);
    });
  });

  describe('isArrayItemId', () => {
    it('should return false for non-array items', () => {
      expect(isArrayItemId('0.0.0.0')).toBe(false);
      expect(isArrayItemId('a.parent.0.f')).toBe(false);
    });

    it('should return true for array items', () => {
      expect(isArrayItemId('0.0.1.0')).toBe(true);
      expect(isArrayItemId('a.parent.5.f')).toBe(true);
    });

    it('should work with parsed IDs', () => {
      const parsed = parseId('0.0.3.0');
      expect(isArrayItemId(parsed)).toBe(true);
    });
  });

  describe('getParentId', () => {
    it('should return null for root elements', () => {
      expect(getParentId('0.0.0.0')).toBeNull();
    });

    it('should return parent ID', () => {
      expect(getParentId('0.parent-1.0.0')).toBe('parent-1');
      expect(getParentId('a.root.5.f')).toBe('root');
    });
  });

  describe('getGeneration', () => {
    it('should extract generation number', () => {
      expect(getGeneration('0.0.0.0')).toBe(0);
      expect(getGeneration('a.parent.0.0')).toBe(10);
      expect(getGeneration('2s.root.5.f')).toBe(100);
    });
  });
});
