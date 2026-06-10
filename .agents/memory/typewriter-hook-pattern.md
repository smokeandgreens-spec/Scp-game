---
name: Typewriter hook — safe React 18 pattern
description: The correct pattern for useTypewriter that survives Concurrent Mode, StrictMode double-invocation, and effect replays.
---

## The rule
The `useTypewriter` hook must never mutate a ref or call side effects (setState, clearInterval, callbacks) inside a React state updater function.

**Why:** React 18 Concurrent Mode can replay state updater functions. StrictMode (always active in development) explicitly double-invokes updaters to detect impurity. Mutating `indexRef.current` inside `setDisplayedText((prev) => { indexRef.current++; ... })` means the index increments twice per tick — characters get skipped and `onComplete` fires multiple times, advancing `currentParagraphIndex` by 2 and leaving the next paragraph's NarrativeParagraph rendering with no text.

## The correct pattern (as implemented in `src/hooks/useTypewriter.ts`)

1. **Index as state, not ref.** Use `const [index, setIndex] = useState(0)`. Advance with `setTimeout(() => setIndex(i => i + 1), msPerChar)` — one timer per character, cleaned up by returning `clearTimeout` from the effect.

2. **No side effects in updaters.** The `setIndex(i => i + 1)` updater is pure. Completion is detected in a *separate* `useEffect([isDone])`.

3. **onComplete fires exactly once.** Use `firedRef.current` (a boolean ref) as a guard. Reset it in the `[text, speedSetting]` reset effect. The completion effect checks `if (!isDone || firedRef.current) return; firedRef.current = true; onCompleteRef.current?.()`.

4. **onComplete ref pattern.** Store `onComplete` in a ref updated via `useEffect()` (no deps) so the latest callback is always called without adding it to effect dependency arrays — which would restart typing on every parent re-render.

5. **skip() is pure.** `const skip = useCallback(() => { setIndex(text.length); setIsDone(true); }, [text.length])` — no direct `onComplete` call; the completion effect fires naturally.

5. **Tab-pause via `isPageVisible`.** The hook imports `usePageVisibility` and adds `isPageVisible` to the typing effect's dependency array. When the tab hides: effect cleanup fires `clearTimeout`, timer stops. When tab returns: effect re-runs with the same `index`, resumes exactly where it stopped. No extra state needed.

## How to apply
Any future edit to `useTypewriter.ts` must preserve these invariants. If the implementation needs to change (e.g. variable speed, pause/resume), keep all side effects OUTSIDE of state updater functions and keep the single-`firedRef` guard for `onComplete`.
