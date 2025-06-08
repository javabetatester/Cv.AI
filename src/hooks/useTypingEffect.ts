import { useState, useEffect } from 'react';

export const useTypingEffect = (text: string, speed: number = 30, delay: number = 0) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Reset states when text changes
    setDisplayedText('');
    setIsComplete(false);
    setCurrentIndex(0);

    // Safety check for text
    if (!text || typeof text !== 'string') {
      setDisplayedText('');
      setIsComplete(true);
      return;
    }

    const startTimeout = setTimeout(() => {
      const timer = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          if (prevIndex >= text.length) {
            setIsComplete(true);
            clearInterval(timer);
            return prevIndex;
          }
          
          const newText = text.substring(0, prevIndex + 1);
          setDisplayedText(newText);
          return prevIndex + 1;
        });
      }, speed);

      return () => clearInterval(timer);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [text, speed, delay]);

  return { displayedText, isComplete };
};