/**
 * Query Utilities
 * DOM querying utilities with accessibility support
 */

import type { IAccessibilityQueries, IQueryOptions } from './testing.types';

/**
 * Creates query functions for a container
 */
export function createQueries(container: HTMLElement): IAccessibilityQueries {
  const matchText = (element: HTMLElement, text: string | RegExp): boolean => {
    const content = element.textContent || '';
    if (typeof text === 'string') {
      return content.includes(text);
    }
    return text.test(content);
  };

  // Role queries
  const getByRole = (role: string, options?: IQueryOptions): HTMLElement => {
    const elements = getAllByRole(role, options);
    if (elements.length === 0) {
      throw new Error(`Unable to find element with role: ${role}`);
    }
    if (elements.length > 1) {
      throw new Error(`Found multiple elements with role: ${role}`);
    }
    return elements[0];
  };

  const getAllByRole = (role: string, options?: IQueryOptions): HTMLElement[] => {
    const selector = options?.selector || `[role="${role}"]`;
    const elements = Array.from(container.querySelectorAll<HTMLElement>(selector));

    // Also check implicit roles
    const implicitRoles: Record<string, string> = {
      button: 'button',
      link: 'a',
      heading: 'h1, h2, h3, h4, h5, h6',
      textbox: 'input[type="text"], textarea',
      checkbox: 'input[type="checkbox"]',
      radio: 'input[type="radio"]',
      img: 'img',
      list: 'ul, ol',
      listitem: 'li',
      navigation: 'nav',
      main: 'main',
      article: 'article',
      section: 'section',
      form: 'form',
    };

    if (implicitRoles[role]) {
      const implicitElements = Array.from(
        container.querySelectorAll<HTMLElement>(implicitRoles[role])
      );
      elements.push(...implicitElements);
    }

    return [...new Set(elements)]; // Remove duplicates
  };

  const queryByRole = (role: string, options?: IQueryOptions): HTMLElement | null => {
    try {
      return getByRole(role, options);
    } catch {
      return null;
    }
  };

  const queryAllByRole = (role: string, options?: IQueryOptions): HTMLElement[] => {
    return getAllByRole(role, options);
  };

  // Label text queries
  const getByLabelText = (text: string | RegExp, options?: IQueryOptions): HTMLElement => {
    const elements = getAllByLabelText(text, options);
    if (elements.length === 0) {
      throw new Error(`Unable to find element with label text: ${text}`);
    }
    if (elements.length > 1) {
      throw new Error(`Found multiple elements with label text: ${text}`);
    }
    return elements[0];
  };

  const getAllByLabelText = (text: string | RegExp, options?: IQueryOptions): HTMLElement[] => {
    const labels = Array.from(container.querySelectorAll<HTMLLabelElement>('label'));
    const matchingLabels = labels.filter((label) => matchText(label, text));

    return matchingLabels
      .map((label) => {
        if (label.htmlFor) {
          const element = container.querySelector<HTMLElement>(`#${label.htmlFor}`);
          if (element) return element;
        }

        // Check for nested input
        const input = label.querySelector<HTMLElement>('input, textarea, select');
        if (input) return input;

        return label;
      })
      .filter((el): el is HTMLElement => el !== null);
  };

  const queryByLabelText = (text: string | RegExp, options?: IQueryOptions): HTMLElement | null => {
    try {
      return getByLabelText(text, options);
    } catch {
      return null;
    }
  };

  const queryAllByLabelText = (text: string | RegExp, options?: IQueryOptions): HTMLElement[] => {
    return getAllByLabelText(text, options);
  };

  // Text queries
  const getByText = (text: string | RegExp, options?: IQueryOptions): HTMLElement => {
    const elements = getAllByText(text, options);
    if (elements.length === 0) {
      throw new Error(`Unable to find element with text: ${text}`);
    }
    if (elements.length > 1) {
      throw new Error(`Found multiple elements with text: ${text}`);
    }
    return elements[0];
  };

  const getAllByText = (text: string | RegExp, options?: IQueryOptions): HTMLElement[] => {
    const selector = options?.selector || '*';
    const elements = Array.from(container.querySelectorAll<HTMLElement>(selector));

    if (options?.exact) {
      return elements.filter((el) => {
        const content = el.textContent || '';
        return typeof text === 'string' ? content === text : text.test(content);
      });
    }

    return elements.filter((el) => matchText(el, text));
  };

  const queryByText = (text: string | RegExp, options?: IQueryOptions): HTMLElement | null => {
    try {
      return getByText(text, options);
    } catch {
      return null;
    }
  };

  const queryAllByText = (text: string | RegExp, options?: IQueryOptions): HTMLElement[] => {
    return getAllByText(text, options);
  };

  // Test ID queries
  const getByTestId = (testId: string, options?: IQueryOptions): HTMLElement => {
    const elements = getAllByTestId(testId, options);
    if (elements.length === 0) {
      throw new Error(`Unable to find element with testId: ${testId}`);
    }
    if (elements.length > 1) {
      throw new Error(`Found multiple elements with testId: ${testId}`);
    }
    return elements[0];
  };

  const getAllByTestId = (testId: string, options?: IQueryOptions): HTMLElement[] => {
    return Array.from(container.querySelectorAll<HTMLElement>(`[data-testid="${testId}"]`));
  };

  const queryByTestId = (testId: string, options?: IQueryOptions): HTMLElement | null => {
    try {
      return getByTestId(testId, options);
    } catch {
      return null;
    }
  };

  const queryAllByTestId = (testId: string, options?: IQueryOptions): HTMLElement[] => {
    return getAllByTestId(testId, options);
  };

  return {
    getByRole,
    getAllByRole,
    queryByRole,
    queryAllByRole,
    getByLabelText,
    getAllByLabelText,
    queryByLabelText,
    queryAllByLabelText,
    getByText,
    getAllByText,
    queryByText,
    queryAllByText,
    getByTestId,
    getAllByTestId,
    queryByTestId,
    queryAllByTestId,
  };
}

/**
 * Global queries on document.body
 */
export const screen = createQueries(document.body);
