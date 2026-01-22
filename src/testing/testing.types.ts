/**
 * Testing Utilities - Core Types
 * Type definitions for testing framework
 */

export interface IRenderResult<T = any> {
  container: HTMLElement;
  unmount: () => void;
  rerender: (props?: Partial<T>) => void;
  debug: () => void;
}

export interface IRenderOptions<T = any> {
  props?: T;
  wrapper?: (children: any) => any;
  container?: HTMLElement;
}

export interface IWaitForOptions {
  timeout?: number;
  interval?: number;
  onTimeout?: (error: Error) => void;
}

export interface IFireEventOptions {
  bubbles?: boolean;
  cancelable?: boolean;
  composed?: boolean;
}

export interface IMockService<T = any> {
  instance: T;
  restore: () => void;
}

export interface IMockRouterOptions {
  initialPath?: string;
  routes?: any[];
}

export interface IQueryOptions {
  exact?: boolean;
  selector?: string;
  timeout?: number;
}

export interface IAccessibilityQueries {
  getByRole: (role: string, options?: IQueryOptions) => HTMLElement;
  getAllByRole: (role: string, options?: IQueryOptions) => HTMLElement[];
  queryByRole: (role: string, options?: IQueryOptions) => HTMLElement | null;
  queryAllByRole: (role: string, options?: IQueryOptions) => HTMLElement[];

  getByLabelText: (text: string | RegExp, options?: IQueryOptions) => HTMLElement;
  getAllByLabelText: (text: string | RegExp, options?: IQueryOptions) => HTMLElement[];
  queryByLabelText: (text: string | RegExp, options?: IQueryOptions) => HTMLElement | null;
  queryAllByLabelText: (text: string | RegExp, options?: IQueryOptions) => HTMLElement[];

  getByText: (text: string | RegExp, options?: IQueryOptions) => HTMLElement;
  getAllByText: (text: string | RegExp, options?: IQueryOptions) => HTMLElement[];
  queryByText: (text: string | RegExp, options?: IQueryOptions) => HTMLElement | null;
  queryAllByText: (text: string | RegExp, options?: IQueryOptions) => HTMLElement[];

  getByTestId: (testId: string, options?: IQueryOptions) => HTMLElement;
  getAllByTestId: (testId: string, options?: IQueryOptions) => HTMLElement[];
  queryByTestId: (testId: string, options?: IQueryOptions) => HTMLElement | null;
  queryAllByTestId: (testId: string, options?: IQueryOptions) => HTMLElement[];
}

export type TCleanupFunction = () => void;
