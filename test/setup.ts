/**
 * Vitest Global Setup
 * Minimal global setup - individual tests should manage their own state
 */

import { afterAll, beforeAll } from 'vitest';
import { disposePulsar, initPulsar } from '../src/bootstrap/init-pulsar';

/**
 * Initialize Pulsar once before all tests
 */
beforeAll(() => {
  initPulsar();
});

/**
 * Clean up Pulsar once after all tests complete
 */
afterAll(() => {
  disposePulsar();
});
