import { useState, useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '../store/gameStore';

/**
 * Typewriter effect hook.
 *
 * Design invariants that keep this bug-free across React 18 Concurrent Mode
 * and StrictMode (which double-invokes effects in development):
 *
 * 1. The typing index is plain React state — never mutated inside a state
 *    updater.  React may replay updater functions; mutation there causes
 *    index jumps and premature completion.
 *
 * 2. One character advances per setTimeout (not setInterval) so cleanup
 *    via clearTimeout is always reliable — there's never more than one
 *    pending timer.
 *
 * 3. `onComplete` is stored in a ref so the latest version is always called
 *    without listing it as a dependency (which would restart typing on
 *    every parent re-render).
 *
 * 4. `firedRef` ensures `onComplete` fires exactly once per text value even
 *    if StrictMode mounts/unmounts/remounts and the isDone effect re-fires.
 */
export function useTypewriter(text: string, onComplete?: () => void) {
  const speedSetting = useGameStore((s) => s.settings.textSpeed);
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

  // Advance one character per tick via setTimeout
  useEffect(() => {
    if (isDone) return;

    const msPerChar =
      speedSetting === 'slow'    ? 80  :
      speedSetting === 'medium'  ? 40  :
      speedSetting === 'fast'    ? 15  : 0;

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
  }, [index, isDone, text, speedSetting]);

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
