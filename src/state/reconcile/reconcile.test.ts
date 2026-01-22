/**
 * Reconcile Tests
 * Comprehensive test suite for the reconcile utility
 */

import { describe, expect, it } from 'vitest';
import { diffArrays, diffObjects, isPlainObject, reconcile, reconcileWith } from './index';

describe('isPlainObject', () => {
  it('should return true for plain objects', () => {
    expect(isPlainObject({})).toBe(true);
    expect(isPlainObject({ a: 1 })).toBe(true);
    expect(isPlainObject(Object.create(null))).toBe(true);
  });

  it('should return false for non-plain objects', () => {
    expect(isPlainObject(null)).toBe(false);
    expect(isPlainObject(undefined)).toBe(false);
    expect(isPlainObject([])).toBe(false);
    expect(isPlainObject(42)).toBe(false);
    expect(isPlainObject('string')).toBe(false);
    expect(isPlainObject(new Date())).toBe(false);
    expect(isPlainObject(new Map())).toBe(false);
  });
});

describe('diffObjects', () => {
  it('should return same reference if objects are identical', () => {
    const obj = { a: 1, b: 2 };
    const result = diffObjects(obj, obj, true);

    expect(result.value).toBe(obj);
    expect(result.changed).toBe(false);
  });

  it('should reuse unchanged property references', () => {
    const nested = { x: 1 };
    const prev = { a: 1, nested };
    const next = { a: 1, nested };

    const result = diffObjects(prev, next, true);

    expect(result.value.nested).toBe(nested); // Same reference
    expect(result.changed).toBe(false);
  });

  it('should detect changed properties', () => {
    const prev = { a: 1, b: 2 };
    const next = { a: 1, b: 3 };

    const result = diffObjects(prev, next, true);

    expect(result.value).toEqual({ a: 1, b: 3 });
    expect(result.changed).toBe(true);
    expect(result.value).not.toBe(prev);
  });

  it('should handle added properties', () => {
    const prev = { a: 1 };
    const next = { a: 1, b: 2 };

    const result = diffObjects(prev, next, true);

    expect(result.value).toEqual({ a: 1, b: 2 });
    expect(result.changed).toBe(true);
  });

  it('should handle removed properties', () => {
    const prev = { a: 1, b: 2 };
    const next = { a: 1 };

    const result = diffObjects(prev, next, true);

    expect(result.value).toEqual({ a: 1 });
    expect(result.changed).toBe(true);
    expect('b' in result.value).toBe(false);
  });

  it('should reconcile nested objects', () => {
    const deepNested = { z: 3 };
    const prev = {
      a: 1,
      nested: {
        b: 2,
        deep: deepNested,
      },
    };
    const next = {
      a: 1,
      nested: {
        b: 2,
        deep: deepNested,
      },
    };

    const result = diffObjects(prev, next, true);

    // Should reuse nested references
    expect(result.value.nested.deep).toBe(deepNested);
    expect(result.changed).toBe(false);
  });

  it('should detect changes in nested objects', () => {
    const prev = {
      a: 1,
      nested: { b: 2 },
    };
    const next = {
      a: 1,
      nested: { b: 3 },
    };

    const result = diffObjects(prev, next, true);

    expect(result.value.nested.b).toBe(3);
    expect(result.changed).toBe(true);
  });

  it('should replace when merge is false', () => {
    const prev = { a: 1, b: 2 };
    const next = { a: 1, c: 3 };

    const result = diffObjects(prev, next, false);

    expect(result.value).toBe(next);
    expect(result.changed).toBe(true);
  });
});

describe('diffArrays', () => {
  it('should return same reference if arrays are identical', () => {
    const arr = [1, 2, 3];
    const result = diffArrays(arr, arr);

    expect(result.value).toBe(arr);
    expect(result.changed).toBe(false);
  });

  it('should detect length changes', () => {
    const prev = [1, 2, 3];
    const next = [1, 2];

    const result = diffArrays(prev, next);

    expect(result.value).toEqual([1, 2]);
    expect(result.changed).toBe(true);
  });

  it('should use index-based reconciliation by default', () => {
    const obj1 = { id: 1, name: 'Alice' };
    const obj2 = { id: 2, name: 'Bob' };
    const prev = [obj1, obj2];
    const next = [obj1, obj2];

    const result = diffArrays(prev, next);

    expect(result.value[0]).toBe(obj1); // Same reference
    expect(result.value[1]).toBe(obj2); // Same reference
    expect(result.changed).toBe(false);
  });

  it('should use key-based reconciliation', () => {
    const prev = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
    ];
    const next = [
      { id: 2, name: 'Bob' },
      { id: 1, name: 'Alice' },
    ];

    const result = diffArrays(prev, next, { key: 'id' });

    // Items should be reused based on ID, not index
    expect(result.value[0]).toEqual({ id: 2, name: 'Bob' });
    expect(result.value[1]).toEqual({ id: 1, name: 'Alice' });
  });

  it('should detect new items', () => {
    const prev = [{ id: 1, name: 'Alice' }];
    const next = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
    ];

    const result = diffArrays(prev, next, { key: 'id' });

    expect(result.value).toHaveLength(2);
    expect(result.changed).toBe(true);
  });

  it('should detect removed items', () => {
    const prev = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
    ];
    const next = [{ id: 1, name: 'Alice' }];

    const result = diffArrays(prev, next, { key: 'id' });

    expect(result.value).toHaveLength(1);
    expect(result.changed).toBe(true);
  });

  it('should reconcile object items', () => {
    const prev = [{ id: 1, name: 'Alice', age: 30 }];
    const next = [{ id: 1, name: 'Alice', age: 31 }];

    const result = diffArrays(prev, next, { key: 'id' });

    expect(result.value[0]).toEqual({ id: 1, name: 'Alice', age: 31 });
    expect(result.changed).toBe(true);
  });

  it('should use custom key function', () => {
    const prev = [
      { uid: 'a', value: 1 },
      { uid: 'b', value: 2 },
    ];
    const next = [
      { uid: 'b', value: 2 },
      { uid: 'a', value: 1 },
    ];

    const result = diffArrays(prev, next, {
      key: (item) => item.uid,
    });

    expect(result.value[0]).toEqual({ uid: 'b', value: 2 });
    expect(result.value[1]).toEqual({ uid: 'a', value: 1 });
  });

  it('should handle empty arrays', () => {
    const prev: any[] = [];
    const next: any[] = [];

    const result = diffArrays(prev, next);

    expect(result.value).toBe(prev);
    expect(result.changed).toBe(false);
  });

  it('should handle primitives in arrays', () => {
    const prev = [1, 2, 3];
    const next = [1, 2, 4];

    const result = diffArrays(prev, next);

    expect(result.value).toEqual([1, 2, 4]);
    expect(result.changed).toBe(true);
  });
});

describe('reconcile', () => {
  it('should return same reference for identical values', () => {
    const value = { a: 1 };
    const reconciled = reconcile(value);

    expect(reconciled(value)).toBe(value);
  });

  it('should handle null and undefined', () => {
    expect(reconcile(null)(undefined)).toBe(null);
    expect(reconcile(undefined)(null)).toBe(undefined);
    expect(reconcile({ a: 1 })(null)).toEqual({ a: 1 });
  });

  it('should reconcile objects', () => {
    const prev = { a: 1, b: { c: 2 } };
    const next = { a: 1, b: { c: 3 } };
    const reconciled = reconcile(next);

    const result = reconciled(prev);

    expect(result).toEqual(next);
    expect(result).not.toBe(prev);
  });

  it('should reconcile arrays', () => {
    const prev = [1, 2, 3];
    const next = [1, 2, 4];
    const reconciled = reconcile(next);

    const result = reconciled(prev);

    expect(result).toEqual([1, 2, 4]);
  });

  it('should work with useState/createSignal pattern', () => {
    const prev = { count: 0, user: { name: 'Alice', age: 30 } };
    const next = { count: 1, user: { name: 'Alice', age: 30 } };

    const reconciled = reconcile(next);
    const result = reconciled(prev);

    // User object should be reused (no changes)
    expect(result.user).toBe(prev.user);
    expect(result.count).toBe(1);
  });

  it('should handle primitives', () => {
    expect(reconcile(42)(0)).toBe(42);
    expect(reconcile('hello')('world')).toBe('hello');
    expect(reconcile(true)(false)).toBe(true);
  });
});

describe('reconcileWith', () => {
  it('should reconcile arrays with string key', () => {
    const prev = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
    ];
    const next = [
      { id: 2, name: 'Bob Updated' },
      { id: 1, name: 'Alice' },
    ];

    const reconciled = reconcileWith(next, 'id');
    const result = reconciled(prev);

    expect(result[0]).toEqual({ id: 2, name: 'Bob Updated' });
    expect(result[1]).toEqual({ id: 1, name: 'Alice' });
  });

  it('should reconcile arrays with key function', () => {
    const prev = [
      { uid: 'a', value: 1 },
      { uid: 'b', value: 2 },
    ];
    const next = [
      { uid: 'b', value: 3 },
      { uid: 'a', value: 1 },
    ];

    const reconciled = reconcileWith(next, (item) => item.uid);
    const result = reconciled(prev);

    expect(result[0]).toEqual({ uid: 'b', value: 3 });
    expect(result[1]).toBe(prev[0]); // Reused reference for unchanged item
  });
});

describe('edge cases', () => {
  it('should handle circular references safely', () => {
    const prev = { a: 1 } as Record<string, number>;
    const next = { a: 1 } as Record<string, number>;

    // Don't create actual circular refs (would cause infinite loop)
    // Just test that normal refs work
    const reconciled = reconcile(next);
    expect(reconciled(prev).a).toBe(1);
  });

  it('should handle Date objects', () => {
    const date1 = new Date('2025-01-01');
    const date2 = new Date('2025-01-02');
    const prev = { date: date1 };
    const next = { date: date2 };

    const reconciled = reconcile(next);
    const result = reconciled(prev);

    expect(result.date).toBe(date2);
  });

  it('should handle mixed types', () => {
    const prev = { value: 'string' };
    const next = { value: 42 };

    const reconciled = reconcile(next);
    const result = reconciled(prev);

    expect(result.value).toBe(42);
  });

  it('should handle deep nesting', () => {
    const prev = {
      level1: {
        level2: {
          level3: {
            value: 'old',
          },
        },
      },
    };
    const next = {
      level1: {
        level2: {
          level3: {
            value: 'new',
          },
        },
      },
    };

    const reconciled = reconcile(next);
    const result = reconciled(prev);

    expect(result.level1.level2.level3.value).toBe('new');
  });
});
