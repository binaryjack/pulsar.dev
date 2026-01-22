import { describe, expect, it } from 'vitest';
import { produce } from '../produce';

describe('produce', () => {
  describe('Basic object updates', () => {
    it('should create a new object with modifications', () => {
      const base = { name: 'John', age: 30 };
      const result = produce(base, (draft) => {
        draft.age = 31;
      });

      expect(result).toEqual({ name: 'John', age: 31 });
      expect(result).not.toBe(base);
      expect(base.age).toBe(30); // Original unchanged
    });

    it('should handle multiple property updates', () => {
      const base = { a: 1, b: 2, c: 3 };
      const result = produce(base, (draft) => {
        draft.a = 10;
        draft.b = 20;
      });

      expect(result).toEqual({ a: 10, b: 20, c: 3 });
      expect(base).toEqual({ a: 1, b: 2, c: 3 });
    });

    it('should add new properties', () => {
      const base = { name: 'John' } as any;
      const result = produce(base, (draft) => {
        draft.age = 30;
      });

      expect(result).toEqual({ name: 'John', age: 30 });
      expect(base.age).toBeUndefined();
    });

    it('should delete properties', () => {
      const base = { name: 'John', age: 30 };
      const result = produce(base, (draft) => {
        delete (draft as any).age;
      });

      expect(result).toEqual({ name: 'John' });
      expect(base.age).toBe(30);
    });
  });

  describe('Nested object updates', () => {
    it('should handle nested property updates', () => {
      const base = {
        user: {
          profile: {
            name: 'John',
            age: 30,
          },
        },
      };

      const result = produce(base, (draft) => {
        draft.user.profile.age = 31;
      });

      expect(result.user.profile.age).toBe(31);
      expect(result).not.toBe(base);
      expect(result.user).not.toBe(base.user);
      expect(result.user.profile).not.toBe(base.user.profile);
      expect(base.user.profile.age).toBe(30);
    });

    it('should handle deeply nested updates', () => {
      const base = {
        level1: {
          level2: {
            level3: {
              level4: {
                value: 0,
              },
            },
          },
        },
      };

      const result = produce(base, (draft) => {
        draft.level1.level2.level3.level4.value = 100;
      });

      expect(result.level1.level2.level3.level4.value).toBe(100);
      expect(base.level1.level2.level3.level4.value).toBe(0);
    });

    it('should handle multiple nested updates', () => {
      const base = {
        user: { name: 'John', age: 30 },
        posts: { count: 5 },
      };

      const result = produce(base, (draft) => {
        draft.user.age = 31;
        draft.posts.count = 6;
      });

      expect(result.user.age).toBe(31);
      expect(result.posts.count).toBe(6);
      expect(base.user.age).toBe(30);
      expect(base.posts.count).toBe(5);
    });
  });

  describe('Array updates', () => {
    it('should handle array push', () => {
      const base = { items: [1, 2, 3] };
      const result = produce(base, (draft) => {
        draft.items.push(4);
      });

      expect(result.items).toEqual([1, 2, 3, 4]);
      expect(base.items).toEqual([1, 2, 3]);
      expect(result.items).not.toBe(base.items);
    });

    it('should handle array pop', () => {
      const base = { items: [1, 2, 3] };
      const result = produce(base, (draft) => {
        draft.items.pop();
      });

      expect(result.items).toEqual([1, 2]);
      expect(base.items).toEqual([1, 2, 3]);
    });

    it('should handle array splice', () => {
      const base = { items: [1, 2, 3, 4] };
      const result = produce(base, (draft) => {
        draft.items.splice(1, 2);
      });

      expect(result.items).toEqual([1, 4]);
      expect(base.items).toEqual([1, 2, 3, 4]);
    });

    it('should handle array index updates', () => {
      const base = { items: [1, 2, 3] };
      const result = produce(base, (draft) => {
        draft.items[1] = 20;
      });

      expect(result.items).toEqual([1, 20, 3]);
      expect(base.items).toEqual([1, 2, 3]);
    });

    it('should handle array of objects', () => {
      const base = {
        todos: [
          { id: 1, text: 'Learn', done: false },
          { id: 2, text: 'Build', done: false },
        ],
      };

      const result = produce(base, (draft) => {
        draft.todos[0].done = true;
        draft.todos.push({ id: 3, text: 'Ship', done: false });
      });

      expect(result.todos[0].done).toBe(true);
      expect(result.todos.length).toBe(3);
      expect(base.todos[0].done).toBe(false);
      expect(base.todos.length).toBe(2);
    });
  });

  describe('Edge cases', () => {
    it('should return base when no changes', () => {
      const base = { name: 'John', age: 30 };
      const result = produce(base, (draft) => {
        // No changes
      });

      expect(result).toBe(base); // Same reference
    });

    it('should handle setting same value', () => {
      const base = { name: 'John', age: 30 };
      const result = produce(base, (draft) => {
        draft.age = 30; // Same value
      });

      expect(result).toBe(base);
    });

    it('should handle primitives', () => {
      const base = 42;
      const result = produce(base as any, (draft) => {
        return 100;
      });

      expect(result).toBe(42); // Primitives returned as-is
    });

    it('should handle null', () => {
      const base = null;
      const result = produce(base as any, (draft) => {
        return { value: 1 };
      });

      expect(result).toBeNull();
    });

    it('should handle undefined', () => {
      const base = undefined;
      const result = produce(base as any, (draft) => {
        return { value: 1 };
      });

      expect(result).toBeUndefined();
    });

    it('should handle empty object', () => {
      const base = {};
      const result = produce(base, (draft) => {
        (draft as any).name = 'John';
      });

      expect(result).toEqual({ name: 'John' });
      expect(base).toEqual({});
    });

    it('should handle empty array', () => {
      const base = { items: [] as number[] };
      const result = produce(base, (draft) => {
        draft.items.push(1, 2, 3);
      });

      expect(result.items).toEqual([1, 2, 3]);
      expect(base.items).toEqual([]);
    });
  });

  describe('Return value from recipe', () => {
    it('should use returned value', () => {
      const base = { count: 0 };
      const result = produce(base, (draft) => {
        return { count: 10 }; // Replace entire state
      });

      expect(result).toEqual({ count: 10 });
      expect(base.count).toBe(0);
    });

    it('should ignore draft changes when returning', () => {
      const base = { count: 0 };
      const result = produce(base, (draft) => {
        draft.count = 5; // This is ignored
        return { count: 10 }; // This is used
      });

      expect(result).toEqual({ count: 10 });
    });
  });

  describe('Complex scenarios', () => {
    it('should handle mixed updates', () => {
      const base = {
        user: { name: 'John', age: 30 },
        posts: [{ id: 1, title: 'Hello' }],
        meta: { version: 1 },
      };

      const result = produce(base, (draft) => {
        draft.user.age = 31;
        draft.posts.push({ id: 2, title: 'World' });
        draft.posts[0].title = 'Hi';
        draft.meta.version = 2;
      });

      expect(result.user.age).toBe(31);
      expect(result.posts.length).toBe(2);
      expect(result.posts[0].title).toBe('Hi');
      expect(result.meta.version).toBe(2);

      expect(base.user.age).toBe(30);
      expect(base.posts.length).toBe(1);
      expect(base.posts[0].title).toBe('Hello');
      expect(base.meta.version).toBe(1);
    });

    it('should handle Redux-style reducers', () => {
      const state = {
        count: 0,
        todos: [] as Array<{ id: number; text: string; done: boolean }>,
      };

      // Increment action
      let next = produce(state, (draft) => {
        draft.count += 1;
      });
      expect(next.count).toBe(1);

      // Add todo action
      next = produce(next, (draft) => {
        draft.todos.push({ id: 1, text: 'Learn Pulsar', done: false });
      });
      expect(next.todos.length).toBe(1);

      // Toggle todo action
      next = produce(next, (draft) => {
        const todo = draft.todos.find((t) => t.id === 1);
        if (todo) todo.done = true;
      });
      expect(next.todos[0].done).toBe(true);

      // Original state unchanged
      expect(state.count).toBe(0);
      expect(state.todos.length).toBe(0);
    });

    it('should handle deeply nested arrays', () => {
      const base = {
        matrix: [
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9],
        ],
      };

      const result = produce(base, (draft) => {
        draft.matrix[1][1] = 50;
        draft.matrix.push([10, 11, 12]);
      });

      expect(result.matrix[1][1]).toBe(50);
      expect(result.matrix.length).toBe(4);
      expect(base.matrix[1][1]).toBe(5);
      expect(base.matrix.length).toBe(3);
    });

    it('should handle object with methods', () => {
      const base = {
        count: 0,
        increment() {
          this.count++;
        },
      };

      const result = produce(base, (draft) => {
        draft.count = 10;
      });

      expect(result.count).toBe(10);
      expect(typeof result.increment).toBe('function');
      expect(base.count).toBe(0);
    });
  });

  describe('Type safety', () => {
    it('should preserve types', () => {
      interface IUser {
        name: string;
        age: number;
        active: boolean;
      }

      const user: IUser = {
        name: 'John',
        age: 30,
        active: true,
      };

      const result = produce(user, (draft) => {
        draft.age = 31;
        draft.active = false;
      });

      // TypeScript should allow these
      expect(result.name).toBe('John');
      expect(result.age).toBe(31);
      expect(result.active).toBe(false);
    });

    it('should handle optional properties', () => {
      interface IConfig {
        required: string;
        optional?: number;
      }

      const config: IConfig = {
        required: 'value',
      };

      const result = produce(config, (draft) => {
        draft.optional = 42;
      });

      expect(result.optional).toBe(42);
    });
  });

  describe('Performance', () => {
    it('should only copy modified branches', () => {
      const base = {
        a: { value: 1 },
        b: { value: 2 },
        c: { value: 3 },
      };

      const result = produce(base, (draft) => {
        draft.a.value = 10;
      });

      // Only modified branch should be new
      expect(result.a).not.toBe(base.a);
      // Unmodified branches should be same reference
      expect(result.b).toBe(base.b);
      expect(result.c).toBe(base.c);
    });

    it('should handle large arrays efficiently', () => {
      const base = { items: Array.from({ length: 1000 }, (_, i) => i) };

      const result = produce(base, (draft) => {
        draft.items[500] = 9999;
      });

      expect(result.items[500]).toBe(9999);
      expect(result.items.length).toBe(1000);
      expect(base.items[500]).toBe(500);
    });
  });
});
