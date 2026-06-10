import { useState, useEffect } from 'react';

/**
 * Returns true when the browser tab is visible, false when hidden.
 * Uses the Page Visibility API (document.visibilityState).
 * Safe to call from multiple components — each gets its own listener,
 * but they all fire from the same underlying DOM event.
 */
export function usePageVisibility(): boolean {
  const [isVisible, setIsVisible] = useState(() => !document.hidden);

  useEffect(() => {
    const handler = () => setIsVisible(!document.hidden);
    document.addEventListener('visibilitychange', handler);
    return () => document.removeEventListener('visibilitychange', handler);
  }, []);

  return isVisible;
}
