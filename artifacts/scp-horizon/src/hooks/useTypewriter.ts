import { useState, useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '../store/gameStore';

export function useTypewriter(text: string, onComplete?: () => void) {
  const speedSetting = useGameStore((s) => s.settings.textSpeed);
  const [displayedText, setDisplayedText] = useState('');
  const [isDone, setIsDone] = useState(false);
  const indexRef = useRef(0);
  const textRef = useRef(text);

  const getSpeed = () => {
    switch (speedSetting) {
      case 'slow': return 80;
      case 'medium': return 40;
      case 'fast': return 15;
      case 'instant': return 0;
      default: return 40;
    }
  };

  useEffect(() => {
    textRef.current = text;
    setDisplayedText('');
    setIsDone(false);
    indexRef.current = 0;

    const speed = getSpeed();
    if (speed === 0 || text === '') {
      setDisplayedText(text);
      setIsDone(true);
      onComplete?.();
      return;
    }

    const interval = setInterval(() => {
      setDisplayedText((prev) => {
        const nextChar = textRef.current[indexRef.current];
        indexRef.current += 1;
        
        if (indexRef.current >= textRef.current.length) {
          clearInterval(interval);
          setIsDone(true);
          onComplete?.();
          return textRef.current;
        }
        return prev + nextChar;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [text, speedSetting]);

  const skip = useCallback(() => {
    setDisplayedText(textRef.current);
    setIsDone(true);
    onComplete?.();
  }, [onComplete]);

  return { displayedText, isDone, skip };
}