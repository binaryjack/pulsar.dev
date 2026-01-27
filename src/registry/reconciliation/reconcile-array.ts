/**
 * Array Reconciliation
 * Efficiently diffs old/new arrays to determine adds, removes, moves
 */

/**
 * Operation types for array reconciliation
 */
export enum ReconciliationOp {
  /** Item removed from array */
  REMOVE = 'remove',
  /** Item added to array */
  ADD = 'add',
  /** Item moved to different index */
  MOVE = 'move',
  /** Item updated (data changed but same key) */
  UPDATE = 'update',
  /** Item unchanged (same key, same index) */
  KEEP = 'keep',
}

/**
 * Reconciliation operation descriptor
 */
export interface IReconciliationOp<T> {
  /** Operation type */
  type: ReconciliationOp;
  /** Item key */
  key: string;
  /** Item data */
  item?: T;
  /** Old index (for REMOVE, MOVE, UPDATE, KEEP) */
  oldIndex?: number;
  /** New index (for ADD, MOVE, UPDATE, KEEP) */
  newIndex?: number;
}

/**
 * Reconciliation result
 */
export interface IReconciliationResult<T> {
  /** Operations to apply */
  ops: IReconciliationOp<T>[];
  /** Keys to remove */
  toRemove: Set<string>;
  /** Keys to add */
  toAdd: Set<string>;
  /** Keys that moved */
  moved: Map<string, number>;
}

/**
 * Key extractor function
 */
export type KeyExtractor<T> = (item: T, index: number) => string;

/**
 * Reconcile old and new arrays
 *
 * @param oldItems - Previous array
 * @param newItems - New array
 * @param getKey - Function to extract unique key from item
 * @returns Reconciliation result with operations
 *
 * @example
 * ```typescript
 * const oldTodos = [{ id: '1', text: 'A' }, { id: '2', text: 'B' }]
 * const newTodos = [{ id: '2', text: 'B' }, { id: '3', text: 'C' }]
 * const result = reconcileArray(oldTodos, newTodos, (t) => t.id)
 * // result.ops: [
 * //   { type: 'REMOVE', key: '1', oldIndex: 0 },
 * //   { type: 'MOVE', key: '2', oldIndex: 1, newIndex: 0 },
 * //   { type: 'ADD', key: '3', item: {...}, newIndex: 1 }
 * // ]
 * ```
 */
export function reconcileArray<T>(
  oldItems: T[],
  newItems: T[],
  getKey: KeyExtractor<T>
): IReconciliationResult<T> {
  const ops: IReconciliationOp<T>[] = [];
  const toRemove = new Set<string>();
  const toAdd = new Set<string>();
  const moved = new Map<string, number>();

  // Build maps for fast lookup
  const oldMap = new Map<string, { item: T; index: number }>();
  const newMap = new Map<string, { item: T; index: number }>();

  // Index old items
  oldItems.forEach((item, index) => {
    const key = getKey(item, index);
    oldMap.set(key, { item, index });
  });

  // Index new items
  newItems.forEach((item, index) => {
    const key = getKey(item, index);
    newMap.set(key, { item, index });
  });

  // Find removes (in old but not in new)
  oldMap.forEach(({ item, index }, key) => {
    if (!newMap.has(key)) {
      toRemove.add(key);
      ops.push({
        type: ReconciliationOp.REMOVE,
        key,
        item,
        oldIndex: index,
      });
    }
  });

  // Find adds, moves, and updates
  newMap.forEach(({ item, index: newIndex }, key) => {
    const oldEntry = oldMap.get(key);

    if (!oldEntry) {
      // Add: key not in old array
      toAdd.add(key);
      ops.push({
        type: ReconciliationOp.ADD,
        key,
        item,
        newIndex,
      });
    } else if (oldEntry.index !== newIndex) {
      // Move: key exists but different index
      moved.set(key, newIndex);
      ops.push({
        type: ReconciliationOp.MOVE,
        key,
        item,
        oldIndex: oldEntry.index,
        newIndex,
      });
    } else if (oldEntry.item !== item) {
      // Update: same key, same index, but different data
      ops.push({
        type: ReconciliationOp.UPDATE,
        key,
        item,
        oldIndex: oldEntry.index,
        newIndex,
      });
    } else {
      // Keep: same key, same index, same data
      ops.push({
        type: ReconciliationOp.KEEP,
        key,
        item,
        oldIndex: oldEntry.index,
        newIndex,
      });
    }
  });

  return {
    ops,
    toRemove,
    toAdd,
    moved,
  };
}

/**
 * Check if reconciliation requires DOM updates
 * @param result - Reconciliation result
 * @returns True if DOM changes needed
 */
export function hasChanges<T>(result: IReconciliationResult<T>): boolean {
  return (
    result.toRemove.size > 0 ||
    result.toAdd.size > 0 ||
    result.moved.size > 0 ||
    result.ops.some((op) => op.type === ReconciliationOp.UPDATE)
  );
}

/**
 * Get operations by type
 * @param result - Reconciliation result
 * @param type - Operation type to filter
 * @returns Operations of specified type
 */
export function getOpsByType<T>(
  result: IReconciliationResult<T>,
  type: ReconciliationOp
): IReconciliationOp<T>[] {
  return result.ops.filter((op) => op.type === type);
}
