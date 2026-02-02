import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createImperativeHandle } from '../create-imperative-handle';

describe('createImperativeHandle', () => {
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    consoleLogSpy.mockRestore();
  });

  describe('basic functionality', () => {
    it('should create imperative handle', () => {
      const handle = createImperativeHandle<{ method(): void }>();

      expect(handle).toHaveProperty('register');
      expect(handle).toHaveProperty('get');
      expect(handle).toHaveProperty('dispose');
    });

    it('should register and retrieve handle', () => {
      interface TestAPI {
        value: number;
        method(): void;
      }

      const handle = createImperativeHandle<TestAPI>();
      const api: TestAPI = {
        value: 42,
        method: vi.fn(),
      };

      handle.register(api);
      const retrieved = handle.get();

      expect(retrieved).toBe(api);
      expect(retrieved?.value).toBe(42);
    });

    it('should return null before registration', () => {
      const handle = createImperativeHandle<{ method(): void }>();

      expect(handle.get()).toBeNull();
    });

    it('should dispose handle', () => {
      const handle = createImperativeHandle<{ value: number }>();
      handle.register({ value: 42 });

      expect(handle.get()).not.toBeNull();

      handle.dispose();

      expect(handle.get()).toBeNull();
    });
  });

  describe('validation', () => {
    it('should validate handle on registration', () => {
      interface VideoAPI {
        play(): void;
        pause(): void;
      }

      const handle = createImperativeHandle<VideoAPI>({
        name: 'VideoPlayer',
        validate: (h) => typeof h === 'object' && h !== null && 'play' in h && 'pause' in h,
      });

      const validAPI: VideoAPI = {
        play: vi.fn(),
        pause: vi.fn(),
      };

      expect(() => handle.register(validAPI)).not.toThrow();
      expect(handle.get()).toBe(validAPI);
    });

    it('should throw on invalid handle', () => {
      interface VideoAPI {
        play(): void;
        pause(): void;
      }

      const handle = createImperativeHandle<VideoAPI>({
        name: 'VideoPlayer',
        validate: (h) => typeof h === 'object' && h !== null && 'play' in h && 'pause' in h,
      });

      const invalidAPI = { play: vi.fn() }; // Missing pause

      expect(() => handle.register(invalidAPI as VideoAPI)).toThrow(/validation failed/);
    });

    it('should throw on re-registration by default', () => {
      const handle = createImperativeHandle<{ value: number }>({ name: 'Test' });

      handle.register({ value: 1 });

      expect(() => handle.register({ value: 2 })).toThrow(/already registered/);
    });

    it('should allow re-registration when configured', () => {
      const handle = createImperativeHandle<{ value: number }>({
        name: 'Test',
        allowReregistration: true,
      });

      handle.register({ value: 1 });
      expect(handle.get()?.value).toBe(1);

      handle.register({ value: 2 });
      expect(handle.get()?.value).toBe(2);
    });
  });

  describe('edge cases', () => {
    it('should handle null handle', () => {
      const handle = createImperativeHandle<{ value: number } | null>();

      handle.register(null);

      expect(handle.get()).toBeNull();
    });

    it('should handle undefined handle', () => {
      const handle = createImperativeHandle<{ value: number } | undefined>();

      handle.register(undefined);

      expect(handle.get()).toBeUndefined();
    });

    it('should handle complex object handles', () => {
      interface ComplexAPI {
        nested: {
          deep: {
            value: string;
          };
        };
        method(): number;
      }

      const handle = createImperativeHandle<ComplexAPI>();
      const api: ComplexAPI = {
        nested: {
          deep: {
            value: 'test',
          },
        },
        method: () => 42,
      };

      handle.register(api);
      const retrieved = handle.get();

      expect(retrieved?.nested.deep.value).toBe('test');
      expect(retrieved?.method()).toBe(42);
    });

    it('should handle function handles', () => {
      type FunctionAPI = () => void;

      const handle = createImperativeHandle<FunctionAPI>();
      const fn = vi.fn();

      handle.register(fn);
      const retrieved = handle.get();

      retrieved?.();
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  describe('real-world use cases', () => {
    it('should handle video player API', () => {
      interface VideoPlayerAPI {
        play(): Promise<void>;
        pause(): void;
        seek(time: number): void;
        getCurrentTime(): number;
      }

      const handle = createImperativeHandle<VideoPlayerAPI>({
        name: 'VideoPlayer',
        validate: (h) =>
          typeof h === 'object' && h !== null && 'play' in h && 'pause' in h && 'seek' in h,
      });

      let currentTime = 0;
      const videoAPI: VideoPlayerAPI = {
        play: vi.fn().mockResolvedValue(undefined),
        pause: vi.fn(),
        seek: vi.fn((time: number) => {
          currentTime = time;
        }),
        getCurrentTime: () => currentTime,
      };

      handle.register(videoAPI);

      const api = handle.get();
      expect(api).not.toBeNull();

      api?.seek(30);
      expect(currentTime).toBe(30);
      expect(api?.getCurrentTime()).toBe(30);
    });

    it('should handle canvas context API', () => {
      interface CanvasAPI {
        getContext(): CanvasRenderingContext2D | null;
        clear(): void;
        drawRect(x: number, y: number, w: number, h: number): void;
      }

      const handle = createImperativeHandle<CanvasAPI>({ name: 'Canvas' });

      const mockCtx = {
        fillRect: vi.fn(),
        clearRect: vi.fn(),
      } as unknown as CanvasRenderingContext2D;

      const canvasAPI: CanvasAPI = {
        getContext: () => mockCtx,
        clear: vi.fn(),
        drawRect: vi.fn(),
      };

      handle.register(canvasAPI);

      const api = handle.get();
      api?.drawRect(0, 0, 100, 100);

      expect(canvasAPI.drawRect).toHaveBeenCalledWith(0, 0, 100, 100);
    });

    it('should handle focus management API', () => {
      interface FocusAPI {
        focus(): void;
        blur(): void;
        isFocused(): boolean;
      }

      const handle = createImperativeHandle<FocusAPI>({ name: 'FocusManager' });

      let focused = false;
      const focusAPI: FocusAPI = {
        focus: () => {
          focused = true;
        },
        blur: () => {
          focused = false;
        },
        isFocused: () => focused,
      };

      handle.register(focusAPI);

      const api = handle.get();
      expect(api?.isFocused()).toBe(false);

      api?.focus();
      expect(api?.isFocused()).toBe(true);

      api?.blur();
      expect(api?.isFocused()).toBe(false);
    });
  });

  describe('memory management', () => {
    it('should not leak memory on dispose', () => {
      const handle = createImperativeHandle<{ data: number[] }>();

      const largeData = new Array(10000).fill(0).map((_, i) => i);
      handle.register({ data: largeData });

      expect(handle.get()).not.toBeNull();

      handle.dispose();

      expect(handle.get()).toBeNull();
      // Handle should be eligible for GC now
    });

    it('should allow re-registration after dispose', () => {
      const handle = createImperativeHandle<{ value: number }>();

      handle.register({ value: 1 });
      handle.dispose();

      // Should be able to register again after dispose
      expect(() => handle.register({ value: 2 })).not.toThrow();
      expect(handle.get()?.value).toBe(2);
    });
  });

  describe('type safety', () => {
    it('should enforce type constraints', () => {
      interface TypedAPI {
        value: string;
        method(): number;
      }

      const handle = createImperativeHandle<TypedAPI>();

      const api: TypedAPI = {
        value: 'test',
        method: () => 42,
      };

      handle.register(api);

      const retrieved = handle.get();
      if (retrieved) {
        // TypeScript should enforce types
        const str: string = retrieved.value;
        const num: number = retrieved.method();

        expect(str).toBe('test');
        expect(num).toBe(42);
      }
    });
  });

  describe('development warnings', () => {
    it('should warn when getting handle before registration in DEV', () => {
      const handle = createImperativeHandle<{ value: number }>({ name: 'TestHandle' });

      handle.get();

      if (import.meta.env.DEV) {
        expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('before registration'));
      }
    });

    it('should warn when no name provided in DEV', () => {
      createImperativeHandle<{ value: number }>();

      if (import.meta.env.DEV) {
        expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('No name provided'));
      }
    });

    it('should log registration in DEV when named', () => {
      const handle = createImperativeHandle<{ value: number }>({ name: 'TestHandle' });

      handle.register({ value: 42 });

      if (import.meta.env.DEV) {
        expect(consoleLogSpy).toHaveBeenCalledWith(
          expect.stringContaining('Handle registered'),
          expect.objectContaining({ value: 42 })
        );
      }
    });

    it('should log disposal in DEV when named', () => {
      const handle = createImperativeHandle<{ value: number }>({ name: 'TestHandle' });

      handle.register({ value: 42 });
      handle.dispose();

      if (import.meta.env.DEV) {
        expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Handle disposed'));
      }
    });
  });

  describe('integration with signals', () => {
    it('should work with signal-based reactivity', () => {
      interface ReactiveAPI {
        getValue(): number;
        setValue(value: number): void;
      }

      const handle = createImperativeHandle<ReactiveAPI>();

      // Simulate signal-based API
      let value = 0;
      const api: ReactiveAPI = {
        getValue: () => value,
        setValue: (v) => {
          value = v;
        },
      };

      handle.register(api);

      const retrieved = handle.get();
      expect(retrieved?.getValue()).toBe(0);

      retrieved?.setValue(42);
      expect(retrieved?.getValue()).toBe(42);
    });
  });
});
