// Export constructor
export { Effect } from './effect';

// Export types
export { SEffect } from './effect.types';
export type { IEffect } from './effect.types';

// Export factory (legacy)
export { createEffect } from './create-effect';

// Export new effect with owner tracking
export { createEffectWithOwner } from './create-effect-with-owner';

// Export context utilities
export { getCurrentEffect, popEffect, pushEffect, setCurrentEffect } from './effect-context';

// Export prototype methods
export { addDependency } from './prototype/add-dependency';
export { cleanup } from './prototype/cleanup';
export { dispose } from './prototype/dispose';
export { execute } from './prototype/execute';
