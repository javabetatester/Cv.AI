import { useState, useEffect } from 'react';

export const useTypingEffect = (text: string, speed: number = 30, delay: number = 0) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!text) {
      setDisplayedText('');
      setIsComplete(false);
      setCurrentIndex(0);
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
          
          setDisplayedText(text.substring(0, prevIndex + 1));
          return prevIndex + 1;
        });
      }, speed);

      return () => clearInterval(timer);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [text, speed, delay]);

  return { displayedText, isComplete };
};