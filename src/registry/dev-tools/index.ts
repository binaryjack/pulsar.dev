/**
 * Registry Dev Tools
 * Barrel export for registry and event inspectors
 */

// Registry Inspector
export { RegistryInspector } from './registry-inspector';
export type {
  IElementDetails,
  IElementTreeNode,
  IRegistryInspector,
  IRegistryStats,
  ISearchQuery,
} from './registry-inspector.types';

// Event Inspector
export {
  EventInspector,
  type IDelegationStats,
  type IEventInspector,
  type IHandlerInfo,
} from './event-inspector';

// Performance Monitor
export {
  PerformanceMonitor,
  type IHistoryQuery,
  type IMemoryMetrics,
  type IPerformanceMeasurement,
  type IPerformanceMetrics,
  type IPerformanceMonitor,
  type OperationType,
} from './performance-monitor';
