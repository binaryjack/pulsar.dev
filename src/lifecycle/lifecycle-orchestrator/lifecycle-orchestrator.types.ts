import type { IApplicationRootInternal } from '../../bootstrap/application-root-internal.interface';

/**
 * Lifecycle orchestration phases for ApplicationRoot mount/unmount
 */
export enum LifecyclePhase {
  // Unmount phases
  PRE_UNMOUNT = 'pre-unmount',
  UNMOUNT_REGISTRY = 'unmount-registry',
  UNMOUNT_WIRES = 'unmount-wires',
  UNMOUNT_DOM = 'unmount-dom',
  POST_UNMOUNT = 'post-unmount',

  // Mount phases
  PRE_MOUNT = 'pre-mount',
  MOUNT_DOM = 'mount-dom',
  MOUNT_WIRES = 'mount-wires',
  MOUNT_LIFECYCLE = 'mount-lifecycle',
  POST_MOUNT = 'post-mount',

  // Special phases
  HMR_SWAP = 'hmr-swap',
}

/**
 * Context passed through the handler chain
 */
export interface ILifecycleContext {
  /** Current lifecycle phase */
  phase: LifecyclePhase;

  /** ApplicationRoot instance */
  appRoot: IApplicationRootInternal;

  /** Component being mounted (if applicable) */
  component?: HTMLElement;

  /** Error if any handler failed */
  error?: Error;

  /** Arbitrary metadata for handlers to share data */
  metadata: Record<string, any>;

  /** Timestamp when context was created */
  timestamp: number;
}

/**
 * Handler in the Chain of Responsibility
 */
export interface ILifecycleHandler {
  /** Handler name for debugging */
  name: string;

  /** Determines if this handler should process the context */
  canHandle: (context: ILifecycleContext) => boolean;

  /** Process the context and continue chain */
  handle: (context: ILifecycleContext) => Promise<void> | void;

  /** Set the next handler in the chain */
  setNext: (handler: ILifecycleHandler) => void;

  /** Next handler in the chain */
  next?: ILifecycleHandler;
}

/**
 * Lifecycle orchestrator manages the handler chain
 */
export interface ILifecycleOrchestrator {
  /** ApplicationRoot instance */
  readonly appRoot: IApplicationRootInternal;

  /** Head of handler chain */
  handlers: ILifecycleHandler | null;

  /** Currently executing phase (for debugging) */
  pendingPhase: LifecyclePhase | null;

  /** Flag indicating if any operation is in progress */
  isOperationInProgress: boolean;

  /** Register a handler in the chain */
  registerHandler: (handler: ILifecycleHandler) => void;

  /** Execute the handler chain for a lifecycle context */
  handle: (context: ILifecycleContext) => Promise<void>;

  /** Wait for any pending operation to complete */
  waitForCompletion: () => Promise<void>;

  /** Reset the orchestrator (clear handlers) */
  reset: () => void;
}
