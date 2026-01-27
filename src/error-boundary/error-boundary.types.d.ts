/**
 * Error Boundary Types
 *
 * Context-based error catching system for graceful error handling
 * in component trees. Prevents errors from crashing entire application.
 */
/**
 * Error boundary state
 */
export type ErrorBoundaryState = 'idle' | 'error';
/**
 * Error information captured by boundary
 */
export interface IErrorInfo {
    /**
     * The caught error
     */
    error: Error;
    /**
     * Component where error occurred (if available)
     */
    componentName?: string;
    /**
     * Timestamp when error was caught
     */
    timestamp: number;
    /**
     * Additional context about the error
     */
    context?: Record<string, unknown>;
}
/**
 * Error boundary configuration options
 */
export interface IErrorBoundaryOptions {
    /**
     * Fallback UI to show when error occurs
     */
    fallback?: (errorInfo: IErrorInfo) => HTMLElement;
    /**
     * Callback when error is caught
     */
    onError?: (errorInfo: IErrorInfo) => void;
    /**
     * Callback when error is reset/recovered
     */
    onReset?: () => void;
    /**
     * Whether to log errors to console in development
     */
    logErrors?: boolean;
    /**
     * Propagate error to parent boundary (default: false)
     */
    propagate?: boolean;
}
/**
 * Error boundary context interface
 * Manages error state and provides recovery mechanisms
 */
export interface IErrorBoundaryContext {
    /**
     * Current error state
     */
    readonly state: ErrorBoundaryState;
    /**
     * Current error info (null if no error)
     */
    readonly errorInfo: IErrorInfo | null;
    /**
     * Whether boundary has caught an error
     */
    readonly hasError: boolean;
    /**
     * Catch and handle an error
     */
    catchError(error: Error, componentName?: string, context?: Record<string, unknown>): void;
    /**
     * Reset error state and attempt recovery
     */
    reset(): void;
    /**
     * Re-throw error to parent boundary
     */
    propagate(): void;
}
/**
 * Internal error boundary context with private state
 */
export interface IErrorBoundaryContextInternal extends IErrorBoundaryContext {
    /**
     * Options configuration
     */
    readonly options: Required<IErrorBoundaryOptions>;
    /**
     * Internal state holder
     */
    _state: ErrorBoundaryState;
    /**
     * Internal error info holder
     */
    _errorInfo: IErrorInfo | null;
    /**
     * Parent error boundary (for propagation)
     */
    _parent: IErrorBoundaryContext | null;
    /**
     * Children elements to restore on reset
     */
    _originalChildren: HTMLElement[];
    /**
     * Error fallback element currently shown
     */
    _fallbackElement: HTMLElement | null;
}
/**
 * Props for Tryer component (error boundary wrapper)
 */
export interface ITryerProps {
    /**
     * Children to render and protect
     */
    children: HTMLElement | HTMLElement[];
    /**
     * Error boundary configuration
     */
    options?: IErrorBoundaryOptions;
}
/**
 * Props for Catcher component (error renderer)
 */
export interface ICatcherProps {
    /**
     * Custom error renderer (optional)
     */
    render?: (errorInfo: IErrorInfo) => HTMLElement;
    /**
     * Fallback content to render when an error occurs
     * Can be a function that receives the error or static content
     */
    fallback?: ((error: Error) => HTMLElement | DocumentFragment | string | number) | HTMLElement | DocumentFragment | string | number;
    /**
     * Children to render when no error
     */
    children?: HTMLElement | DocumentFragment | string | number | Array<HTMLElement | string | number>;
    /**
     * Show retry button (default: true)
     */
    showRetry?: boolean;
}
