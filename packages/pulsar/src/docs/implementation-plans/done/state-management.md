# State Management Patterns Implementation Plan

**Target:** v0.3.0  
**Priority:** Medium  
**Current State:** Signals only (30%)

---

## Implementation Rules

1. **Built on Signals** - Use existing reactive primitives
2. **Type-Safe** - Full TypeScript inference
3. **DevTools Integration** - Visualize state machines
4. **Zero Dependencies** - Pure Pulsar implementation
5. **Opt-In** - Don't force patterns on users

---

## File Structure

```
packages/pulsar/src/state/
├── index.ts                          # Public API
├── fsm/
│   ├── create-state-machine.ts      # FSM factory
│   ├── state-machine.ts             # FSM implementation
│   ├── state-machine.types.ts       # FSM types
│   ├── transition-validator.ts      # Validate transitions
│   └── fsm.test.ts                  # FSM tests
├── event-sourcing/
│   ├── create-event-store.ts        # Event store factory
│   ├── event-store.ts               # Event store implementation
│   ├── event.types.ts               # Event types
│   ├── projection.ts                # Event projections
│   └── event-store.test.ts          # Event store tests
├── time-travel/
│   ├── history-manager.ts           # Manage state history
│   ├── snapshot.ts                  # State snapshots
│   └── replay.ts                    # Replay state changes
└── devtools/
    ├── fsm-visualizer.ts            # FSM visualization
    └── event-inspector.ts           # Event inspection
```

---

## Core Features

### 1. Finite State Machines

```typescript
const authMachine = createStateMachine({
  initial: 'loggedOut',
  states: {
    loggedOut: { on: { LOGIN: 'loading' } },
    loading: { on: { SUCCESS: 'loggedIn', ERROR: 'loggedOut' } },
    loggedIn: { on: { LOGOUT: 'loggedOut' } },
  },
});
```

### 2. Event Sourcing

```typescript
const store = createEventStore({
  events: [UserCreated, UserUpdated, UserDeleted],
  projections: [UserListProjection, UserStatsProjection],
});
store.dispatch(new UserCreated({ id: 1, name: 'Alice' }));
```

### 3. Time Travel

```typescript
const history = useHistory();
history.undo(); // Go back one state
history.redo(); // Go forward one state
history.replay(5); // Replay from snapshot 5
```

---

## Acceptance Criteria

- [ ] `createStateMachine()` with type-safe transitions
- [ ] FSM guards and actions
- [ ] FSM state visualization in console
- [ ] `createEventStore()` with event replay
- [ ] Event projections for derived state
- [ ] Time-travel debugging API
- [ ] State snapshots every N changes
- [ ] Undo/redo functionality
- [ ] Replay from any point
- [ ] DevTools integration (future)
- [ ] Test coverage >85%
- [ ] Documentation with examples
- [ ] Performance: <5ms per state change

---

## GitHub Agent

See: `.github/agents/state-management-agent.md`
