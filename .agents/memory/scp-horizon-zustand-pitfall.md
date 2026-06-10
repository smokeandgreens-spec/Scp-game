---
name: SCP Horizon Zustand selector infinite re-render pitfall
description: Calling store functions that return new object references inside Zustand selectors causes infinite re-renders in React 18
---

## The rule
**Never call a Zustand store method that creates a new object/array reference inside a `useGameStore(s => ...)` selector.**

## Bad pattern (infinite loop)
```typescript
const saves = useGameStore(s => s.getSaveSlots()); // BAD — new array ref every call
```

## Safe patterns

Option 1 — `useMemo` with stable function reference:
```typescript
const getSaveSlots = useGameStore(s => s.getSaveSlots); // stable fn ref
const saves = useMemo(() => getSaveSlots(), []);
```

Option 2 — `useState` with lazy initializer (for initial render only):
```typescript
const [saves, setSaves] = useState(() => useGameStore.getState().getSaveSlots());
```

Option 3 — Call `getState()` directly (outside render, e.g. in event handlers):
```typescript
const saves = useGameStore.getState().getSaveSlots();
```

## Why
`useGameStore` uses `useSyncExternalStore` internally (React 18). When the selector returns a new reference every time it runs, React 18 strict mode detects "state changed" and schedules another render → infinite loop. Error message: "The result of getSnapshot should be cached to avoid an infinite loop."

## How to apply
Any Zustand store method that reads from localStorage and returns a new array/object must not be used directly as a selector. Apply the `useMemo` pattern for UI display use cases.
