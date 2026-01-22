import { DEV } from './dev.types'

/**
 * Track component lifecycles in development
 */
interface IComponentTrace {
  name: string
  mountTime: number
  updateCount: number
}

const componentTraces = new Map<string, IComponentTrace>()

/**
 * Start tracking a component
 */
export function traceComponentMount(name: string): void {
  if (!DEV) return
  
  componentTraces.set(name, {
    name,
    mountTime: performance.now(),
    updateCount: 0
  })
  
  console.log(`[pulsar Trace] Mounted: ${name}`)
}

/**
 * Track component update
 */
export function traceComponentUpdate(name: string): void {
  if (!DEV) return
  
  const trace = componentTraces.get(name)
  if (trace) {
    trace.updateCount++
    console.log(`[pulsar Trace] Updated: ${name} (${trace.updateCount} updates)`)
  }
}

/**
 * Stop tracking and report stats
 */
export function traceComponentUnmount(name: string): void {
  if (!DEV) return
  
  const trace = componentTraces.get(name)
  if (trace) {
    const lifetime = performance.now() - trace.mountTime
    console.log(
      `[pulsar Trace] Unmounted: ${name}`,
      `\n  Lifetime: ${lifetime.toFixed(2)}ms`,
      `\n  Updates: ${trace.updateCount}`
    )
    componentTraces.delete(name)
  }
}

/**
 * Get all active component traces
 */
export function getComponentTraces(): ReadonlyMap<string, Readonly<IComponentTrace>> {
  if (!DEV) return new Map()
  return componentTraces
}

/**
 * Warn about excessive updates
 */
export function checkExcessiveUpdates(name: string, threshold = 100): void {
  if (!DEV) return
  
  const trace = componentTraces.get(name)
  if (trace && trace.updateCount > threshold) {
    console.warn(
      `[pulsar] Component "${name}" has updated ${trace.updateCount} times.`,
      '\nThis may indicate unnecessary re-renders.',
      '\nConsider using memo() or checking your dependencies.'
    )
  }
}
