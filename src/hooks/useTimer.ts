import { useState, useEffect, useCallback } from 'react';

export function useTimer(initialTime: number, onTimeout: () => void) {
  const [timeLeft, setTimeLeft] = useState<number>(initialTime);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [hasTimedOut, setHasTimedOut] = useState<boolean>(false);

  const tick = useCallback(() => {
    setTimeLeft((prev) => {
      const newTime = Math.max(0, prev - 0.1);
      if (newTime <= 0) {
        setHasTimedOut(true);
        setIsRunning(false);
        onTimeout();
        return 0;
      }
      return newTime;
    });
  }, [onTimeout]);

  useEffect(() => {
    let timer: number;
    if (isRunning && timeLeft > 0) {
      timer = window.setInterval(tick, 100);
    }
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isRunning, timeLeft, tick]);

  const startTimer = useCallback(() => {
    setTimeLeft(initialTime);
    setIsRunning(true);
    setHasTimedOut(false);
  }, [initialTime]);

  const stopTimer = useCallback(() => {
    setIsRunning(false);
  }, []);

  return {
    timeLeft,
    isRunning,
    hasTimedOut,
    startTimer,
    stopTimer
  };
}