import { useKeyBindings } from './use-key-bindings';

describe('useKeyBindings', () => {
  it('should call onKey handler for any key', () => {
    const onKey = jest.fn();
    const handler = useKeyBindings({ onKey });

    const event = new KeyboardEvent('keydown', { key: 'a' });
    handler(event);

    expect(onKey).toHaveBeenCalledWith(event);
  });

  it('should call onEnter when Enter is pressed', () => {
    const onEnter = jest.fn();
    const handler = useKeyBindings({ onEnter });

    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    handler(event);

    expect(onEnter).toHaveBeenCalledWith(event);
  });

  it('should call onEscape when Escape is pressed', () => {
    const onEscape = jest.fn();
    const handler = useKeyBindings({ onEscape });

    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    handler(event);

    expect(onEscape).toHaveBeenCalledWith(event);
  });

  it('should call onSpace when Space is pressed', () => {
    const onSpace = jest.fn();
    const handler = useKeyBindings({ onSpace });

    const event = new KeyboardEvent('keydown', { key: ' ' });
    handler(event);

    expect(onSpace).toHaveBeenCalledWith(event);
  });

  it('should call arrow key handlers', () => {
    const onArrowDown = jest.fn();
    const onArrowUp = jest.fn();
    const onArrowLeft = jest.fn();
    const onArrowRight = jest.fn();

    const handler = useKeyBindings({
      onArrowDown,
      onArrowUp,
      onArrowLeft,
      onArrowRight,
    });

    handler(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    expect(onArrowDown).toHaveBeenCalled();

    handler(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
    expect(onArrowUp).toHaveBeenCalled();

    handler(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    expect(onArrowLeft).toHaveBeenCalled();

    handler(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    expect(onArrowRight).toHaveBeenCalled();
  });

  it('should call onDelete and onBackspace', () => {
    const onDelete = jest.fn();
    const onBackspace = jest.fn();

    const handler = useKeyBindings({ onDelete, onBackspace });

    handler(new KeyboardEvent('keydown', { key: 'Delete' }));
    expect(onDelete).toHaveBeenCalled();

    handler(new KeyboardEvent('keydown', { key: 'Backspace' }));
    expect(onBackspace).toHaveBeenCalled();
  });

  it('should call onTab when Tab is pressed', () => {
    const onTab = jest.fn();
    const handler = useKeyBindings({ onTab });

    const event = new KeyboardEvent('keydown', { key: 'Tab' });
    handler(event);

    expect(onTab).toHaveBeenCalledWith(event);
  });

  it('should call both onKey and specific handler', () => {
    const onKey = jest.fn();
    const onEnter = jest.fn();
    const handler = useKeyBindings({ onKey, onEnter });

    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    handler(event);

    expect(onKey).toHaveBeenCalledWith(event);
    expect(onEnter).toHaveBeenCalledWith(event);
  });

  it('should handle multiple bindings in one handler', () => {
    const onEnter = jest.fn();
    const onEscape = jest.fn();
    const onArrowDown = jest.fn();

    const handler = useKeyBindings({ onEnter, onEscape, onArrowDown });

    handler(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(onEnter).toHaveBeenCalled();
    expect(onEscape).not.toHaveBeenCalled();

    handler(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(onEscape).toHaveBeenCalled();
  });

  it('should not throw when unhandled key is pressed', () => {
    const handler = useKeyBindings({ onEnter: jest.fn() });

    expect(() => {
      handler(new KeyboardEvent('keydown', { key: 'a' }));
    }).not.toThrow();
  });
});
