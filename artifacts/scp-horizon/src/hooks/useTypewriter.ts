import { useState, useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '../store/gameStore';
import { usePageVisibility } from './usePageVisibility';

/**
 * Typewriter effect hook.
 *
 * Design invariants (must be preserved by future edits):
 *
 * 1. Index as plain React state — never mutated inside a state updater.
 *    React 18 Concurrent Mode replays updater functions; mutation there
 *    causes index jumps and premature completion.
 *
 * 2. One character per setTimeout (not setInterval). clearTimeout in the
 *    effect cleanup is always reliable; there is never more than one
 *    pending timer at a time.
 *
 * 3. `onComplete` lives in a ref so the latest version is always called
 *    without listing it as an effect dependency (which would restart
 *    typing on every parent re-render).
 *
 * 4. `firedRef` ensures `onComplete` fires exactly once per text value
 *    even when StrictMode mounts → unmounts → remounts.
 *
 * 5. `isPageVisible` is an effect dependency. When the tab is hidden the
 *    effect returns early (no timer scheduled). When the tab returns the
 *    effect re-runs with the unchanged `index` and resumes exactly where
 *    it stopped — the existing clearTimeout cleanup handles the rest.
 */
export function useTypewriter(text: string, onComplete?: () => void) {
  const speedSetting = useGameStore((s) => s.settings.textSpeed);
  const isPageVisible = usePageVisibility();

  const [index, setIndex] = useState(0);
  const [isDone, setIsDone] = useState(false);

  const onCompleteRef = useRef(onComplete);
  const firedRef = useRef(false);

  // Keep callback ref current without re-running any effect
  useEffect(() => {
    onCompleteRef.current = onComplete;
  });

  // Reset state whenever the text or speed changes
  useEffect(() => {
    setIndex(0);
    setIsDone(false);
    firedRef.current = false;
  }, [text, speedSetting]);

  // Advance one character per tick — pauses automatically when tab is hidden
  useEffect(() => {
    if (isDone || !isPageVisible) return;

    const msPerChar =
      speedSetting === 'slow'   ? 80 :
      speedSetting === 'medium' ? 40 :
      speedSetting === 'fast'   ? 15 : 0;

    if (msPerChar === 0 || text === '') {
      setIndex(text.length);
      setIsDone(true);
      return;
    }

    if (index >= text.length) {
      setIsDone(true);
      return;
    }

    const timer = setTimeout(() => {
      setIndex((i) => i + 1);
    }, msPerChar);

    return () => clearTimeout(timer);
  }, [index, isDone, text, speedSetting, isPageVisible]);

  // Call onComplete exactly once when the text finishes
  useEffect(() => {
    if (!isDone || firedRef.current) return;
    firedRef.current = true;
    onCompleteRef.current?.();
  }, [isDone]);

  const skip = useCallback(() => {
    setIndex(text.length);
    setIsDone(true);
  }, [text.length]);

  return {
    displayedText: text.slice(0, index),
    isDone,
    skip,
  };
}
