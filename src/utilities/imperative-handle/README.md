# Imperative Handle - Escape Hatch for Browser APIs

## ⚠️ WARNING: Use Only When Declarative Patterns Are Not Feasible

This utility provides an escape hatch for rare cases where browser APIs cannot be effectively wrapped in declarative patterns. **99% of components should use declarative props** - only reach for this when you've exhausted declarative alternatives.

---

## Valid Use Cases

### ✅ ACCEPTABLE (< 1% of components)

1. **Video/Audio Control**
   - Playback control (play, pause, seek)
   - Volume management
   - Playback rate control

2. **Canvas/WebGL Contexts**
   - Canvas drawing operations
   - WebGL rendering contexts
   - Complex graphics manipulation

3. **Browser Focus Management**
   - Programmatic focus control
   - Tab order manipulation
   - Accessibility focus features

4. **Third-Party DOM Libraries**
   - Chart libraries (D3, Chart.js)
   - Rich text editors (Quill, ProseMirror)
   - Map libraries (Leaflet, Mapbox)

5. **Performance-Critical Animations**
   - RequestAnimationFrame-based animations
   - Complex gesture handlers
   - Game loop controls

6. **DOM Measurements**
   - getBoundingClientRect operations
   - Scroll position queries
   - Element size calculations

7. **Scroll Control**
   - Programmatic scrolling
   - Scroll position manipulation
   - Virtual scroll management

---

## ❌ INVALID Use Cases (Use Declarative Props Instead)

1. **Modal/Dialog Control** → Use `isOpen` prop
2. **Form Submission** → Use `onSubmit` callback
3. **Data Fetching** → Use resource signals
4. **Component State** → Use signals/props
5. **Visibility Control** → Use `visible` prop
6. **Loading States** → Use `loading` prop
7. **Error Display** → Use `error` prop

---

## API Reference

### `createImperativeHandle<T>(config?): IImperativeHandle<T>`

Creates a signal-based imperative handle for browser API wrappers.

**Type Parameters:**

- `T` - Interface of the imperative API

**Parameters:**

- `config?: IImperativeHandleConfig`
  - `name?: string` - Name for debugging (recommended)
  - `allowReregistration?: boolean` - Allow replacing handle (default: false)
  - `validate?: (handle: unknown) => boolean` - Validation function

**Returns:** `IImperativeHandle<T>`

- `register(handle: T): void` - Register the imperative API
- `get(): T | null` - Retrieve the API (null if not registered)
- `dispose(): void` - Cleanup and clear the handle

---

## Examples

### ✅ Valid: Video Player Control

```typescript
import { createImperativeHandle } from '@pulsar/utilities';

// Define imperative API interface
interface VideoPlayerAPI {
  play(): Promise<void>;
  pause(): void;
  seek(time: number): void;
  getCurrentTime(): number;
}

// Create handle in parent scope
const videoHandle = createImperativeHandle<VideoPlayerAPI>({
  name: 'VideoPlayer',
  validate: (h) =>
    typeof h === 'object' &&
    h !== null &&
    'play' in h &&
    'pause' in h
});

// Component registers its API
const VideoPlayer = (props: { src: string }) => {
  let videoElement: HTMLVideoElement;

  // Register imperative API when component mounts
  createEffect(() => {
    videoHandle.register({
      play: () => videoElement.play(),
      pause: () => videoElement.pause(),
      seek: (time: number) => {
        videoElement.currentTime = time;
      },
      getCurrentTime: () => videoElement.currentTime
    });

    // Cleanup on unmount
    return () => videoHandle.dispose();
  });

  return <video ref={videoElement} src={props.src} />;
};

// Parent uses imperative API
const App = () => {
  const handlePlay = () => {
    const api = videoHandle.get();
    api?.play();
  };

  const handleSeek = (time: number) => {
    const api = videoHandle.get();
    api?.seek(time);
  };

  return (
    <>
      <button onClick={handlePlay}>Play</button>
      <button onClick={() => handleSeek(30)}>Jump to 30s</button>
      <VideoPlayer src="/video.mp4" />
    </>
  );
};
```

---

### ✅ Valid: Canvas Drawing API

```typescript
import { createImperativeHandle } from '@pulsar/utilities';

interface CanvasAPI {
  clear(): void;
  drawRect(x: number, y: number, width: number, height: number, color: string): void;
  drawCircle(x: number, y: number, radius: number, color: string): void;
  export(): Blob;
}

const canvasHandle = createImperativeHandle<CanvasAPI>({
  name: 'CanvasDrawing'
});

const Canvas = (props: { width: number; height: number }) => {
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D | null;

  createEffect(() => {
    ctx = canvas.getContext('2d');

    canvasHandle.register({
      clear: () => {
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
      },
      drawRect: (x, y, w, h, color) => {
        if (ctx) {
          ctx.fillStyle = color;
          ctx.fillRect(x, y, w, h);
        }
      },
      drawCircle: (x, y, r, color) => {
        if (ctx) {
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
        }
      },
      export: () => canvas.toBlob() as Promise<Blob>
    });

    return () => canvasHandle.dispose();
  });

  return <canvas ref={canvas} width={props.width} height={props.height} />;
};

const DrawingApp = () => {
  const draw = () => {
    const api = canvasHandle.get();
    api?.clear();
    api?.drawRect(10, 10, 50, 50, 'blue');
    api?.drawCircle(100, 100, 30, 'red');
  };

  return (
    <>
      <button onClick={draw}>Draw Shapes</button>
      <Canvas width={400} height={400} />
    </>
  );
};
```

---

### ❌ Invalid: Modal Control (Use Declarative Instead)

```typescript
// ❌ WRONG - Imperative modal control
import { createImperativeHandle } from '@pulsar/utilities';

interface ModalAPI {
  open(): void;
  close(): void;
}

const modalHandle = createImperativeHandle<ModalAPI>();

const Modal = (props: { children: JSX.Element }) => {
  const [isOpen, setIsOpen] = createSignal(false);

  modalHandle.register({
    open: () => setIsOpen(true),
    close: () => setIsOpen(false)
  });

  if (!isOpen()) return null;
  return <div class="modal">{props.children}</div>;
};

// Parent uses imperative API (BAD!)
const App = () => {
  return (
    <>
      <button onClick={() => modalHandle.get()?.open()}>Open Modal</button>
      <Modal>Content</Modal>
    </>
  );
};
```

```typescript
// ✅ RIGHT - Declarative modal control
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: JSX.Element;
}

const Modal = (props: ModalProps) => {
  if (!props.isOpen) return null;

  return (
    <div class="modal">
      <button onClick={props.onClose}>Close</button>
      {props.children}
    </div>
  );
};

// Parent controls state declaratively (GOOD!)
const App = () => {
  const [isModalOpen, setIsModalOpen] = createSignal(false);

  return (
    <>
      <button onClick={() => setIsModalOpen(true)}>Open Modal</button>
      <Modal isOpen={isModalOpen()} onClose={() => setIsModalOpen(false)}>
        Content
      </Modal>
    </>
  );
};
```

---

## Validation and Debugging

### Add Validation for Type Safety

```typescript
interface VideoPlayerAPI {
  play(): Promise<void>;
  pause(): void;
  seek(time: number): void;
}

const videoHandle = createImperativeHandle<VideoPlayerAPI>({
  name: 'VideoPlayer',
  validate: (handle) => {
    return (
      typeof handle === 'object' &&
      handle !== null &&
      'play' in handle &&
      'pause' in handle &&
      'seek' in handle &&
      typeof handle.play === 'function' &&
      typeof handle.pause === 'function' &&
      typeof handle.seek === 'function'
    );
  },
});

// Will throw if validation fails
videoHandle.register({ play: () => {}, pause: () => {} }); // ❌ Missing 'seek'
```

### Development Warnings

In development mode, the utility provides helpful warnings:

```typescript
const handle = createImperativeHandle<API>({ name: 'MyComponent' });

// Warning: Attempting to get handle before registration
handle.get(); // ⚠️ Logs warning in DEV

// Log: Handle registered
handle.register(api); // ✅ Logs confirmation in DEV

// Log: Handle disposed
handle.dispose(); // ✅ Logs confirmation in DEV
```

---

## Code Review Requirements

**All uses of `createImperativeHandle` MUST:**

1. **Document the use case** with comments
2. **Justify why declarative won't work**
3. **Include metadata in code:**

```typescript
/**
 * @imperative-handle
 * @use-case video-audio-control
 * @reason HTML video API is inherently imperative (play/pause/seek)
 * @approval-ref PR #123 reviewed by @maintainer
 */
const videoHandle = createImperativeHandle<VideoPlayerAPI>({
  name: 'VideoPlayer',
});
```

4. **Get code review approval** before merging

---

## Performance Considerations

### Memory Management

Always dispose handles when components unmount:

```typescript
const VideoPlayer = () => {
  createEffect(() => {
    videoHandle.register(api);

    // IMPORTANT: Cleanup on unmount
    return () => videoHandle.dispose();
  });

  return <video />;
};
```

### Re-registration

By default, handles cannot be re-registered (prevents bugs). Enable only if needed:

```typescript
const handle = createImperativeHandle({
  allowReregistration: true, // Use with caution
});
```

---

## Testing

Test imperative handles like any other API:

```typescript
import { createImperativeHandle } from '@pulsar/utilities';

describe('VideoPlayer', () => {
  it('should expose play/pause API', () => {
    const handle = createImperativeHandle<VideoPlayerAPI>();

    // Mount component (registers handle)
    const { unmount } = render(<VideoPlayer />);

    // Test imperative API
    const api = handle.get();
    expect(api).not.toBeNull();

    api?.play();
    expect(videoElement.play).toHaveBeenCalled();

    // Cleanup
    unmount();
    expect(handle.get()).toBeNull();
  });
});
```

---

## Migration from Imperative to Declarative

If you find a better declarative pattern later:

**Before (Imperative):**

```typescript
const modalHandle = createImperativeHandle<ModalAPI>();
modalHandle.get()?.open();
```

**After (Declarative):**

```typescript
const [isOpen, setIsOpen] = createSignal(false);
<Modal isOpen={isOpen()} onClose={() => setIsOpen(false)} />
```

**Migration steps:**

1. Add declarative props alongside imperative API
2. Deprecate imperative API with warnings
3. Update all consumers to use declarative props
4. Remove imperative API in next major version

---

## Summary

- **Use declarative props for 99% of components**
- **Only use imperative handles for browser APIs that can't be made declarative**
- **Always document and justify usage**
- **Require code review approval**
- **Test thoroughly**
- **Dispose on unmount**

**When in doubt, try declarative first!**
