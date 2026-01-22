/**
 * SSR Tests - renderToString
 */

import { describe, expect, it } from 'vitest';
import { renderToString } from '../render-to-string';

// Simple JSX element creator for testing
const h = (type: string | Function, props: any, ...children: any[]) => ({
  type,
  props: { ...props, children: children.length === 1 ? children[0] : children },
});

describe('renderToString', () => {
  it('should render simple text', () => {
    const App = () => 'Hello World';
    const result = renderToString(App);

    expect(result.html).toBe('Hello World');
  });

  it('should render HTML element', () => {
    const App = () => h('div', null, 'Hello');
    const result = renderToString(App);

    expect(result.html).toBe('<div>Hello</div>');
  });

  it('should render nested elements', () => {
    const App = () =>
      h('div', { class: 'container' }, h('h1', null, 'Title'), h('p', null, 'Content'));

    const result = renderToString(App);

    expect(result.html).toContain('<div class="container">');
    expect(result.html).toContain('<h1>Title</h1>');
    expect(result.html).toContain('<p>Content</p>');
  });

  it('should escape HTML in text content', () => {
    const App = () => h('div', null, '<script>alert("xss")</script>');
    const result = renderToString(App);

    expect(result.html).not.toContain('<script>');
    expect(result.html).toContain('&lt;script&gt;');
  });

  it('should escape HTML in attributes', () => {
    const App = () => h('div', { title: '<script>alert("xss")</script>' }, 'Safe');
    const result = renderToString(App);

    expect(result.html).toContain('title="&lt;script&gt;');
  });

  it('should handle boolean attributes', () => {
    const App = () => h('input', { disabled: true, checked: false });
    const result = renderToString(App);

    expect(result.html).toContain('disabled');
    expect(result.html).not.toContain('checked');
  });

  it('should skip event handlers', () => {
    const App = () => h('button', { onclick: () => {} }, 'Click');
    const result = renderToString(App);

    expect(result.html).not.toContain('onclick');
    expect(result.html).toBe('<button>Click</button>');
  });

  it('should handle void elements', () => {
    const App = () => h('div', null, h('br'), h('hr'));
    const result = renderToString(App);

    expect(result.html).toBe('<div><br><hr></div>');
  });

  it('should handle null and undefined', () => {
    const App = () => h('div', null, null, undefined, 'text');
    const result = renderToString(App);

    expect(result.html).toBe('<div>text</div>');
  });

  it('should handle arrays of children', () => {
    const App = () =>
      h('ul', null, [h('li', null, 'Item 1'), h('li', null, 'Item 2'), h('li', null, 'Item 3')]);

    const result = renderToString(App);

    expect(result.html).toContain('<ul>');
    expect(result.html).toContain('<li>Item 1</li>');
    expect(result.html).toContain('<li>Item 2</li>');
    expect(result.html).toContain('<li>Item 3</li>');
  });

  it('should handle component composition', () => {
    const Button = (props: any) => h('button', null, props.label);
    const App = () => h('div', null, Button({ label: 'Submit' }));

    const result = renderToString(App);

    expect(result.html).toContain('<button>Submit</button>');
  });

  it('should serialize state when requested', () => {
    const App = () => h('div', null, 'App');
    const data = { user: { id: 1, name: 'John' } };

    const result = renderToString(App, {
      context: { url: '/', data },
      serializeState: true,
    });

    expect(result.state).toContain('__PULSAR_STATE__');
    expect(result.state).toContain('John');
  });

  it('should apply wrapper function', () => {
    const App = () => h('div', null, 'Content');
    const wrapper = (html: string) => `<main>${html}</main>`;

    const result = renderToString(App, { wrapper });

    expect(result.html).toBe('<main><div>Content</div></main>');
  });

  it('should handle numbers', () => {
    const App = () => h('div', null, 42, ' items');
    const result = renderToString(App);

    expect(result.html).toBe('<div>42 items</div>');
  });

  it('should handle functions (signals)', () => {
    const App = () => {
      const value = () => 'Dynamic Value';
      return h('div', null, value);
    };

    const result = renderToString(App);

    expect(result.html).toBe('<div>Dynamic Value</div>');
  });
});
