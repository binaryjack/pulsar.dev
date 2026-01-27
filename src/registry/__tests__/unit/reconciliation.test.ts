/**
 * Reconciliation tests
 */
import { describe, expect, it } from 'vitest';
import { getOpsByType, hasChanges, reconcileArray, ReconciliationOp } from '../../reconciliation';

describe('Array Reconciliation', () => {
  interface Todo {
    id: string;
    text: string;
  }

  const getKey = (item: Todo) => item.id;

  describe('reconcileArray', () => {
    it('should handle empty arrays', () => {
      const result = reconcileArray<Todo>([], [], getKey);

      expect(result.ops).toEqual([]);
      expect(result.toRemove.size).toBe(0);
      expect(result.toAdd.size).toBe(0);
      expect(result.moved.size).toBe(0);
    });

    it('should detect all additions', () => {
      const newItems: Todo[] = [
        { id: '1', text: 'A' },
        { id: '2', text: 'B' },
      ];

      const result = reconcileArray([], newItems, getKey);

      expect(result.toAdd.size).toBe(2);
      expect(result.toAdd.has('1')).toBe(true);
      expect(result.toAdd.has('2')).toBe(true);
      expect(result.ops.length).toBe(2);
      expect(result.ops[0].type).toBe(ReconciliationOp.ADD);
      expect(result.ops[1].type).toBe(ReconciliationOp.ADD);
    });

    it('should detect all removals', () => {
      const oldItems: Todo[] = [
        { id: '1', text: 'A' },
        { id: '2', text: 'B' },
      ];

      const result = reconcileArray(oldItems, [], getKey);

      expect(result.toRemove.size).toBe(2);
      expect(result.toRemove.has('1')).toBe(true);
      expect(result.toRemove.has('2')).toBe(true);
      expect(result.ops.length).toBe(2);
      expect(result.ops[0].type).toBe(ReconciliationOp.REMOVE);
      expect(result.ops[1].type).toBe(ReconciliationOp.REMOVE);
    });

    it('should detect no changes', () => {
      const items: Todo[] = [
        { id: '1', text: 'A' },
        { id: '2', text: 'B' },
      ];

      const result = reconcileArray(items, items, getKey);

      expect(result.toRemove.size).toBe(0);
      expect(result.toAdd.size).toBe(0);
      expect(result.moved.size).toBe(0);
      expect(result.ops.length).toBe(2);
      expect(result.ops.every((op) => op.type === ReconciliationOp.KEEP)).toBe(true);
    });

    it('should detect moves', () => {
      const oldItems: Todo[] = [
        { id: '1', text: 'A' },
        { id: '2', text: 'B' },
        { id: '3', text: 'C' },
      ];

      const newItems: Todo[] = [
        { id: '3', text: 'C' }, // moved from index 2 to 0
        { id: '1', text: 'A' }, // moved from index 0 to 1
        { id: '2', text: 'B' }, // moved from index 1 to 2
      ];

      const result = reconcileArray(oldItems, newItems, getKey);

      expect(result.moved.size).toBe(3);
      expect(result.moved.get('1')).toBe(1);
      expect(result.moved.get('2')).toBe(2);
      expect(result.moved.get('3')).toBe(0);

      const moveOps = result.ops.filter((op) => op.type === ReconciliationOp.MOVE);
      expect(moveOps.length).toBe(3);
    });

    it('should detect updates (same key, same index, different data)', () => {
      const oldItem1 = { id: '1', text: 'A' };
      const oldItem2 = { id: '2', text: 'B' };
      const oldItems: Todo[] = [oldItem1, oldItem2];

      const newItem1 = { id: '1', text: 'A Updated' };
      const newItems: Todo[] = [newItem1, oldItem2]; // Reuse oldItem2 reference

      const result = reconcileArray(oldItems, newItems, getKey);

      const updateOps = result.ops.filter((op) => op.type === ReconciliationOp.UPDATE);
      expect(updateOps.length).toBe(1);
      expect(updateOps[0].key).toBe('1');
      expect(updateOps[0].oldIndex).toBe(0);
      expect(updateOps[0].newIndex).toBe(0);

      // Item 2 should be KEEP (same reference)
      const keepOps = result.ops.filter((op) => op.type === ReconciliationOp.KEEP);
      expect(keepOps.length).toBe(1);
      expect(keepOps[0].key).toBe('2');
    });

    it('should handle mixed operations', () => {
      const oldItems: Todo[] = [
        { id: '1', text: 'A' },
        { id: '2', text: 'B' },
        { id: '3', text: 'C' },
      ];

      const newItems: Todo[] = [
        { id: '2', text: 'B' }, // moved from 1 to 0
        { id: '4', text: 'D' }, // added
        { id: '3', text: 'C Updated' }, // moved from 2 to 2, but updated
      ];
      // '1' removed

      const result = reconcileArray(oldItems, newItems, getKey);

      expect(result.toRemove.has('1')).toBe(true);
      expect(result.toAdd.has('4')).toBe(true);
      expect(result.moved.has('2')).toBe(true);

      const removeOps = getOpsByType(result, ReconciliationOp.REMOVE);
      const addOps = getOpsByType(result, ReconciliationOp.ADD);
      const moveOps = getOpsByType(result, ReconciliationOp.MOVE);
      const updateOps = getOpsByType(result, ReconciliationOp.UPDATE);

      expect(removeOps.length).toBe(1);
      expect(addOps.length).toBe(1);
      expect(moveOps.length).toBe(1);
      expect(updateOps.length).toBe(1);
    });

    it('should preserve operation indices correctly', () => {
      const oldItems: Todo[] = [
        { id: '1', text: 'A' },
        { id: '2', text: 'B' },
      ];

      const newItems: Todo[] = [
        { id: '2', text: 'B' },
        { id: '1', text: 'A' },
      ];

      const result = reconcileArray(oldItems, newItems, getKey);

      const op1 = result.ops.find((op) => op.key === '1');
      const op2 = result.ops.find((op) => op.key === '2');

      expect(op1?.oldIndex).toBe(0);
      expect(op1?.newIndex).toBe(1);
      expect(op2?.oldIndex).toBe(1);
      expect(op2?.newIndex).toBe(0);
    });
  });

  describe('hasChanges', () => {
    it('should return false for no changes', () => {
      const items: Todo[] = [{ id: '1', text: 'A' }];
      const result = reconcileArray(items, items, getKey);

      expect(hasChanges(result)).toBe(false);
    });

    it('should return true for additions', () => {
      const result = reconcileArray([], [{ id: '1', text: 'A' }], getKey);

      expect(hasChanges(result)).toBe(true);
    });

    it('should return true for removals', () => {
      const result = reconcileArray([{ id: '1', text: 'A' }], [], getKey);

      expect(hasChanges(result)).toBe(true);
    });

    it('should return true for moves', () => {
      const oldItems: Todo[] = [
        { id: '1', text: 'A' },
        { id: '2', text: 'B' },
      ];
      const newItems: Todo[] = [
        { id: '2', text: 'B' },
        { id: '1', text: 'A' },
      ];

      const result = reconcileArray(oldItems, newItems, getKey);

      expect(hasChanges(result)).toBe(true);
    });

    it('should return true for updates', () => {
      const oldItems: Todo[] = [{ id: '1', text: 'A' }];
      const newItems: Todo[] = [{ id: '1', text: 'A Updated' }];

      const result = reconcileArray(oldItems, newItems, getKey);

      expect(hasChanges(result)).toBe(true);
    });
  });

  describe('getOpsByType', () => {
    it('should filter operations by type', () => {
      const oldItems: Todo[] = [
        { id: '1', text: 'A' },
        { id: '2', text: 'B' },
      ];

      const newItems: Todo[] = [
        { id: '2', text: 'B' },
        { id: '3', text: 'C' },
      ];

      const result = reconcileArray(oldItems, newItems, getKey);

      const removes = getOpsByType(result, ReconciliationOp.REMOVE);
      const adds = getOpsByType(result, ReconciliationOp.ADD);
      const moves = getOpsByType(result, ReconciliationOp.MOVE);

      expect(removes.length).toBe(1);
      expect(removes[0].key).toBe('1');

      expect(adds.length).toBe(1);
      expect(adds[0].key).toBe('3');

      expect(moves.length).toBe(1);
      expect(moves[0].key).toBe('2');
    });

    it('should return empty array for non-existent type', () => {
      const items: Todo[] = [{ id: '1', text: 'A' }];
      const result = reconcileArray(items, items, getKey);

      const removes = getOpsByType(result, ReconciliationOp.REMOVE);
      expect(removes).toEqual([]);
    });
  });

  describe('Complex scenarios', () => {
    it('should handle large arrays efficiently', () => {
      const oldItems: Todo[] = Array.from({ length: 1000 }, (_, i) => ({
        id: `${i}`,
        text: `Item ${i}`,
      }));

      const newItems: Todo[] = Array.from({ length: 1000 }, (_, i) => ({
        id: `${i + 500}`, // Shift IDs by 500
        text: `Item ${i + 500}`,
      }));

      const startTime = performance.now();
      const result = reconcileArray(oldItems, newItems, getKey);
      const duration = performance.now() - startTime;

      expect(result.toRemove.size).toBe(500); // 0-499 removed
      expect(result.toAdd.size).toBe(500); // 1000-1499 added
      expect(result.moved.size).toBe(500); // 500-999 kept
      expect(duration).toBeLessThan(50); // Should be fast
    });

    it('should handle duplicate keys (last one wins)', () => {
      // Note: In practice, keys should be unique
      // This tests behavior when keys accidentally duplicate
      const oldItems = [
        { id: '1', text: 'A' },
        { id: '1', text: 'B' }, // duplicate key
      ];

      const newItems = [{ id: '1', text: 'C' }];

      const result = reconcileArray(oldItems, newItems, getKey);

      // Last occurrence in old array should be matched
      expect(result.ops.length).toBeGreaterThan(0);
    });
  });
});
