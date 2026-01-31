/**
 * Vitest Global Setup
 * Ensures proper initialization and cleanup of Pulsar framework between tests
 */

import { afterEach, beforeEach } from 'vitest';
import { disposePulsar, initPulsar } from '../src/bootstrap/init-pulsar';
import { $REGISTRY } from '../src/registry/core';

/**
 * Initialize Pulsar before each test
 * Ensures clean state and proper watcher setup
 */
beforeEach(() => {
  // Initialize Pulsar first (starts MutationObserver if not already started)
  initPulsar();

  // Then reset registry state for clean test
  $REGISTRY.reset();
});

/**
 * Clean up Pulsar after each test
 * Resets registry and disposes MutationObserver to prevent hanging
 */
afterEach(() => {
  // Reset registry state first
  $REGISTRY.reset();

  // Then dispose Pulsar (disconnects MutationObserver)
  disposePulsar();
});
