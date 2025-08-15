'use client';

import { useState, useEffect, useRef } from 'react';

export function useTypewriter(text: string, speed = 15, onComplete?: () => void) {
  const [displayedText, setDisplayedText] = useState('');
  const indexRef = useRef(0);

  useEffect(() => {
    if (!text) {
      setDisplayedText('');
      indexRef.current = 0;
      return;
    }

    indexRef.current = 0;
    setDisplayedText('');

    const intervalId = setInterval(() => {
      if (indexRef.current < text.length) {
        setDisplayedText(prev => prev + text.charAt(indexRef.current));
        indexRef.current++;
      } else {
        clearInterval(intervalId);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(intervalId);
  }, [text, speed]);

  return displayedText;
}