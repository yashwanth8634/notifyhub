import { useState, useEffect } from 'react';
import { differenceInSeconds } from 'date-fns';

export function CountdownTimer({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState(() => {
    return Math.max(0, differenceInSeconds(new Date(targetDate), new Date()));
  });

  useEffect(() => {
    if (timeLeft <= 0) return;

    const intervalId = setInterval(() => {
      const remaining = Math.max(0, differenceInSeconds(new Date(targetDate), new Date()));
      setTimeLeft(remaining);
      
      if (remaining <= 0) {
        clearInterval(intervalId);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [targetDate, timeLeft]);

  if (timeLeft <= 0) {
    return <span className="font-bold">Expired</span>;
  }

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  return (
    <span className="font-mono font-bold tracking-wider">
      {String(hours).padStart(2, '0')}:
      {String(minutes).padStart(2, '0')}:
      {String(seconds).padStart(2, '0')}
    </span>
  );
}
