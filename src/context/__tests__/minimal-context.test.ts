/**
 * Minimal Context Test - Verify basic context functionality
 */

import { createContext, createSignal, useContext } from '@pulsar-framework/pulsar.dev';
import { describe, expect, it } from 'vitest';

describe('Context System Minimal Test', () => {
  it('should provide and consume context value', () => {
    // Create context
    const TestContext = createContext({ value: 'default' });

    // Simple consumer component
    const Consumer = () => {
      const ctx = useContext(TestContext);
      const div = document.createElement('div');
      div.textContent = `Value: ${ctx.value}`;
      return div;
    };

    // Wrap in provider - pass children as function for deferred evaluation
    const app = TestContext.Provider({
      value: { value: 'provided' },
      children: () => Consumer(),
    });

    // Check that provider returns children with correct context value
    console.log('[TEST] app =', app);
    console.log('[TEST] app.textContent =', app?.textContent);
    expect(app).toBeDefined();
    expect(app?.textContent).toContain('provided');
  });

  it('should render nested providers correctly', () => {
    const Ctx1 = createContext({ name: 'ctx1-default' });
    const Ctx2 = createContext({ name: 'ctx2-default' });

    const DeepConsumer = () => {
      const ctx1 = useContext(Ctx1);
      const ctx2 = useContext(Ctx2);
      const div = document.createElement('div');
      div.textContent = `${ctx1.name} | ${ctx2.name}`;
      return div;
    };

    // Nest providers - each must defer children evaluation
    const level1 = Ctx1.Provider({
      value: { name: 'ctx1-provided' },
      children: () =>
        Ctx2.Provider({
          value: { name: 'ctx2-provided' },
          children: () => DeepConsumer(),
        }),
    });

    expect(level1.textContent).toContain('ctx1-provided');
    expect(level1.textContent).toContain('ctx2-provided');
  });

  it('should handle signal-based context values', () => {
    const ThemeCtx = createContext({ theme: () => 'light' });

    const Consumer = () => {
      const ctx = useContext(ThemeCtx);
      const div = document.createElement('div');
      div.textContent = `Theme: ${ctx.theme()}`;
      return div;
    };

    const [theme, setTheme] = createSignal('dark');

    const app = ThemeCtx.Provider({
      value: { theme },
      children: () => Consumer(),
    });

    expect(app.textContent).toContain('dark');
  });
});
