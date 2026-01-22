/**
 * Store type definitions
 */

export interface IStore<T> {
  (): T;
  getState(): T;
  dispatch(action: IStoreAction): void;
  subscribe(listener: IStoreSubscriber<T>): () => void;
  select<R>(selector: (state: T) => R): () => R;
}

export interface IStoreInternal<T> extends IStore<T> {
  state: T;
  reducer: IStoreReducer<T>;
  middleware?: IStoreMiddleware<T>[];
  subscribers: Set<IStoreSubscriber<T>>;
  devtools?: {
    send: (action: IStoreAction, state: T) => void;
    init: (state: T) => void;
  };
}

export interface IStoreAction {
  type: string;
  payload?: unknown;
}

export interface IStoreReducer<T> {
  (state: T, action: IStoreAction): T;
}

export interface IStoreSubscriber<T> {
  (state: T): void;
}

export interface IStoreMiddleware<T> {
  (store: IStoreApi<T>): (next: IStoreDispatch) => (action: IStoreAction) => void;
}

export interface IStoreApi<T> {
  getState(): T;
  dispatch(action: IStoreAction): void;
}

export interface IStoreDispatch {
  (action: IStoreAction): void;
}

export interface IStoreOptions {
  name?: string;
  devtools?: boolean;
  trace?: boolean;
  traceLimit?: number;
}

export type SStore<T> = {
  new (
    initialState: T,
    reducer: IStoreReducer<T>,
    middleware?: IStoreMiddleware<T>[],
    options?: IStoreOptions
  ): IStoreInternal<T>;
};
