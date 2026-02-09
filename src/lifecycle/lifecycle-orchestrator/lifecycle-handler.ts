import type { ILifecycleContext, ILifecycleHandler } from './lifecycle-orchestrator.types'

/**
 * Base LifecycleHandler constructor (prototype-based class)
 * Implements Chain of Responsibility pattern
 */
export const LifecycleHandler = function (
  this: ILifecycleHandler,
  name: string,
  canHandleFn: (ctx: ILifecycleContext) => boolean,
  handleFn: (ctx: ILifecycleContext) => Promise<void> | void
) {
  this.name = name
  this.canHandle = canHandleFn

  // Store the original handle function
  const originalHandleFn = handleFn

  // Wrap handle function to add chain continuation logic
  this.handle = async function (context: ILifecycleContext) {
    if (this.canHandle(context)) {
      try {
        console.log(`[Lifecycle] ${this.name} handling ${context.phase}`)
        await originalHandleFn.call(this, context)
        console.log(`[Lifecycle] ${this.name} complete`)
      } catch (error) {
        console.error(`[Lifecycle] ${this.name} failed:`, error)
        context.error = error as Error
        throw error
      }
    }

    // Continue chain
    if (this.next) {
      await this.next.handle(context)
    }
  }

  this.setNext = function (handler: ILifecycleHandler) {
    if (!this.next) {
      this.next = handler
    } else {
      this.next.setNext(handler)
    }
  }
} as unknown as {
  new (
    name: string,
    canHandle: (ctx: ILifecycleContext) => boolean,
    handle: (ctx: ILifecycleContext) => Promise<void> | void
  ): ILifecycleHandler
}
